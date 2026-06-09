'use client';

import { useEffect, useRef } from 'react';

export default function BgBeans() {
  const ref     = useRef(null);
  const spawned = useRef(false);

  useEffect(() => {
    if (spawned.current || !ref.current) return;
    spawned.current = true;

    for (let i = 0; i < 18; i++) {
      const el       = document.createElement('div');
      el.className   = 'bg-bean';
      el.textContent = i % 3 === 0 ? '🫘' : '☕';
      const dur      = 18 + Math.random() * 22;
      el.style.cssText =
        `left:${Math.random() * 100}%;` +
        `animation-duration:${dur}s;` +
        `animation-delay:${-(Math.random() * dur)}s`;
      ref.current.appendChild(el);
    }
  }, []);

  return <div className="bg-beans" ref={ref} />;
}
