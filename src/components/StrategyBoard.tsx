import { motion } from 'framer-motion';
import type { Side, Strategy } from '../types';

type StrategyBoardProps = {
  coin: string;
  side: Side;
  strategies: Strategy[];
  selectedStrategyKey: string | null;
  onOpenStrategy: (key: string | null) => void;
};

export function StrategyBoard({
  coin,
  side,
  strategies,
  selectedStrategyKey,
  onOpenStrategy,
}: StrategyBoardProps) {
  return (
    <section className="strategy-board">
      <div className="strategy-board__meta">
        <span className="strategy-board__meta-label">BOARD</span>
        <span className="strategy-board__meta-value">
          {coin} / {side}
        </span>
      </div>

      <div className="strategy-board__grid">
        {strategies.map((strategy, index) => {
          const clickable = strategy.highlighted;
          const active = clickable && strategy.key === selectedStrategyKey;

          return (
            <motion.button
              type="button"
              key={strategy.key}
              className={`strategy-card ${active ? 'is-active' : ''} ${clickable ? 'is-clickable' : 'is-locked'}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.42 }}
              onClick={() => {
                if (clickable) onOpenStrategy(strategy.key);
              }}
              disabled={!clickable}
            >
              <div className="strategy-card__logic">{strategy.logicName}</div>
              <div className="strategy-card__subtitle">{strategy.subtitle}</div>
              <div className="strategy-card__footer">
                {strategy.highlighted ? (
                  <div className={`strategy-card__open ${active ? 'is-active' : ''}`}>
                    <span>O</span>
                  </div>
                ) : (
                  <div className="strategy-card__empty">—</div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}