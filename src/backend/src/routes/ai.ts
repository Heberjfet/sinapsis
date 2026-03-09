import { Router, Request, Response } from 'express';
import { aiService } from '../services/ai';

const router = Router();

router.post('/ai/flashcards', async (req: Request, res: Response) => {
  try {
    const { topic, count = 5, subjectId } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const flashcards = await aiService.generateFlashcards(topic, count);
    res.json({ flashcards, subjectId });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ error: 'Failed to generate flashcards' });
  }
});

router.post('/ai/summary', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const summary = await aiService.generateSummary(content);
    res.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

router.post('/ai/quiz', async (req: Request, res: Response) => {
  try {
    const { content, count = 5 } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const questions = await aiService.generateQuiz(content, count);
    res.json({ questions });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

router.post('/ai/study-plan', async (req: Request, res: Response) => {
  try {
    const { topic, days = 7 } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const plan = await aiService.generateStudyPlan(topic, days);
    res.json({ plan });
  } catch (error) {
    console.error('Error generating study plan:', error);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
});

router.post('/ai/explain', async (req: Request, res: Response) => {
  try {
    const { concept } = req.body;
    
    if (!concept) {
      return res.status(400).json({ error: 'Concept is required' });
    }

    const explanation = await aiService.explainConcept(concept);
    res.json({ explanation });
  } catch (error) {
    console.error('Error explaining concept:', error);
    res.status(500).json({ error: 'Failed to explain concept' });
  }
});

export default router;
