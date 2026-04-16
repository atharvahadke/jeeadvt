/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MoreVertical, Check, X, Trash2 } from 'lucide-react';

export const StudyNode = ({ data, id }: NodeProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const status = data.status || 'idle'; // 'completed' | 'not-completed' | 'idle'

  const getStatusStyles = () => {
    switch(status) {
      case 'completed': return {
        border: 'border-green-500/50',
        bg: 'bg-green-500/5',
        title: 'text-green-400',
        glow: 'shadow-[0_0_15px_-5px_rgba(34,197,94,0.3)]'
      };
      case 'not-completed': return {
        border: 'border-red-500/50',
        bg: 'bg-red-500/5',
        title: 'text-red-400',
        glow: 'shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]'
      };
      default: return {
        border: 'border-border',
        bg: 'bg-panel/80',
        title: 'text-white',
        glow: 'shadow-xl'
      };
    }
  };

  const styles = getStatusStyles();

  return (
    <div 
      className={`group relative min-w-[180px] p-0 rounded-xl border transition-all duration-300 backdrop-blur-sm ${styles.border} ${styles.bg} ${styles.glow}`}
    >
      {/* Custom Styles for Handles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .react-flow__handle {
          width: 8px !important;
          height: 8px !important;
          background: #3B82F6 !important;
          border: 2px solid #0C0C0C !important;
          transition: transform 0.2s ease !important;
        }
        .react-flow__handle:hover {
          transform: scale(1.5) !important;
        }
      `}} />

      {/* 4 Universal Connectors (Source & Target mixed for maximum flexibility) */}
      <Handle type="target" position={Position.Top} id="t-top" className="!top-[-4px]" />
      <Handle type="source" position={Position.Top} id="s-top" className="!top-[-4px]" />
      
      <Handle type="target" position={Position.Bottom} id="t-bottom" className="!bottom-[-4px]" />
      <Handle type="source" position={Position.Bottom} id="s-bottom" className="!bottom-[-4px]" />
      
      <Handle type="target" position={Position.Left} id="t-left" className="!left-[-4px]" />
      <Handle type="source" position={Position.Left} id="s-left" className="!left-[-4px]" />
      
      <Handle type="target" position={Position.Right} id="t-right" className="!right-[-4px]" />
      <Handle type="source" position={Position.Right} id="s-right" className="!right-[-4px]" />

      {/* Header bar */}
      <div className={`h-1.5 w-full rounded-t-xl opacity-50 ${status === 'completed' ? 'bg-green-500' : status === 'not-completed' ? 'bg-red-500' : 'bg-accent'}`} />

      <div className="p-4 pt-3 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <select
                value={data.type || 'TASK'}
                onChange={(e) => data.onChangeNodeData?.(id, { type: e.target.value })}
                className="text-[9px] bg-white/5 border-none text-gray-400 uppercase font-mono tracking-widest focus:outline-none rounded px-1"
              >
                <option value="TASK">Task</option>
                <option value="TOPIC">Topic</option>
                <option value="DATE">Date</option>
                <option value="REVISION">Revision</option>
              </select>
            </div>
            <input
              defaultValue={data.label}
              onBlur={(e) => data.onChange(id, e.target.value)}
              className={`bg-transparent border-none font-medium text-sm focus:outline-none w-full leading-tight ${styles.title}`}
            />
          </div>
          
          {/* Action Menu - Click Activated */}
          <div className="relative">
            <button 
              className={`p-1.5 rounded-md transition-all ${showMenu ? 'bg-accent text-white scale-110' : 'text-gray-500 hover:text-white bg-white/5'}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 bg-[#1A1A1A] border border-border rounded-lg shadow-2xl z-50 flex flex-col p-1.5 min-w-[160px] animate-in fade-in zoom-in duration-150">
                  <header className="px-2 py-1 mb-1 border-b border-border/50">
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Update Status</p>
                  </header>
                  <button 
                    onClick={() => {
                      data.onStatusChange(id, 'completed');
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-green-500 hover:bg-green-500/10 rounded-md transition-colors w-full text-left"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark Completed
                  </button>
                  <button 
                    onClick={() => {
                      data.onStatusChange(id, 'not-completed');
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors w-full text-left"
                  >
                    <X className="w-3.5 h-3.5" /> Mark Incomplete
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button 
                    onClick={() => {
                      data.onDelete(id);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-md transition-colors w-full text-left border border-transparent hover:border-red-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Node
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {status !== 'idle' && (
          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase w-fit ${
            status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <div className={`w-1 h-1 rounded-full ${status === 'completed' ? 'bg-green-400' : 'bg-red-400'}`} />
            {status.replace('-', ' ')}
          </div>
        )}
      </div>
    </div>
  );
};
