import { useMemo } from 'react';

const generateStars = (count: number, opacity: number) => {
  return Array.from({ length: count }).map(() => {
    const x = Math.floor(Math.random() * 2500);
    const y = Math.floor(Math.random() * 2500);
    return `${x}px ${y}px rgba(255, 255, 255, ${opacity})`;
  }).join(', ');
};

export default function Starfield() {
  // useMemo ensures we only generate the random string once per mount, 
  // preventing hydration mismatches if we were to SSR, and keeping it stable.
  const starsSmall = useMemo(() => generateStars(350, 0.4), []);
  const starsMedium = useMemo(() => generateStars(150, 0.6), []);
  const starsLarge = useMemo(() => generateStars(50, 0.8), []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <div style={{ width: '1px', height: '1px', background: 'transparent', boxShadow: starsSmall }} />
      <div style={{ width: '2px', height: '2px', background: 'transparent', boxShadow: starsMedium }} />
      <div style={{ width: '3px', height: '3px', background: 'transparent', boxShadow: starsLarge }} />
    </div>
  );
}
