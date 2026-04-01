import { motion } from 'framer-motion';
import { formatMetricValue } from '../lib/format';
import { SpotlightPanel } from '../reactbits/SpotlightPanel';
import { SplitText } from '../reactbits/SplitText';
import type { Side, Strategy } from '../types';

type DetailPanelProps = {
  coin: string;
  side: Side;
  strategy: Strategy;
};

export function DetailPanel({ coin, side, strategy }: DetailPanelProps) {
  return (
    <motion.section
      className="detail-panel"
      key={`${coin}-${side}-${strategy.key}`}
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32 }}
    >
      <SpotlightPanel>
        <div className="detail-panel__head">
          <div className="detail-panel__eyebrow">
            <span>{coin}</span>
            <span>{side}</span>
            <span>{strategy.logicName}</span>
          </div>
          <h2 className="detail-panel__title">
            <SplitText text={strategy.subtitle} />
          </h2>
        </div>

        <div className="detail-panel__metrics">
          {strategy.metrics.map((metric, index) => (
            <motion.div
              key={`${strategy.key}-${metric.label}`}
              className="detail-metric"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.28 }}
            >
              <span className="detail-metric__label">{metric.label}</span>
              <span className="detail-metric__value">{formatMetricValue(metric.value)}</span>
            </motion.div>
          ))}
        </div>
      </SpotlightPanel>
    </motion.section>
  );
}
