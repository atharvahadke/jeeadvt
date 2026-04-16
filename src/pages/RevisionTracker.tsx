/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppData, RevisionTopic, Subject, TopicPriority } from '../types';
import { Plus, RotateCcw, TrendingUp, TrendingDown, Clock, Search, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface RevisionTrackerProps {
  data: AppData;
  updateData: (data: AppData) => void;
}

export const RevisionTracker: React.FC<RevisionTrackerProps> = ({ data, updateData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [newTopic, setNewTopic] = useState<Partial<RevisionTopic>>({
    subject: 'Physics',
    topic: '',
    priority: 'Medium',
    revisionCount: 0
  });

  const handleAdd = () => {
    if (!newTopic.topic) return;
    const topic: RevisionTopic = {
      ...newTopic,
      id: crypto.randomUUID(),
      revisionCount: 0
    } as RevisionTopic;

    updateData({ ...data, revisionTopics: [...data.revisionTopics, topic] });
    setNewTopic({ subject: 'Physics', topic: '', priority: 'Medium', revisionCount: 0 });
    setIsAdding(false);
  };

  const incrementRevision = (id: string) => {
    updateData({
      ...data,
      revisionTopics: data.revisionTopics.map(t => 
        t.id === id ? { ...t, revisionCount: t.revisionCount + 1, lastRevisedAt: new Date().toISOString() } : t
      )
    });
  };

  const removeTopic = (id: string) => {
    updateData({ ...data, revisionTopics: data.revisionTopics.filter(t => t.id !== id) });
  };

  const filtered = data.revisionTopics.filter(t => 
    t.topic.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    const pOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    return pOrder[a.priority] - pOrder[b.priority];
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Revision Tracker</h2>
          <p className="text-sm text-gray-400">Track iterations for every important topic.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-accent text-white px-4 py-2 rounded-md font-bold text-sm"
        >
          {isAdding ? 'Cancel' : 'New Topic'}
        </button>
      </div>

      {isAdding && (
        <div className="panel p-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-accent/5 border-accent/20">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
            <select 
              value={newTopic.subject}
              onChange={(e) => setNewTopic({ ...newTopic, subject: e.target.value as Subject })}
              className="w-full bg-bg border border-border rounded px-3 py-2 text-white text-sm"
            >
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Maths">Maths</option>
            </select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Topic Name</label>
            <input 
              type="text"
              value={newTopic.topic}
              onChange={(e) => setNewTopic({ ...newTopic, topic: e.target.value })}
              className="w-full bg-bg border border-border rounded px-3 py-2 text-white text-sm"
              placeholder="e.g. Inorganic Bonding"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Priority</label>
            <div className="flex bg-bg border border-border rounded p-1 p-2 h-10 items-center justify-around">
              {(['High', 'Medium', 'Low'] as TopicPriority[]).map(p => (
                <button
                  key={p}
                  onClick={() => setNewTopic({ ...newTopic, priority: p })}
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded transition-all ${
                    newTopic.priority === p ? (p === 'High' ? 'bg-red-500 text-white' : p === 'Medium' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white') : 'text-gray-500'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={handleAdd}
            className="md:col-span-4 bg-accent text-white py-2 rounded font-bold"
          >
            Add Topic to List
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          type="text"
          placeholder="Filter topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-panel border border-border rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(topic => (
          <div key={topic.id} className="panel p-5 group flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${topic.revisionCount > 0 ? 'bg-accent/10 text-accent' : 'bg-border text-gray-500'}`}>
                <RotateCcw className={`w-5 h-5 ${topic.revisionCount > 0 ? 'animate-spin-slow' : ''}`} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-1.5 rounded ${
                    topic.priority === 'High' ? 'bg-red-500/10 text-red-500' : topic.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {topic.priority}
                  </span>
                  <span className="text-xs text-gray-500 font-mono uppercase tracking-tighter">{topic.subject}</span>
                </div>
                <h3 className="text-white font-bold">{topic.topic}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                  <Clock className="w-3 h-3" />
                  {topic.lastRevisedAt ? `Last: ${new Date(topic.lastRevisedAt).toLocaleDateString()}` : 'Never revised'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-2xl font-black text-white leading-none">{topic.revisionCount}</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold mt-1">SESSIONS</div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => incrementRevision(topic.id)}
                  className="bg-accent/10 hover:bg-accent text-accent hover:text-white p-2 rounded transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => removeTopic(topic.id)}
                  className="p-2 text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 py-20 text-center text-gray-500 italic">
            No topics tracked for revision yet. High priority topics should be added first.
          </div>
        )}
      </div>
    </div>
  );
};
