import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashcardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (front: string, back: string) => void;
  themeName?: string;
}

export const FlashcardFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  themeName,
}: FlashcardFormModalProps) => {
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  const handleSubmit = () => {
    if (newFront.trim() && newBack.trim()) {
      onSubmit(newFront, newBack);
      setNewFront('');
      setNewBack('');
    }
  };

  const handleClose = () => {
    setNewFront('');
    setNewBack('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="w-full max-w-md bg-card rounded-2xl p-6 border border-border/50 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Nueva Flashcard
              {themeName && <span className="text-muted-foreground text-base font-normal ml-2">en {themeName}</span>}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Pregunta (Frente)
                </label>
                <textarea
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-xl border-none outline-none text-foreground placeholder:text-muted-foreground resize-none"
                  rows={3}
                  placeholder="Escribe la pregunta..."
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Respuesta (Reverso)
                </label>
                <textarea
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-xl border-none outline-none text-foreground placeholder:text-muted-foreground resize-none"
                  rows={3}
                  placeholder="Escribe la respuesta..."
                />
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
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-primary rounded-xl text-foreground font-medium"
              >
                Crear
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
