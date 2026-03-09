import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Trash2,
  Edit,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export const FlashcardsView = () => {
  const { flashcards, addFlashcard, deleteFlashcard, reviewFlashcard } = useEditorStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  const currentCard = flashcards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const handleReview = (quality: number) => {
    if (currentCard) {
      reviewFlashcard(currentCard.id, quality);
      handleNext();
    }
  };

  const handleAddCard = () => {
    if (newFront.trim() && newBack.trim()) {
      addFlashcard(newFront, newBack);
      setNewFront('');
      setNewBack('');
      setShowForm(false);
    }
  };

  if (flashcards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            No hay flashcards
          </h2>
          <p className="text-muted-foreground mb-6">
            Crea tu primera tarjeta de memoria para comenzar a estudiar
          </p>
          <motion.button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-primary rounded-xl text-foreground font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Crear flashcard
          </motion.button>
        </motion.div>

        {/* Add Form Modal */}
        <AnimatePresence>
          {showForm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                onClick={() => setShowForm(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-2xl p-6 border border-border/50 shadow-xl z-50"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Nueva Flashcard
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
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-xl text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddCard}
                    className="flex-1 px-4 py-2 bg-primary rounded-xl text-foreground font-medium"
                  >
                    Crear
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Flashcards</h1>
          <p className="text-muted-foreground">
            Tarjeta {currentIndex + 1} de {flashcards.length}
          </p>
        </div>
        <motion.button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary rounded-xl text-foreground font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Nueva tarjeta
        </motion.button>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.3 }}
              onClick={handleFlip}
              className="relative h-80 cursor-pointer perspective-1000"
              style={{ perspective: 1000 }}
            >
              <motion.div
                className="w-full h-full relative"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 bg-card rounded-2xl p-8 border border-border/50 shadow-lg flex flex-col items-center justify-center"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                  }}
                >
                  <div className="text-sm text-muted-foreground mb-4">PREGUNTA</div>
                  <div className="text-2xl font-semibold text-foreground text-center">
                    {currentCard.front}
                  </div>
                  <div className="mt-6 text-xs text-muted-foreground">
                    Haz clic para voltear
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 bg-primary/10 rounded-2xl p-8 border border-primary/30 shadow-lg flex flex-col items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="text-sm text-primary mb-4">RESPUESTA</div>
                  <div className="text-xl text-foreground text-center">
                    {currentCard.back}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              onClick={handlePrev}
              className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </motion.button>

            <div className="flex gap-2">
              <motion.button
                onClick={() => handleReview(1)}
                className="px-4 py-2 bg-destructive/20 text-destructive rounded-xl font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                No recuerdo
              </motion.button>
              <motion.button
                onClick={() => handleReview(3)}
                className="px-4 py-2 bg-accent text-foreground rounded-xl font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Recordar
              </motion.button>
              <motion.button
                onClick={() => handleReview(5)}
                className="px-4 py-2 bg-success text-foreground rounded-xl font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Perfecto
              </motion.button>
            </div>

            <motion.button
              onClick={handleNext}
              className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </motion.button>
          </div>

          {/* Delete button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                deleteFlashcard(currentCard.id);
                if (currentIndex >= flashcards.length - 1) {
                  setCurrentIndex(Math.max(0, currentIndex - 1));
                }
              }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar esta tarjeta
            </button>
          </div>
        </motion.div>
      </div>

      {/* Add Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-2xl p-6 border border-border/50 shadow-xl z-50"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Nueva Flashcard
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
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-xl text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCard}
                  className="flex-1 px-4 py-2 bg-primary rounded-xl text-foreground font-medium"
                >
                  Crear
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
