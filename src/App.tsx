/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KanbanView } from './components/KanbanView';
import { TaskModal } from './components/TaskModal';
import { ConfettiCanvas } from './components/ConfettiCanvas';

const MainLayout: React.FC = () => {
  const { isSidebarOpen } = usePlanner();

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden select-none">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-hidden relative bg-slate-50/50 dark:bg-slate-950/50">
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