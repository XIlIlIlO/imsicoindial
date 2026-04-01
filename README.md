# Coin Dial Backtest Board

엑셀 파일의 `그룹명`, `LONG/SHORT`, `로직별 subtitle(예: 313 - 15%)`, 그리고 **초록색으로 강조된 백테스트 데이터만** 바로 읽어서 보여주는 로컬 React 앱이다.

## 핵심 동작

- 왼쪽: 코인 다이얼
- 가운데: LONG / SHORT 다이얼
- 오른쪽: 로직별 결과 보드
- 보드의 `O` 버튼은 **초록색으로 강조된 로직만 활성화**
- `O`를 누르면 해당 로직의 백테스트 지표가 펼쳐짐
- 한 번 보드가 뜬 뒤에는 **코인 다이얼을 바꿔도 오른쪽 보드는 유지**
- 새 코인에 대해 LONG / SHORT 를 다시 고르는 순간 보드가 새 selection 기준으로 갱신

## 폴더 구조

- `data/source.xlsx` → 교체해서 쓰는 원본 엑셀
- `scripts/import-workbook.mjs` → 엑셀을 JSON으로 변환
- `src/data/coin-strategies.generated.json` → 앱이 실제로 읽는 데이터
- `src/reactbits/*` → React Bits 스타일 fallback 컴포넌트
- `src/components/*` → 다이얼 / 보드 / 디테일 패널

## 실행 방법

```bash
npm install
npm run import:data
npm run dev
```

## 엑셀 업데이트 방법

1. `data/source.xlsx` 를 새 파일로 교체
2. 아래 명령 실행

```bash
npm run import:data
```

3. 다시 실행

```bash
npm run dev
```

## 다른 파일명을 쓰고 싶다면

직접 경로를 넘겨도 된다.

```bash
npm run import:data -- ./data/your-file-name.xlsx
```

## React Bits 연결 포인트

이 프로젝트는 바로 실행되도록 fallback 컴포넌트를 넣어둔 상태다.

원하면 아래 파일들을 공식 React Bits TS 기반 컴포넌트로 1:1 교체하면 된다.

- `src/reactbits/Magnet.tsx`
- `src/reactbits/SplitText.tsx`
- `src/reactbits/SpotlightPanel.tsx`

즉, 지금 구조는 **실행 가능 + 나중에 React Bits 공식 컴포넌트로 덮어쓰기 쉬운 상태**로 잡아뒀다.

## 현재 포함된 원본 데이터

기본으로 업로드했던 엑셀을 `data/source.xlsx` 에 넣어뒀다.
새로운 시트 형식도 다음 조건이면 그대로 읽는다.

- `그룹명` 마지막 글자에 `+` 또는 `-`
- 각 그룹 블록마다 로직 subtitle 존재
- 초록색 셀은 `FFE8F5E9` fill
- 로직은 열 방향으로 n개까지 확장 가능

