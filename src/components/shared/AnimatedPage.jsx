import { useEffect, useState } from 'react';

export default function AnimatedPage({ children }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(15px)',
        transition: 'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}
    >
      {children}
    </div>
  );
}
