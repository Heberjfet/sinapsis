import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  CheckCircle,
  Settings,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export const PomodoroPanel = () => {
  const {
    pomodoroActive,
    pomodoroType,
    pomodoroTimeRemaining,
    pomodoroSettings,
    stats,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    tickPomodoro,
  } = useEditorStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pomodoroActive) {
      interval = setInterval(() => {
        tickPomodoro();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, tickPomodoro]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    let totalSeconds: number;
    switch (pomodoroType) {
      case 'short-break':
        totalSeconds = pomodoroSettings.shortBreakDuration * 60;
        break;
      case 'long-break':
        totalSeconds = pomodoroSettings.longBreakDuration * 60;
        break;
      default:
        totalSeconds = pomodoroSettings.focusDuration * 60;
    }
    return ((totalSeconds - pomodoroTimeRemaining) / totalSeconds) * 100;
  };

  const getTypeColor = () => {
    switch (pomodoroType) {
      case 'short-break':
        return 'text-success';
      case 'long-break':
        return 'text-secondary';
      default:
        return 'text-primary';
    }
  };

  const getTypeLabel = () => {
    switch (pomodoroType) {
      case 'short-break':
        return 'Descanso corto';
      case 'long-break':
        return 'Descanso largo';
      default:
        return 'Enfoque';
    }
  };

  const getTypeIcon = () => {
    switch (pomodoroType) {
      case 'short-break':
        return Coffee;
      case 'long-break':
        return Brain;
      default:
        return Timer;
    }
  };

  const TypeIcon = getTypeIcon();

  // Calculate circle parameters
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (getProgress() / 100) * circumference;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
        <Timer className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-foreground">Pomodoro</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Timer Circle */}
        <div className="relative w-52 h-52 mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={getTypeColor()}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                strokeDasharray: circumference,
              }}
            />
          </svg>

          {/* Timer Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <TypeIcon className={`w-8 h-8 mb-2 ${getTypeColor()}`} />
            <motion.div
              key={pomodoroTimeRemaining}
              initial={{ scale: 1.1, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold text-foreground"
            >
              {formatTime(pomodoroTimeRemaining)}
            </motion.div>
            <span className="text-sm text-muted-foreground mt-1">
              {getTypeLabel()}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-8">
          <motion.button
            onClick={resetPomodoro}
            className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Reiniciar"
          >
            <RotateCcw className="w-5 h-5 text-foreground" />
          </motion.button>

          <motion.button
            onClick={pomodoroActive ? pausePomodoro : () => startPomodoro()}
            className={`p-4 rounded-full ${
              pomodoroActive
                ? 'bg-destructive/20 hover:bg-destructive/30'
                : 'bg-success/20 hover:bg-success/30'
            } transition-colors`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {pomodoroActive ? (
              <Pause className={`w-8 h-8 ${pomodoroActive ? 'text-destructive' : 'text-success'}`} />
            ) : (
              <Play className="w-8 h-8 text-success ml-1" />
            )}
          </motion.button>
        </div>

        {/* Type Selection */}
        <div className="flex gap-2 mb-8">
          {(['focus', 'short-break', 'long-break'] as const).map((type) => {
            const isActive = pomodoroType === type;
            const label = type === 'focus' ? 'Enfoque' : type === 'short-break' ? 'Descanso' : 'Largo';
            const Icon = type === 'focus' ? Timer : type === 'short-break' ? Coffee : Brain;

            return (
              <motion.button
                key={type}
                onClick={() => !pomodoroActive && startPomodoro(type)}
                disabled={pomodoroActive}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary/30'
                    : 'hover:bg-muted'
                } disabled:opacity-50`}
                whileHover={!pomodoroActive ? { scale: 1.05 } : {}}
                whileTap={!pomodoroActive ? { scale: 0.95 } : {}}
              >
                <Icon className={`w-4 h-4 ${isActive ? getTypeColor() : 'text-muted-foreground'}`} />
                <span className={`text-xs ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-4 border-t border-border/30">
        <h3 className="text-sm font-medium text-foreground mb-3">Estadísticas</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Tiempo total</span>
            </div>
            <div className="text-lg font-semibold text-foreground">
              {Math.floor(stats.totalMinutes / 60)}h {stats.totalMinutes % 60}m
            </div>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Sesiones</span>
            </div>
            <div className="text-lg font-semibold text-foreground">
              {stats.sessionsCompleted}
            </div>
          </div>
          <div className="bg-muted rounded-xl p-3 col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🔥</span>
              <span className="text-xs text-muted-foreground">Racha actual</span>
            </div>
            <div className="text-lg font-semibold text-foreground">
              {stats.currentStreak} días consecutivos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
