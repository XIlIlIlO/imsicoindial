import { useEffect, useMemo, useState } from 'react';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { DetailPanel } from './components/DetailPanel';
import { DialWheel } from './components/DialWheel';
import { StrategyBoard } from './components/StrategyBoard';
import workbookData from './data/coin-strategies.generated.json';
import type { CoinEntry, Side, Strategy, WorkbookData } from './types';

const data = workbookData as WorkbookData;
const sideOrder: Side[] = ['LONG', 'SHORT'];

function getFirstAvailableSide(entry: CoinEntry): Side | null {
  return sideOrder.find((side) => Boolean(entry.sides[side])) ?? null;
}

export default function App() {
  const coins = data.coins;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCoin, setActiveCoin] = useState(coins[0]?.coin ?? '');
  const [activeSide, setActiveSide] = useState<Side | null>(null);
  const [openedStrategyKey, setOpenedStrategyKey] = useState<string | null>(null);

  const coinMap = useMemo(() => new Map(coins.map((entry) => [entry.coin, entry])), [coins]);

  const filteredCoins = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return coins;

    return coins.filter((entry) => entry.coin.toLowerCase().includes(normalizedQuery));
  }, [coins, searchQuery]);

  useEffect(() => {
    if (filteredCoins.length === 0) {
      setActiveCoin('');
      return;
    }

    if (!filteredCoins.some((entry) => entry.coin === activeCoin)) {
      setActiveCoin(filteredCoins[0].coin);
    }
  }, [filteredCoins, activeCoin]);

  const activeEntry = activeCoin ? (coinMap.get(activeCoin) ?? null) : null;

  useEffect(() => {
    if (!activeEntry) {
      setActiveSide(null);
      return;
    }

    const nextSide = activeSide && activeEntry.sides[activeSide] ? activeSide : getFirstAvailableSide(activeEntry);

    if (nextSide !== activeSide) {
      setActiveSide(nextSide);
    }
  }, [activeEntry, activeSide]);

  const currentStrategies = activeEntry && activeSide ? activeEntry.sides[activeSide]?.strategies ?? [] : [];

  useEffect(() => {
    if (!currentStrategies.length) {
      setOpenedStrategyKey(null);
      return;
    }

    const selectedHighlighted = currentStrategies.some(
      (strategy) => strategy.highlighted && strategy.key === openedStrategyKey,
    );

    if (selectedHighlighted) return;

    const firstHighlighted = currentStrategies.find((strategy) => strategy.highlighted);
    setOpenedStrategyKey(firstHighlighted?.key ?? null);
  }, [currentStrategies, openedStrategyKey]);

  const openedStrategy: Strategy | null =
    currentStrategies.find(
      (strategy) => strategy.highlighted && strategy.key === openedStrategyKey,
    ) ?? null;

  const coinItems = filteredCoins.map((entry) => ({
    id: entry.coin,
    label: entry.coin,
  }));

  const sideItems = sideOrder.map((side) => ({
    id: side,
    label: side,
    disabled: !activeEntry?.sides[side],
  }));

  const selectCoin = (coin: string) => {
    setActiveCoin(coin);
  };

  const selectSide = (sideId: string) => {
    const side = sideId as Side;
    if (!activeEntry?.sides[side]) return;
    setActiveSide(side);
  };

  return (
    <div className="app-shell">
      <AmbientBackdrop />

      <div className="app-frame">
        <div className="app-frame__column app-frame__column--coins">
          <div className="coin-column">
            <div className="coin-search">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="코인 검색"
                aria-label="코인 검색"
                className="coin-search__input"
              />
            </div>

            <div className="coin-column__wheel">
              {coinItems.length ? (
                <DialWheel items={coinItems} selectedId={activeCoin} onSelect={selectCoin} />
              ) : (
                <div className="dial-placeholder">검색 결과가 없습니다</div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`app-frame__column app-frame__column--sides ${activeEntry ? 'is-ready' : 'is-dormant'}`}
        >
          {activeEntry ? (
            <DialWheel
              items={sideItems}
              selectedId={activeSide ?? sideItems.find((item) => !item.disabled)?.id ?? sideItems[0].id}
              onSelect={selectSide}
              density={112}
              itemClassName="dial-wheel__item--side"
            />
          ) : (
            <div className="dial-placeholder">선택 가능한 코인이 없습니다</div>
          )}
        </div>

        <div className="app-frame__column app-frame__column--board">
          {activeEntry && activeSide ? (
            <>
              <StrategyBoard
                coin={activeCoin}
                side={activeSide}
                strategies={currentStrategies}
                selectedStrategyKey={openedStrategyKey}
                onOpenStrategy={setOpenedStrategyKey}
              />
              {openedStrategy ? (
                <DetailPanel coin={activeCoin} side={activeSide} strategy={openedStrategy} />
              ) : (
                <div className="empty-state empty-state--compact">O 표시가 있는 로직 칸을 선택하면 상세결과가 표시됩니다.</div>
              )}
            </>
          ) : (
            <div className="empty-state">선택 가능한 LONG / SHORT 데이터가 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
