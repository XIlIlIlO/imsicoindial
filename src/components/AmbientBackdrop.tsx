export function AmbientBackdrop() {
  return (
    <div className="ambient-backdrop" aria-hidden="true">
      <div className="ambient-backdrop__orb ambient-backdrop__orb--one" />
      <div className="ambient-backdrop__orb ambient-backdrop__orb--two" />
      <div className="ambient-backdrop__grid" />
      <div className="ambient-backdrop__noise" />
    </div>
  );
}
