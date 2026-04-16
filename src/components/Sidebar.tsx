/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  Settings, 
  AlertCircle, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Github 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'planner', label: 'Study Planner', icon: Calendar },
  { id: 'mistakes', label: 'Mistake Tracker', icon: AlertCircle },
  { id: 'revision', label: 'Revision', icon: RefreshCw },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'settings', label: 'Utilities', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  return (
    <aside className={`relative border-r border-border h-screen flex flex-col bg-panel sticky top-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-accent text-white p-1 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className={`p-6 ${isCollapsed ? 'px-4 flex justify-center' : ''}`}>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <BookOpen className="w-6 text-accent shrink-0" />
          {!isCollapsed && (
            <span>JEE ADV <span className="text-accent">2026</span></span>
          )}
        </h1>
        {!isCollapsed && <p className="text-xs text-gray-500 font-mono mt-1">SERIOUS PREP TOOL</p>}
      </div>

      <nav className={`flex-1 px-4 py-4 space-y-1 ${isCollapsed ? 'px-2' : ''}`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-accent/10 text-accent font-medium' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-accent' : 'group-hover:text-white'}`} />
              {!isCollapsed && <span className="text-sm truncate">{tab.label}</span>}
              
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1A1A] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-border">
                  {tab.label}
                </div>
              )}

              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="activeTab"
                  className="ml-auto w-1 h-4 bg-accent rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className={`p-4 border-t border-border ${isCollapsed ? 'px-3' : ''}`}>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 bg-white/5 border border-border/50 hover:bg-white/10 hover:border-accent group ${isCollapsed ? 'justify-center' : ''}`}
        >
          <Github className="w-5 h-5 text-white group-hover:text-accent" />
          {!isCollapsed && <span className="text-sm font-medium text-white">GitHub Repository</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-[#1A1A1A] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-border">
              GitHub
            </div>
          )}
        </a>
      </div>
    </aside>
  );
};
