import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const COLORS = [
  '#A0C4FF', '#CAFFBF', '#FFEEB5', '#FFD6FF',
  '#FF9999', '#99CCFF', '#99FF99', '#FFCC99',
  '#FF99CC', '#99FFCC', '#CCCCFF', '#FFFFCC',
];

const ICONS = [
  '📐', '🔬', '📜', '🌍',
  '📚', '🧮', '🎨', '🎭',
  '🏛️', '⚡', '🔐', '🎯',
  '🌟', '💡', '🔬', '📊',
];

export const CreateThemeModal = () => {
  const { showCreateThemeModal, setShowCreateThemeModal, createSubject } = useEditorStore();
  const [themeName, setThemeName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const handleCreate = () => {
    if (themeName.trim()) {
      createSubject(themeName, selectedColor, selectedIcon);
      setThemeName('');
      setSelectedColor(COLORS[0]);
      setSelectedIcon(ICONS[0]);
      setShowCreateThemeModal(false);
    }
  };

  const handleClose = () => {
    setThemeName('');
    setSelectedColor(COLORS[0]);
    setSelectedIcon(ICONS[0]);
    setShowCreateThemeModal(false);
  };

  return (
    <AnimatePresence>
      {showCreateThemeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card rounded-2xl p-6 border border-border/50 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Crear nuevo tema</h2>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Theme Name */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Nombre del tema
                </label>
                <input
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="Ej: Ciberseguridad"
                  className="w-full px-4 py-3 bg-muted rounded-xl border-none outline-none text-foreground placeholder:text-muted-foreground"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                  }}
                  autoFocus
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Icono ({selectedIcon})
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className={`p-2 rounded-lg text-xl transition-all ${
                        selectedIcon === icon
                          ? 'bg-primary/30 border-2 border-primary'
                          : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-full h-10 rounded-lg border-2 transition-all ${
                        selectedColor === color ? 'border-foreground scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-border rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!themeName.trim()}
                className="flex-1 px-4 py-2 bg-primary rounded-xl text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear tema
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
