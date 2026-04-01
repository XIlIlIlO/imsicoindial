import {
  type CSSProperties,
  type MouseEvent,
  type PropsWithChildren,
  useRef,
  useState,
} from 'react';

export type MagnetProps = PropsWithChildren<{
  className?: string;
  strength?: number;
  disabled?: boolean;
  as?: 'div' | 'button';
  style?: CSSProperties;
  onClick?: () => void;
}>;

export function Magnet({
  children,
  className,
  strength = 14,
  disabled = false,
  as = 'div',
  style,
  onClick,
}: MagnetProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [transform, setTransform] = useState('translate3d(0px, 0px, 0px)');
  const Tag = as;

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    if (disabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);

    setTransform(
      `translate3d(${(offsetX / rect.width) * strength}px, ${(offsetY / rect.height) * strength}px, 0px)`,
    );
  };

  const reset = () => setTransform('translate3d(0px, 0px, 0px)');

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      className={className}
      style={{
        ...style,
        transform,
        transition: 'transform 180ms cubic-bezier(.2,.8,.2,1)',
        willChange: 'transform',
      }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
