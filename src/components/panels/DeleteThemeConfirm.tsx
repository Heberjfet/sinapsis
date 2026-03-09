import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteThemeConfirmProps {
  isOpen: boolean;
  themeName: string;
  cardCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteThemeConfirm = ({
  isOpen,
  themeName,
  cardCount,
  onConfirm,
  onCancel,
}: DeleteThemeConfirmProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card rounded-2xl p-6 border border-border/50 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-destructive/20">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Eliminar tema</h2>
              <button
                onClick={onCancel}
                className="ml-auto p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-foreground mb-2 font-medium">
                  ¿Estás seguro de que deseas eliminar el tema "{themeName}"?
                </p>
                <p className="text-sm text-destructive">
                  ⚠️ Esta acción también eliminará <strong>{cardCount} tarjeta{cardCount === 1 ? '' : 's'}</strong> asociada{cardCount === 1 ? '' : 's'} a este tema.
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-border rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-destructive rounded-xl text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors"
              >
                Eliminar tema
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
