/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppData, Task, Subject } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, LayoutList, Table as TableIcon, GitBranch, Share2, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactFlow, { 
  Background, 
  BackgroundVariant,
  Controls, 
  Connection, 
  Edge, 
  Node, 
  addEdge, 
  useNodesState, 
  useEdgesState,
  ConnectionMode,
  MarkerType,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import { StudyNode } from '../components/Flow/StudyNode';

const nodeTypes = {
  studyNode: StudyNode,
};

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#3B82F6', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#3B82F6',
  },
};

interface StudyPlannerProps {
  data: AppData;
  updateData: (data: AppData) => void;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ data, updateData }) => {
  const [view, setView] = useState<'text' | 'table' | 'flow'>('table');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const currentDayPlan = data.dailyPlans[selectedDate] || { textPlan: '', tablePlan: [] };

  const updateDayPlan = (newPlan: Partial<typeof currentDayPlan>) => {
    updateData({
      ...data,
      dailyPlans: {
        ...data.dailyPlans,
        [selectedDate]: { ...currentDayPlan, ...newPlan }
      }
    });
  };

  const addTask = () => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      time: '09:00',
      subject: 'Physics',
      topic: '',
      status: 'Pending'
    };
    updateDayPlan({ tablePlan: [...currentDayPlan.tablePlan, newTask] });
  };

  const removeTask = (id: string) => {
    updateDayPlan({ tablePlan: currentDayPlan.tablePlan.filter(t => t.id !== id) });
  };

  const toggleTask = (id: string) => {
    updateDayPlan({
      tablePlan: currentDayPlan.tablePlan.map(t => 
        t.id === id ? { ...t, status: t.status === 'Done' ? 'Pending' : 'Done' } : t
      )
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    updateDayPlan({
      tablePlan: currentDayPlan.tablePlan.map(t => t.id === id ? { ...t, ...updates } : t)
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Study Planner</h2>
          <div className="flex items-center gap-2 mt-1">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-panel border border-border text-sm text-accent rounded px-2 py-1 font-mono focus:outline-none"
            />
          </div>
        </div>
        
        <div className="flex bg-panel border border-border rounded-lg p-1">
          {[
            { id: 'text', icon: LayoutList, label: 'Text' },
            { id: 'table', icon: TableIcon, label: 'Table' },
            { id: 'flow', icon: GitBranch, label: 'Flow' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id as any)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm transition-all ${
                view === v.id ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <v.icon className="w-4 h-4" />
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'text' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="panel p-6 h-[500px] flex flex-col"
          >
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Quick Daily Notes</label>
            <textarea 
              value={currentDayPlan.textPlan}
              onChange={(e) => updateDayPlan({ textPlan: e.target.value })}
              className="flex-1 bg-bg border border-border rounded-lg p-4 text-white focus:outline-none focus:border-accent resize-none font-mono leading-7"
              placeholder="08:00 - Start Thermodynamics&#10;11:00 - PYQs Practice&#10;..."
            />
          </motion.div>
        )}

        {view === 'table' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="panel overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-bg border-bottom border-border">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Topic / Task</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentDayPlan.tablePlan.map((task) => (
                    <tr key={task.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <button onClick={() => toggleTask(task.id)} className="text-accent hover:scale-110 transition-transform">
                          {task.status === 'Done' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 font-mono">
                        <input 
                          type="time" 
                          value={task.time}
                          onChange={(e) => updateTask(task.id, { time: e.target.value })}
                          className="bg-transparent border-none text-white focus:ring-0 focus:outline-none w-24"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={task.subject}
                          onChange={(e) => updateTask(task.id, { subject: e.target.value as Subject })}
                          className="bg-bg border border-border rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-accent"
                        >
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Maths">Maths</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="text" 
                          value={task.topic}
                          onChange={(e) => updateTask(task.id, { topic: e.target.value })}
                          placeholder="What are we studying?"
                          className={`bg-transparent border-none text-white focus:ring-0 focus:outline-none w-full ${task.status === 'Done' ? 'line-through text-gray-500' : ''}`}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => removeTask(task.id)}
                          className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button 
              onClick={addTask}
              className="w-full py-4 border-t border-dashed border-border text-xs font-bold text-gray-500 uppercase hover:bg-white/5 hover:text-accent transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Session
            </button>
          </motion.div>
        )}

        {view === 'flow' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="panel min-h-[600px] border-none"
          >
            <FlowPlanner data={data} updateData={updateData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Flow Planner Sub-component using React Flow
const FlowPlanner: React.FC<{ data: AppData; updateData: (d: AppData) => void }> = ({ data, updateData }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(data.flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.flowEdges);

  // Sync state to global data whenever local nodes or edges change
  React.useEffect(() => {
    // Check if data is actually different to avoid infinite loops
    // In a real app we might use a deep equality check or a ref
    updateData({ ...data, flowNodes: nodes, flowEdges: edges });
  }, [nodes, edges]);

  const onConnect = (params: Connection | Edge) => {
    setEdges((eds) => addEdge(params, eds));
  };

  const onNodeLabelChange = (id: string, label: string) => {
    setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, label } } : n));
  };

  const onNodeStatusChange = (id: string, status: string) => {
    setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, status } } : n));
  };

  const onNodeDataChange = (id: string, updates: any) => {
    setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...updates } } : n));
  };

  const onDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  const addNewNode = () => {
    const id = crypto.randomUUID();
    const newNode: Node = {
      id,
      type: 'studyNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { 
        label: 'New Task', 
        type: 'TOPIC',
        status: 'idle'
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Enhance nodes with current callbacks
  const enhancedNodes = React.useMemo(() => nodes.map(n => ({
    ...n,
    data: {
      ...n.data,
      onChange: onNodeLabelChange,
      onStatusChange: onNodeStatusChange,
      onChangeNodeData: onNodeDataChange,
      onDelete: onDeleteNode
    }
  })), [nodes]);

  return (
    <div className="w-full h-[700px] relative bg-[#0C0C0C] rounded-xl overflow-hidden border border-border">
      <ReactFlow
        nodes={enhancedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background 
          gap={24} 
          size={1} 
          color="#262626" 
          variant={BackgroundVariant.Dots} 
        />
        <MiniMap 
          style={{ height: 120, background: '#141414', borderRadius: 8, border: '1px solid #262626' }}
          nodeColor="#3B82F6"
          maskColor="rgba(0, 0, 0, 0.3)"
          activeColor="#3B82F6"
        />
        <Controls className="bg-panel border-border fill-white" />
      </ReactFlow>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button 
          onClick={addNewNode}
          className="bg-accent text-white px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Node
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-panel border border-border p-3 rounded-md shadow-xl text-[10px] text-gray-500 font-mono space-y-1">
          <p className="flex items-center gap-2"><MousePointer2 className="w-3 h-3"/> Drag to move nodes</p>
          <p className="flex items-center gap-2"><Share2 className="w-3 h-3"/> Drag from handles to connect</p>
          <p className="flex items-center gap-2"><Plus className="w-3 h-3"/> Add nodes via button</p>
        </div>
      </div>
    </div>
  );
};
