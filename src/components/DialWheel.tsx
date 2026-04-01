import { motion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { Magnet } from '../reactbits/Magnet';
import { clampIndex } from '../lib/format';

type DialItem = {
  id: string;
  label: string;
  disabled?: boolean;
};

type DialWheelProps = {
  items: DialItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
  density?: number;
  itemClassName?: string;
};

export function DialWheel({
  items,
  selectedId,
  onSelect,
  className = '',
  density = 78,
  itemClassName = '',
}: DialWheelProps) {
  const wheelLock = useRef(false);
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.id === selectedId),
  );

  const visibleItems = useMemo(() => {
    const withDistance = items.map((item, index) => ({
      ...item,
      index,
      distance: index - selectedIndex,
    }));

    return withDistance.filter((item) => Math.abs(item.distance) <= 5);
  }, [items, selectedIndex]);

  const move = (direction: 1 | -1) => {
    const nextIndex = clampIndex(selectedIndex + direction, items.length);
    const next = items[nextIndex];

    if (next && !next.disabled) {
      onSelect(next.id);
      return;
    }

    const scanOrder = direction === 1
      ? Array.from({ length: items.length - nextIndex }, (_, i) => nextIndex + i)
      : Array.from({ length: nextIndex + 1 }, (_, i) => nextIndex - i);

    const fallback = scanOrder
      .map((index) => items[index])
      .find((candidate) => candidate && !candidate.disabled);

    if (fallback) {
      onSelect(fallback.id);
    }
  };

  return (
    <div
      className={`dial-wheel ${className}`.trim()}
      onWheel={(event) => {
        event.preventDefault();
        if (wheelLock.current) return;
        wheelLock.current = true;
        const direction = event.deltaY > 0 ? 1 : -1;
        move(direction as 1 | -1);
        window.setTimeout(() => {
          wheelLock.current = false;
        }, 120);
      }}
    >
      <div className="dial-wheel__rail" />
      <div className="dial-wheel__viewport">
        {visibleItems.map((item) => {
          const absDistance = Math.abs(item.distance);
          const active = item.id === selectedId;
          const scale = Math.max(0.54, 1 - absDistance * 0.12);
          const opacity = Math.max(0.16, 1 - absDistance * 0.18);
          const blur = absDistance * 1.4;
          const translateY = item.distance * density;
          const translateX = active ? 0 : absDistance * 7;

          return (
            <motion.div
              key={item.id}
              className={`dial-wheel__item-wrap ${active ? 'is-active' : ''}`}
              animate={{
                y: translateY,
                x: translateX,
                scale,
                opacity,
                filter: `blur(${blur}px)`,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.8 }}
            >
              <Magnet
                as="button"
                strength={active ? 12 : 8}
                disabled={item.disabled}
                className={`dial-wheel__item ${active ? 'is-active' : ''} ${item.disabled ? 'is-disabled' : ''} ${itemClassName}`.trim()}
                onClick={() => {
                  if (!item.disabled) onSelect(item.id);
                }}
              >
                <span>{item.label}</span>
              </Magnet>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
