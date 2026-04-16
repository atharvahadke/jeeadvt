/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppData } from '../types';

const STORAGE_KEY = 'jee-prep-data';

export const INITIAL_DATA: AppData = {
  dailyPlans: {},
  mistakes: [],
  revisionTopics: [],
  flowNodes: [],
  flowEdges: [],
  studyHours: {}
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_DATA;
  try {
    const data = JSON.parse(stored);
    
    // Sanity check: Ensure nodes have required React Flow properties (migration)
    if (data.flowNodes && Array.isArray(data.flowNodes)) {
      data.flowNodes = data.flowNodes.filter((n: any) => {
        return n && n.id && n.position && typeof n.position.x === 'number';
      });
    } else {
      data.flowNodes = [];
    }

    if (!data.flowEdges || !Array.isArray(data.flowEdges)) {
      data.flowEdges = [];
    }

    return { ...INITIAL_DATA, ...data };
  } catch (e) {
    console.error('Failed to parse data', e);
    return INITIAL_DATA;
  }
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportData = (data: AppData) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jee-prep-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<AppData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsText(file);
  });
};
