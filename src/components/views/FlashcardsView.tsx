import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { FlashcardFormModal } from './FlashcardFormModal';

export const FlashcardsView = () => {
  const {
    flashcards,
    subjects,
    currentFlashcardTheme,
    setCurrentFlashcardTheme,
    studyingFlashcardId,
    setStudyingFlashcardId,
    addFlashcard,
    deleteFlashcard,
    reviewFlashcard,
  } = useEditorStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Filter flashcards based on theme
  const filteredFlashcards = currentFlashcardTheme
    ? flashcards.filter((card) => card.subjectId === currentFlashcardTheme)
    : flashcards;

  // Get current card (either from individual study or list)
  const currentCard = studyingFlashcardId
    ? flashcards.find((card) => card.id === studyingFlashcardId) ||
      filteredFlashcards[currentIndex]
    : filteredFlashcards[currentIndex];

  const currentTheme = currentFlashcardTheme
    ? subjects.find((s) => s.id === currentFlashcardTheme)
    : null;

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [currentFlashcardTheme]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredFlashcards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev - 1 < 0 ? filteredFlashcards.length - 1 : prev - 1
      );
    }, 150);
  };

  const handleReview = (quality: number) => {
    if (currentCard) {
      reviewFlashcard(currentCard.id, quality);
      handleNext();
    }
  };

  const handleDelete = () => {
    if (currentCard) {
      deleteFlashcard(currentCard.id);
      setCurrentIndex((prev) => {
        const newLength = filteredFlashcards.length - 1;
        if (newLength === 0) return 0;
        return prev >= newLength ? prev - 1 : prev;
      });
    }
  };

  const handleAddCard = (front: string, back: string) => {
    addFlashcard(front, back, currentFlashcardTheme || undefined);
    setShowForm(false);
  };

  const handleBackToThemes = () => {
    setCurrentFlashcardTheme(null);
    setStudyingFlashcardId(null);
    setCurrentIndex(0);
  };

  // Empty state
  if (filteredFlashcards.length === 0) {
    return (
      <div className="flex-1 flex flex-col p-8">
        {currentTheme && (
          <motion.button
            onClick={handleBackToThemes}
            className="self-start mb-8 flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a temas
          </motion.button>
        )}

        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            {currentTheme ? (
              <>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  {currentTheme.icon} {currentTheme.name}
                </h2>
                <p className="text-muted-foreground mb-6">
                  No hay flashcards en este tema aún
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  No hay flashcards
                </h2>
                <p className="text-muted-foreground mb-6">
                  Crea tu primera tarjeta de memoria para comenzar a estudiar
                </p>
              </>
            )}

            <motion.button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-primary rounded-xl text-foreground font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Crear flashcard
            </motion.button>
          </motion.div>
        </div>

        <FlashcardFormModal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleAddCard}
          themeName={currentTheme?.name}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-8">
      {/* Header with back button if in theme view */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {currentTheme && (
            <motion.button
              onClick={handleBackToThemes}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {currentTheme ? (
                <>
                  {currentTheme.icon} {currentTheme.name}
                </>
              ) : (
                'Flashcards'
              )}
            </h1>
            <p className="text-muted-foreground">
              Tarjeta {currentIndex + 1} de {filteredFlashcards.length}
            </p>
          </div>
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
              className="relative h-80 cursor-pointer"
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
              onClick={handleDelete}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar esta tarjeta
            </button>
          </div>
        </motion.div>
      </div>

      <FlashcardFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddCard}
        themeName={currentTheme?.name}
      />
    </div>
  );
};
