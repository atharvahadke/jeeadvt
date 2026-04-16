/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppData, Mistake, Subject, MistakeTag } from '../types';
import { Plus, Search, Filter, Trash2, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MistakesProps {
  data: AppData;
  updateData: (data: AppData) => void;
}

export const Mistakes: React.FC<MistakesProps> = ({ data, updateData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filterSubject, setFilterSubject] = useState<Subject | 'All'>('All');
  const [search, setSearch] = useState('');
  
  const [newMistake, setNewMistake] = useState<Partial<Mistake>>({
    subject: 'Physics',
    topic: '',
    description: '',
    correctConcept: '',
    tags: []
  });

  const handleAddMistake = () => {
    if (!newMistake.topic || !newMistake.description) return;
    
    const mistake: Mistake = {
      ...(newMistake as Omit<Mistake, 'id' | 'createdAt'>),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    } as Mistake;

    updateData({
      ...data,
      mistakes: [...data.mistakes, mistake]
    });
    setNewMistake({ subject: 'Physics', topic: '', description: '', correctConcept: '', tags: [] });
    setIsAdding(false);
  };

  const deleteMistake = (id: string) => {
    updateData({
      ...data,
      mistakes: data.mistakes.filter(m => m.id !== id)
    });
  };

  const toggleTag = (tag: MistakeTag) => {
    const currentTags = newMistake.tags || [];
    if (currentTags.includes(tag)) {
      setNewMistake({ ...newMistake, tags: currentTags.filter(t => t !== tag) });
    } else {
      setNewMistake({ ...newMistake, tags: [...currentTags, tag] });
    }
  };

  const filteredMistakes = data.mistakes.filter(m => {
    const matchesSubject = filterSubject === 'All' || m.subject === filterSubject;
    const matchesSearch = m.topic.toLowerCase().includes(search.toLowerCase()) || 
                          m.description.toLowerCase().includes(search.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Mistake Tracker</h2>
          <p className="text-sm text-gray-400">Log and analyze your errors to avoid repeating them.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md transition-colors"
        >
          {isAdding ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'Add Mistake'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="panel p-6 space-y-4 border-accent/30 bg-accent/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
                  <select 
                    value={newMistake.subject}
                    onChange={(e) => setNewMistake({ ...newMistake, subject: e.target.value as Subject })}
                    className="w-full bg-bg border border-border rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Maths">Maths</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Topic</label>
                  <input 
                    type="text"
                    value={newMistake.topic}
                    onChange={(e) => setNewMistake({ ...newMistake, topic: e.target.value })}
                    placeholder="e.g. Rotational Dynamics"
                    className="w-full bg-bg border border-border rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Mistake Description</label>
                <textarea 
                  value={newMistake.description}
                  onChange={(e) => setNewMistake({ ...newMistake, description: e.target.value })}
                  rows={2}
                  className="w-full bg-bg border border-border rounded px-3 py-2 text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Correct Concept</label>
                <textarea 
                  value={newMistake.correctConcept}
                  onChange={(e) => setNewMistake({ ...newMistake, correctConcept: e.target.value })}
                  rows={2}
                  className="w-full bg-bg border border-border rounded px-3 py-2 text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase block">Tags</label>
                <div className="flex gap-2">
                  {(['Conceptual', 'Silly mistake', 'Calculation error'] as MistakeTag[]).map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        newMistake.tags?.includes(tag) 
                          ? 'bg-accent/20 border-accent text-accent' 
                          : 'border-border text-gray-500 hover:border-gray-400'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleAddMistake}
                className="w-full bg-accent text-white py-2 rounded-md font-bold mt-2"
              >
                Log Mistake
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text"
            placeholder="Search mistakes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-panel border border-border rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex gap-2">
          {(['All', 'Physics', 'Chemistry', 'Maths'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterSubject(s)}
              className={`px-4 py-2 rounded-md text-sm border transition-all ${
                filterSubject === s ? 'bg-panel border-accent text-accent' : 'bg-panel border-border text-gray-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMistakes.map(m => (
          <motion.div 
            layout
            key={m.id} 
            className="panel p-5 group flex flex-col md:flex-row gap-4 border-l-4"
            style={{ borderLeftColor: m.subject === 'Physics' ? 'var(--color-physics)' : m.subject === 'Chemistry' ? 'var(--color-chemistry)' : 'var(--color-maths)' }}
          >
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-border text-gray-400 rounded">
                      {m.subject}
                    </span>
                    <h3 className="text-lg font-bold text-white">{m.topic}</h3>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">{m.description}</p>
                </div>
                <button 
                  onClick={() => deleteMistake(m.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {m.correctConcept && (
                <div className="bg-bg p-3 rounded border border-border/50 text-sm italic">
                  <span className="text-accent font-bold not-italic mr-2">Core Concept:</span>
                  <span className="text-gray-400">{m.correctConcept}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                {m.tags.map(t => (
                  <span key={t} className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase px-2 py-0.5 bg-border rounded-full">
                    <Tag className="w-3 h-3" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
        {filteredMistakes.length === 0 && (
          <div className="py-20 text-center text-gray-500 italic">
            No mistakes found matching filters.
          </div>
        )}
      </div>
    </div>
  );
};
