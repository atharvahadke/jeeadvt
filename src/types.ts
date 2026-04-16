/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Node, Edge } from 'reactflow';

export type Subject = 'Physics' | 'Chemistry' | 'Maths';

export type MistakeTag = 'Conceptual' | 'Silly mistake' | 'Calculation error';

export interface Mistake {
  id: string;
  subject: Subject;
  topic: string;
  description: string;
  correctConcept: string;
  tags: MistakeTag[];
  createdAt: string;
}

export type TopicPriority = 'High' | 'Medium' | 'Low';

export interface RevisionTopic {
  id: string;
  subject: Subject;
  topic: string;
  revisionCount: number;
  priority: TopicPriority;
  lastRevisedAt?: string;
}

export interface Task {
  id: string;
  time: string;
  subject: Subject;
  topic: string;
  status: 'Pending' | 'Done';
}

export interface AppData {
  dailyPlans: Record<string, { textPlan: string; tablePlan: Task[] }>;
  mistakes: Mistake[];
  revisionTopics: RevisionTopic[];
  flowNodes: Node[];
  flowEdges: Edge[];
  studyHours: Record<string, number>; // date: hours
}

