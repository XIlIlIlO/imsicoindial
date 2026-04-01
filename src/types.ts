export type Side = 'LONG' | 'SHORT';

export type Metric = {
  label: string;
  value: number | string | null;
};

export type Strategy = {
  key: string;
  logicName: string;
  subtitle: string;
  highlighted: boolean;
  metrics: Metric[];
};

export type SideData = {
  groupName: string;
  strategies: Strategy[];
};

export type CoinEntry = {
  coin: string;
  sides: Partial<Record<Side, SideData>>;
};

export type WorkbookData = {
  meta: {
    sourceFile: string;
    sheetName: string;
    coinCount: number;
    logicCount: number;
    groupCount: number;
  };
  coins: CoinEntry[];
};
