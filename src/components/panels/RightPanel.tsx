import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Timer, Music, X } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { AIPanel } from './AIPanel';
import { PomodoroPanel } from './PomodoroPanel';
import { MusicPanel } from './MusicPanel';

export const RightPanel = () => {
  const { rightPanelOpen, rightPanelTab, toggleRightPanel, setRightPanelTab } = useEditorStore();

  const tabs = [
    { id: 'ai' as const, icon: Sparkles, label: 'IA' },
    { id: 'pomodoro' as const, icon: Timer, label: 'Pomodoro' },
    { id: 'music' as const, icon: Music, label: 'Música' },
  ];

  return (
    <AnimatePresence>
      {rightPanelOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="h-full bg-card border-l border-border/50 flex flex-col overflow-hidden"
        >
          {/* Tab Bar */}
          <div className="flex items-center border-b border-border/30">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = rightPanelTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setRightPanelTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-colors relative ${
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}

            <button
              onClick={toggleRightPanel}
              className="p-2 mx-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={rightPanelTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {rightPanelTab === 'ai' && <AIPanel />}
                {rightPanelTab === 'pomodoro' && <PomodoroPanel />}
                {rightPanelTab === 'music' && <MusicPanel />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
