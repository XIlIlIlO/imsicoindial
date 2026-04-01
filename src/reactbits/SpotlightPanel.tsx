import type { PropsWithChildren } from 'react';

export function SpotlightPanel({ children }: PropsWithChildren) {
  return <div className="spotlight-panel">{children}</div>;
}
