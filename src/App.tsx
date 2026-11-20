/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlannerProvider } from './context/PlannerContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KanbanView } from './components/KanbanView';
import { TaskModal } from './components/TaskModal';
import { ConfettiCanvas } from './components/ConfettiCanvas';

const MainLayout: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-slate-100 via-indigo-50/70 to-sky-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 text-slate-900 dark:text-slate-100 overflow-hidden select-none">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-hidden relative">
          <KanbanView />
        </main>
      </div>

      <TaskModal />
      <ConfettiCanvas />
    </div>
  );
};

export default function App() {
  return (
    <PlannerProvider>
      <MainLayout />
    </PlannerProvider>
  );
}