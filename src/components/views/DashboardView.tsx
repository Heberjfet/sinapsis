import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Timer,
  BookOpen,
  Flame,
  TrendingUp,
  Calendar,
  Target,
  Award,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export const DashboardView = () => {
  const { stats, pomodoroSessions, flashcards } = useEditorStore();

  const weeklyData = [
    { day: 'Lun', minutes: 45 },
    { day: 'Mar', minutes: 60 },
    { day: 'Mié', minutes: 30 },
    { day: 'Jue', minutes: 90 },
    { day: 'Vie', minutes: 75 },
    { day: 'Sáb', minutes: 25 },
    { day: 'Dom', minutes: 40 },
  ];

  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes));

  const achievements = [
    { id: 1, title: 'Primer paso', desc: 'Completa tu primera sesión', icon: '🎯', unlocked: true },
    { id: 2, title: 'Enfoque total', desc: '3 sesiones en un día', icon: '🎯', unlocked: true },
    { id: 3, title: 'Racha de 7 días', desc: '7 días consecutivos', icon: '🔥', unlocked: false },
    { id: 4, title: 'Maestro', desc: '100 tarjetas dominadas', icon: '🏆', unlocked: false },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 max-w-6xl mx-auto"
    >
      <motion.div variants={item} className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Resumen de tu progreso de estudio</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Timer className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Tiempo total</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {Math.floor(stats.totalMinutes / 60)}h {stats.totalMinutes % 60}m
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Sesiones</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {stats.sessionsCompleted}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">Racha actual</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {stats.currentStreak} días
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-sm text-muted-foreground">Flashcards</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {flashcards.length}
          </div>
        </div>
      </motion.div>

      {/* Weekly Chart */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Esta semana</h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {weeklyData.map((day, index) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full bg-primary/30 rounded-t-lg relative min-h-[20px]"
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg" style={{ height: '100%' }} />
                </motion.div>
                <span className="text-xs text-muted-foreground">{day.day}</span>
                <span className="text-xs font-medium text-foreground">{day.minutes}m</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Progreso</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Objetivo semanal</span>
                <span className="text-foreground font-medium">350 / 500 min</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '70%' }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Dominio de flashcards</span>
                <span className="text-foreground font-medium">65%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-success rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Notas creadas</span>
                <span className="text-foreground font-medium">12</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="h-full bg-secondary rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={item}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Logros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-card rounded-2xl p-5 border border-border/50 ${
                achievement.unlocked ? '' : 'opacity-50'
              }`}
            >
              <div className="text-3xl mb-3">{achievement.icon}</div>
              <h4 className="font-medium text-foreground mb-1">{achievement.title}</h4>
              <p className="text-sm text-muted-foreground">{achievement.desc}</p>
              {achievement.unlocked && (
                <div className="mt-3 flex items-center gap-1 text-xs text-success">
                  <Award className="w-3 h-3" />
                  Desbloqueado
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
