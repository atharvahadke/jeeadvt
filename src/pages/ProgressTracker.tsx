/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppData, Subject } from '../types';
import { Target, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

interface ProgressTrackerProps {
  data: AppData;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ data }) => {
  const subjects: Subject[] = ['Physics', 'Chemistry', 'Maths'];
  
  const stats = subjects.map(s => {
    const mistakes = data.mistakes.filter(m => m.subject === s).length;
    const revisions = data.revisionTopics.filter(t => t.subject === s);
    const totalRevisions = revisions.reduce((a, b) => a + b.revisionCount, 0);
    const topicsUnderControl = revisions.filter(t => t.revisionCount >= 3).length;
    
    return {
      name: s,
      mistakes,
      topicsTracked: revisions.length,
      topicsUnderControl,
      totalRevisions
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Progress Analytics</h2>
          <p className="text-sm text-gray-400">Deep dive into your preparation metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(s => (
          <div key={s.name} className="panel p-6 space-y-6 border-t-4" style={{ borderTopColor: s.name === 'Physics' ? 'var(--color-physics)' : s.name === 'Chemistry' ? 'var(--color-chemistry)' : 'var(--color-maths)' }}>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-black text-white">{s.name.toUpperCase()}</h3>
              <Target className={`w-5 h-5 ${s.name === 'Physics' ? 'text-physics' : s.name === 'Chemistry' ? 'text-chemistry' : 'text-maths'}`} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase">
                  <AlertCircle className="w-3 h-3" /> Mistakes
                </div>
                <span className="text-lg font-mono text-white">{s.mistakes}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase">
                  <BookOpen className="w-3 h-3" /> Topics Tracked
                </div>
                <span className="text-lg font-mono text-white">{s.topicsTracked}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase">
                  <CheckCircle className="w-3 h-3" /> Mastered (3+ Rev)
                </div>
                <span className="text-lg font-mono text-accent">{s.topicsUnderControl}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Preparedness</p>
              <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full opacity-80 ${s.name === 'Physics' ? 'bg-physics' : s.name === 'Chemistry' ? 'bg-chemistry' : 'bg-maths'}`}
                  style={{ width: `${s.topicsTracked > 0 ? (s.topicsUnderControl / s.topicsTracked) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel p-8 text-center space-y-4">
         <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Global Preparedness Index</h3>
         <div className="text-6xl font-black text-white italic tracking-tighter">
           {Math.round((stats.reduce((a, b) => a + b.topicsUnderControl, 0) / Math.max(stats.reduce((a, b) => a + b.topicsTracked, 0), 1)) * 100)}%
         </div>
         <p className="text-xs text-gray-500 max-w-sm mx-auto">
           This index is calculated based on topics that have been revised at least 3 times. 
           Keep revising to push this to 100%.
         </p>
      </div>
    </div>
  );
};
