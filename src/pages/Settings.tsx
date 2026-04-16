/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppData } from '../types';
import { exportData, importData, INITIAL_DATA } from '../utils/storage';
import { Download, Upload, Trash2, Database, ShieldAlert, FileJson } from 'lucide-react';
import sampleData from '../data/sample.json';

interface SettingsProps {
  data: AppData;
  updateData: (data: AppData) => void;
}

export const Settings: React.FC<SettingsProps> = ({ data, updateData }) => {
  
  const loadSample = () => {
    if (window.confirm('Load sample data? This will overwrite your current data.')) {
      updateData(sampleData as any);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await importData(file);
        if (window.confirm('This will overwrite current data. Continue?')) {
          updateData(imported);
          alert('Data imported successfully!');
        }
      } catch (err) {
        alert('Failed to import data. Invalid file format.');
      }
    }
  };

  const resetData = () => {
    if (window.confirm('CRITICAL ACTION: This will delete ALL study records. Are you absolutely sure?')) {
      updateData(INITIAL_DATA);
    }
  };

  const dataSize = new Blob([JSON.stringify(data)]).size;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">System Utilities</h2>
        <p className="text-sm text-gray-400">Manage your local data and backups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="panel p-6 space-y-4">
          <div className="flex items-center gap-3 text-accent mb-4">
            <Database className="w-6 h-6" />
            <h3 className="font-bold">Data Management</h3>
          </div>
          
          <p className="text-sm text-gray-400 leading-relaxed">
            All your data is stored locally in your browser's persistent storage. 
            No cloud backup is active. Regular exports are recommended.
          </p>

          <div className="grid grid-cols-1 gap-3 pt-2">
            <button 
              onClick={() => exportData(data)}
              className="flex items-center justify-center gap-2 bg-panel border border-border hover:bg-white/5 py-3 rounded-lg text-sm font-bold transition-all"
            >
              <Download className="w-4 h-4" /> Export study_data.json
            </button>

            <button 
              onClick={loadSample}
              className="flex items-center justify-center gap-2 bg-accent/10 border border-accent/30 hover:bg-accent text-accent hover:text-white py-3 rounded-lg text-sm font-bold transition-all"
            >
              <FileJson className="w-4 h-4" /> Load Sample Data
            </button>
            
            <label className="flex items-center justify-center gap-2 bg-panel border border-border hover:bg-white/5 py-3 rounded-lg text-sm font-bold transition-all cursor-pointer">
              <Upload className="w-4 h-4" /> Import Backup
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          <div className="p-3 bg-bg/50 rounded border border-border flex justify-between items-center text-[10px] font-mono text-gray-500">
            <span>CURRENT PAYLOAD SIZE:</span>
            <span>{(dataSize / 1024).toFixed(2)} KB</span>
          </div>
        </div>

        <div className="panel p-6 space-y-4 border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-3 text-red-500 mb-4">
            <ShieldAlert className="w-6 h-6" />
            <h3 className="font-bold">Danger Zone</h3>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed">
            These actions are irreversible. Manual reset is required if data 
            corruption occurs during browser cleaning.
          </p>

          <button 
            onClick={resetData}
            className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-lg text-sm font-bold transition-all w-full"
          >
            <Trash2 className="w-4 h-4" /> Wipe All Local Data
          </button>
        </div>
      </div>

      <div className="panel p-8 flex flex-col items-center justify-center text-center opacity-50">
        <div className="p-4 bg-border rounded-full mb-4">
          <ShieldAlert className="w-8 h-8 text-gray-500" />
        </div>
        <h4 className="font-bold text-gray-400">JEE ADVANCED 2026 OFFICIAL ENV</h4>
        <p className="text-xs text-gray-500 mt-2 max-w-xs">
          Built for high-performance revision. Distraction free. No trackers. 
          Just your preparation metrics.
        </p>
      </div>
    </div>
  );
};
