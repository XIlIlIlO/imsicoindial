export function formatMetricValue(value: number | string | null) {
  if (value === null || value === undefined || value === '') return '-';

  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return value.toLocaleString('ko-KR');
    }

    return value.toLocaleString('ko-KR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  return String(value);
}

export function clampIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return Math.max(0, Math.min(index, length - 1));
}
