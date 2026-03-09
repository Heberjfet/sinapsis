import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notesRouter from './routes/notes';
import aiRouter from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', notesRouter);
app.use('/api', aiRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mcp: 'available',
    ai: 'available'
  });
});

// MCP Server endpoint (for Claude Desktop integration)
app.get('/mcp', (req: Request, res: Response) => {
  res.json({
    name: 'sinapsis-mcp',
    version: '1.0.0',
    tools: [
      'create_note',
      'create_flashcard',
      'generate_flashcards',
      'generate_summary',
      'generate_quiz',
      'get_notes',
      'get_flashcards'
    ]
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`
🔥 Sinapsis Backend running on http://localhost:${PORT}
   
   Endpoints:
   - GET  /api/health          - Health check
   - GET  /api/pages           - List notes
   - POST /api/pages           - Create note
   - POST /api/ai/flashcards   - Generate flashcards
   - POST /api/ai/summary      - Generate summary
   - POST /api/ai/quiz         - Generate quiz
   - POST /api/ai/study-plan   - Generate study plan
   - POST /api/ai/explain      - Explain concept
   
   MCP Server: Available via stdio
  `);
});

export default app;
