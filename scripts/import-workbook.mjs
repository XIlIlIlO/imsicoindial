import ExcelJS from 'exceljs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const inputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(projectRoot, 'data', 'source.xlsx');
const outputPath = path.join(projectRoot, 'src', 'data', 'coin-strategies.generated.json');

function normalizeCellValue(value) {
  if (value == null) return null;
  if (typeof value === 'object') {
    if ('result' in value && value.result != null) return value.result;
    if ('text' in value && value.text != null) return value.text;
    if ('richText' in value && Array.isArray(value.richText)) {
      return value.richText.map((part) => part.text ?? '').join('');
    }
  }
  return value;
}

function readText(sheet, row, col) {
  const value = normalizeCellValue(sheet.getCell(row, col).value);
  return value == null ? '' : String(value).trim();
}

function parseGroupName(rawName) {
  const value = String(rawName ?? '').trim();
  const sign = value.slice(-1);

  if (sign === '+' || sign === '-') {
    return {
      groupName: value,
      coin: value.slice(0, -1).trim(),
      side: sign === '+' ? 'LONG' : 'SHORT',
    };
  }

  return {
    groupName: value,
    coin: value,
    side: 'UNKNOWN',
  };
}

function isHighlightedCell(cell) {
  const fill = cell?.fill;
  const fg = fill?.fgColor?.argb ?? fill?.fgColor?.rgb ?? null;
  return fill?.type === 'pattern' && fill?.pattern === 'solid' && fg === 'FFE8F5E9';
}

function detectGroupStartRows(sheet) {
  const rows = [];
  let prevGroupName = '';

  for (let row = 2; row <= sheet.rowCount; row += 1) {
    const groupName = readText(sheet, row, 2);
    if (!groupName) continue;
    if (groupName !== prevGroupName) {
      rows.push(row);
      prevGroupName = groupName;
    }
  }

  return rows;
}

function detectLogicColumns(sheet, firstGroupRow) {
  const columns = [];
  let prevHeader = '';

  for (let col = 3; col <= sheet.columnCount; col += 1) {
    const header = readText(sheet, 1, col);
    const subtitle = readText(sheet, firstGroupRow, col);
    if (!header && !subtitle) continue;
    if (header && header !== prevHeader) {
      columns.push(col);
      prevHeader = header;
      continue;
    }
    if (!header && subtitle) {
      columns.push(col);
    }
  }

  return columns;
}

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(inputPath);
  const sheet = workbook.worksheets[0];

  if (!sheet) {
    throw new Error('워크시트를 찾지 못했습니다.');
  }

  const groupStartRows = detectGroupStartRows(sheet);
  if (!groupStartRows.length) {
    throw new Error('그룹 시작 행을 찾지 못했습니다. 엑셀 형식을 확인해주세요.');
  }

  const logicColumns = detectLogicColumns(sheet, groupStartRows[0]);
  const coinMap = new Map();

  groupStartRows.forEach((startRow, index) => {
    const endRow = index < groupStartRows.length - 1 ? groupStartRows[index + 1] - 1 : sheet.rowCount;
    const parsed = parseGroupName(readText(sheet, startRow, 2));
    if (!parsed.coin) return;

    const strategies = logicColumns.map((col) => {
      const metrics = [];
      let highlighted = false;

      for (let row = startRow + 1; row <= endRow; row += 1) {
        const labelCell = sheet.getCell(row, col);
        const valueCell = sheet.getCell(row, col + 1);
        const label = normalizeCellValue(labelCell.value);
        const value = normalizeCellValue(valueCell.value);

        if (label == null && value == null) continue;

        metrics.push({
          label: String(label ?? '').trim(),
          value,
        });

        if (isHighlightedCell(labelCell) || isHighlightedCell(valueCell)) {
          highlighted = true;
        }
      }

      const logicName = readText(sheet, 1, col) || `로직${col}`;
      const subtitle = readText(sheet, startRow, col) || logicName;

      return {
        key: `${parsed.groupName}-${logicName}-${subtitle.replace(/\s+/g, '')}`,
        logicName,
        subtitle,
        highlighted,
        metrics,
      };
    });

    const existing = coinMap.get(parsed.coin) ?? { coin: parsed.coin, sides: {} };
    existing.sides[parsed.side] = {
      groupName: parsed.groupName,
      strategies,
    };
    coinMap.set(parsed.coin, existing);
  });

  const result = {
    meta: {
      sourceFile: path.basename(inputPath),
      sheetName: sheet.name,
      coinCount: coinMap.size,
      logicCount: logicColumns.length,
      groupCount: groupStartRows.length,
    },
    coins: Array.from(coinMap.values()).sort((a, b) => a.coin.localeCompare(b.coin)),
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf-8');
  console.log(`데이터 변환 완료: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
