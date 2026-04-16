/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { StudyPlanner } from './pages/StudyPlanner';
import { Mistakes } from './pages/Mistakes';
import { RevisionTracker } from './pages/RevisionTracker';
import { ProgressTracker } from './pages/ProgressTracker';
import { Settings } from './pages/Settings';
import { loadData, saveData } from './utils/storage';
import { AppData } from './types.ts';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [data, setData] = useState<AppData>(loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const updateData = (newData: AppData) => {
    setData(newData);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} />;
      case 'planner':
        return <StudyPlanner data={data} updateData={updateData} />;
      case 'mistakes':
        return <Mistakes data={data} updateData={updateData} />;
      case 'revision':
        return <RevisionTracker data={data} updateData={updateData} />;
      case 'progress':
        return <ProgressTracker data={data} />;
      case 'settings':
        return <Settings data={data} updateData={updateData} />;
      default:
        return <Dashboard data={data} />;
    }
  };

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      
      <main className="flex-1 p-8 max-w-6xl mx-auto overflow-y-auto h-screen transition-all">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

