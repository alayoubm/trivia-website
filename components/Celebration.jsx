'use client';

import { useEffect, useRef } from 'react';
import { EMOJIS } from '@/data/questions';

export default function Celebration({ trigger }) {
  const ref      = useRef(null);
  const prevTrig = useRef(trigger);

  useEffect(() => {
    if (trigger === prevTrig.current) return;
    prevTrig.current = trigger;

    const box = ref.current;
    if (!box) return;

    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;

    for (let i = 0; i < 16; i++) {
      const el       = document.createElement('div');
      el.className   = 'particle';
      el.textContent = EMOJIS[i % EMOJIS.length];

      const ang = (i / 16) * Math.PI * 2;
      const d   = 90 + Math.random() * 130;
      const dx  = Math.cos(ang) * d;
      const dy  = Math.sin(ang) * d - 80;
      const dr  = (Math.random() - 0.5) * 720;
      const dur = (0.75 + Math.random() * 0.45).toFixed(2) + 's';

      el.style.cssText =
        `left:${cx}px;top:${cy}px;font-size:${18 + Math.random() * 14}px;` +
        `--dx:${dx}px;--dy:${dy}px;--dr:${dr}deg;--dur:${dur}`;

      box.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }
  }, [trigger]);

  return <div id="celebration" ref={ref} />;
}
