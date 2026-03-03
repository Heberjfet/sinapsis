import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Palette,
  Timer,
  Bell,
  Shield,
  Link,
  Download,
  Trash2,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export const SettingsView = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const settingsSections = [
    {
      id: 'profile',
      icon: User,
      label: 'Perfil',
      description: 'Información de tu cuenta',
    },
    {
      id: 'appearance',
      icon: Palette,
      label: 'Apariencia',
      description: 'Tema, colores y visualización',
    },
    {
      id: 'pomodoro',
      icon: Timer,
      label: 'Pomodoro',
      description: 'Configuración del temporizador',
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notificaciones',
      description: 'Alertas y recordatorios',
    },
    {
      id: 'integrations',
      icon: Link,
      label: 'Integraciones',
      description: 'Spotify, Spotify y más',
    },
    {
      id: 'privacy',
      icon: Shield,
      label: 'Privacidad',
      description: 'Seguridad y datos',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 max-w-4xl mx-auto"
    >
      <motion.div variants={item} className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Configuración</h1>
        <p className="text-muted-foreground">Personaliza tu experiencia en Sinapsis</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <motion.div variants={item} className="lg:col-span-1">
          <div className="bg-card rounded-2xl p-4 border border-border/50 space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-left"
                >
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {section.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {section.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4">Perfil</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <button className="px-4 py-2 bg-primary rounded-xl text-sm font-medium text-foreground">
                  Cambiar foto
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Nombre
                </label>
                <input
                  type="text"
                  defaultValue="Estudiante"
                  className="w-full px-4 py-2 bg-muted rounded-xl border-none outline-none text-foreground"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="estudiante@ejemplo.com"
                  className="w-full px-4 py-2 bg-muted rounded-xl border-none outline-none text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4">Apariencia</h2>

            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-3 block">Tema</label>
              <div className="flex gap-3">
                {[
                  { id: 'light', icon: Sun, label: 'Claro' },
                  { id: 'dark', icon: Moon, label: 'Oscuro' },
                  { id: 'system', icon: Monitor, label: 'Sistema' },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as typeof theme)}
                      className={`flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                        theme === t.id
                          ? 'bg-primary/30 border-2 border-primary'
                          : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-foreground" />
                      <span className="text-sm text-foreground">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pomodoro Section */}
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Configuración Pomodoro
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Enfoque (min)
                </label>
                <input
                  type="number"
                  value={focusDuration}
                  onChange={(e) => setFocusDuration(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-muted rounded-xl border-none outline-none text-foreground"
                  min={1}
                  max={60}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Descanso corto (min)
                </label>
                <input
                  type="number"
                  value={shortBreak}
                  onChange={(e) => setShortBreak(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-muted rounded-xl border-none outline-none text-foreground"
                  min={1}
                  max={30}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Descanso largo (min)
                </label>
                <input
                  type="number"
                  value={longBreak}
                  onChange={(e) => setLongBreak(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-muted rounded-xl border-none outline-none text-foreground"
                  min={1}
                  max={60}
                />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Notificaciones
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Notificaciones de escritorio
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Recibir alertas cuando termine el Pomodoro
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow"
                    animate={{ x: notifications ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Efectos de sonido
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Reproducir sonido al completar tareas
                  </div>
                </div>
                <button
                  onClick={() => setSoundEffects(!soundEffects)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    soundEffects ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow"
                    animate={{ x: soundEffects ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-card rounded-2xl p-6 border border-destructive/30">
            <h2 className="text-lg font-semibold text-destructive mb-4">
              Zona de peligro
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-xl text-muted-foreground hover:bg-muted transition-colors">
                <Download className="w-4 h-4" />
                Exportar datos
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-destructive/50 text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" />
                Eliminar cuenta
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
