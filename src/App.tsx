/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KanbanView } from './components/KanbanView';
import { CalendarView } from './components/CalendarView';
import { GanttTimelineView } from './components/GanttTimelineView';
import { EisenhowerMatrixView } from './components/EisenhowerMatrixView';
import { HabitsTrackerView } from './components/HabitsTrackerView';
import { AnalyticsView } from './components/AnalyticsView';
import { TaskModal } from './components/TaskModal';
import { CustomRubroModal } from './components/CustomRubroModal';
import { CommandPalette } from './components/CommandPalette';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { MobileBottomNav } from './components/MobileBottomNav';

const MainLayout: React.FC = () => {
  const { viewMode } = usePlanner();

  const renderActiveView = () => {
    switch (viewMode) {
      case 'kanban':
        return <KanbanView />;
      case 'calendar':
        return <CalendarView />;
      case 'gantt':
        return <GanttTimelineView />;
      case 'matrix':
        return <EisenhowerMatrixView />;
      case 'habits':
        return <HabitsTrackerView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <KanbanView />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden select-none">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-hidden relative bg-slate-50/50 dark:bg-slate-950/50">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Anchor */}
      <MobileBottomNav />

      {/* Global Modals & Confetti */}
      <TaskModal />
      <CustomRubroModal />
      <CommandPalette />
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
