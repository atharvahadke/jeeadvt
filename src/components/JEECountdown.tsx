/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const JEECountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [daysCount, setDaysCount] = useState<number>(0);

  useEffect(() => {
    const targetDate = new Date('2026-05-17T00:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setDaysCount(0);
        setTimeLeft('EXAM DAY');
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setDaysCount(days);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel p-6 flex items-center justify-between bg-gradient-to-br from-panel to-bg border-accent/20">
      <div>
        <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">JEE Advanced Countdown</p>
        <h2 className="text-4xl font-black text-white tracking-tighter">
          {daysCount} <span className="text-xl font-normal text-gray-400">DAYS LEFT</span>
        </h2>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500 font-mono mb-1">PRECISION RELOAD</p>
        <div className="text-xl font-mono text-accent font-bold tabular-nums">
          {timeLeft}
        </div>
      </div>
    </div>
  );
};
