/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { JEECountdown } from '../components/JEECountdown';
import { AppData, Subject } from '../types';
import { BarChart3, Target, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  data: AppData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayPlan = data.dailyPlans[today];
  const tasksDone = todayPlan?.tablePlan.filter(t => t.status === 'Done').length || 0;
  const totalTasks = todayPlan?.tablePlan.length || 0;
  
  const weeklyHours = Object.values(data.studyHours).reduce((a, b) => (a as number) + (b as number), 0);
  
  const subjects: Subject[] = ['Physics', 'Chemistry', 'Maths'];
  const subjectMistakes = subjects.map(s => ({
    name: s,
    count: data.mistakes.filter(m => m.subject === s).length
  }));
  
  const weakestSubject = [...subjectMistakes].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="space-y-6">
      <JEECountdown />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Progress */}
        <div className="panel p-5 space-y-4">
          <div className="flex items-center gap-2 text-accent">
            <Target className="w-5 h-5" />
            <h3 className="font-semibold">Today's Focus</h3>
          </div>
          {totalTasks > 0 ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Completion</span>
                <span className="text-white font-mono">{tasksDone}/{totalTasks}</span>
              </div>
              <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-accent h-full transition-all duration-500" 
                  style={{ width: `${(tasksDone / totalTasks) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No tasks planned for today.</p>
          )}
        </div>

        {/* Study Hours */}
        <div className="panel p-5 space-y-4">
          <div className="flex items-center gap-2 text-yellow-500">
            <Clock className="w-5 h-5" />
            <h3 className="font-semibold">Weekly Effort</h3>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{weeklyHours}h</p>
            <p className="text-xs text-gray-500 mt-1 uppercase">Total logged hours this week</p>
          </div>
        </div>

        {/* Weak Area */}
        <div className="panel p-5 space-y-4">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">Critical Review</h3>
          </div>
          {data.mistakes.length > 0 ? (
            <div>
              <p className="text-xl font-bold text-white">{weakestSubject.name}</p>
              <p className="text-xs text-gray-400 mt-1">
                {weakestSubject.count} mistakes recorded here. Priority revision needed.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Good job! No mistakes recorded.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="panel p-5 h-64 flex flex-col">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Subject Distributions</h3>
          <div className="flex-1 flex items-end gap-4 px-2">
            {subjectMistakes.map(s => {
              const max = Math.max(...subjectMistakes.map(x => x.count), 1);
              const height = (s.count / max) * 100;
              const colorClass = s.name === 'Physics' ? 'bg-physics' : s.name === 'Chemistry' ? 'bg-chemistry' : 'bg-maths';
              return (
                <div key={s.name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="text-xs font-mono text-gray-500">{s.count}</div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    className={`w-full ${colorClass} rounded-t-sm opacity-80 hover:opacity-100 transition-opacity`}
                  />
                  <div className="text-[10px] uppercase font-bold text-gray-400">{s.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel p-5 h-64 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Mistakes</h3>
          <div className="space-y-3">
            {data.mistakes.slice(-3).reverse().map(m => (
              <div key={m.id} className="p-3 bg-bg/50 border border-border/50 rounded flex gap-3">
                <div className={`w-1 h-full rounded ${m.subject === 'Physics' ? 'bg-physics' : m.subject === 'Chemistry' ? 'bg-chemistry' : 'bg-maths'}`} />
                <div>
                  <p className="text-xs font-bold text-gray-300">{m.topic}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">{m.description}</p>
                </div>
              </div>
            ))}
            {data.mistakes.length === 0 && (
              <p className="text-center text-sm text-gray-500 mt-12 py-4 italic border border-dashed border-border rounded">No mistakes yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
