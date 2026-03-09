import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolSchema,
  ListResourcesSchema,
  ListToolsSchema,
  ReadResourceSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

const CreateNoteSchema = z.object({
  title: z.string(),
  content: z.string(),
  subjectId: z.string().optional(),
});

const CreateFlashcardSchema = z.object({
  front: z.string(),
  back: z.string(),
  subjectId: z.string().optional(),
});

const GenerateFlashcardsSchema = z.object({
  topic: z.string(),
  count: z.number().min(1).max(20).default(5),
  subjectId: z.string().optional(),
});

class SinapsisMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'sinapsis-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsSchema, async () => {
      return {
        tools: [
          {
            name: 'create_note',
            description: 'Create a new note in Sinapsis',
            inputSchema: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Note title' },
                content: { type: 'string', description: 'Note content' },
                subjectId: { type: 'string', description: 'Optional subject ID' },
              },
              required: ['title', 'content'],
            },
          },
          {
            name: 'create_flashcard',
            description: 'Create a new flashcard',
            inputSchema: {
              type: 'object',
              properties: {
                front: { type: 'string', description: 'Front of the flashcard' },
                back: { type: 'string', description: 'Back of the flashcard' },
                subjectId: { type: 'string', description: 'Optional subject ID' },
              },
              required: ['front', 'back'],
            },
          },
          {
            name: 'generate_flashcards',
            description: 'Generate flashcards from a topic using AI',
            inputSchema: {
              type: 'object',
              properties: {
                topic: { type: 'string', description: 'Topic to generate flashcards from' },
                count: { type: 'number', description: 'Number of flashcards (1-20)', default: 5 },
                subjectId: { type: 'string', description: 'Optional subject ID' },
              },
              required: ['topic'],
            },
          },
          {
            name: 'generate_summary',
            description: 'Generate a summary from notes content using AI',
            inputSchema: {
              type: 'object',
              properties: {
                content: { type: 'string', description: 'Content to summarize' },
              },
              required: ['content'],
            },
          },
          {
            name: 'generate_quiz',
            description: 'Generate quiz questions from notes',
            inputSchema: {
              type: 'object',
              properties: {
                content: { type: 'string', description: 'Content to generate quiz from' },
                count: { type: 'number', description: 'Number of questions', default: 5 },
              },
              required: ['content'],
            },
          },
          {
            name: 'get_notes',
            description: 'Get all notes for the current user',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_flashcards',
            description: 'Get all flashcards, optionally filtered by subject',
            inputSchema: {
              type: 'object',
              properties: {
                subjectId: { type: 'string', description: 'Optional subject filter' },
              },
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_note':
            return await this.createNote(args as { title: string; content: string; subjectId?: string });

          case 'create_flashcard':
            return await this.createFlashcard(args as { front: string; back: string; subjectId?: string });

          case 'generate_flashcards':
            return await this.generateFlashcards(args as { topic: string; count?: number; subjectId?: string });

          case 'generate_summary':
            return await this.generateSummary(args as { content: string });

          case 'generate_quiz':
            return await this.generateQuiz(args as { content: string; count?: number });

          case 'get_notes':
            return await this.getNotes();

          case 'get_flashcards':
            return await this.getFlashcards(args as { subjectId?: string });

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async createNote(args: { title: string; content: string; subjectId?: string }) {
    const { title, content, subjectId } = args;
    
    // Create page with initial block
    const note = {
      id: crypto.randomUUID(),
      title,
      subjectId,
      blocks: [
        {
          id: crypto.randomUUID(),
          type: 'paragraph',
          content,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ success: true, note }, null, 2),
        },
      ],
    };
  }

  private async createFlashcard(args: { front: string; back: string; subjectId?: string }) {
    const flashcard = {
      id: crypto.randomUUID(),
      front: args.front,
      back: args.back,
      subjectId: args.subjectId,
      createdAt: new Date().toISOString(),
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ success: true, flashcard }, null, 2),
        },
      ],
    };
  }

  private async generateFlashcards(args: { topic: string; count?: number; subjectId?: string }) {
    // This would call the AI service in production
    const flashcards = [
      {
        front: `¿Qué es ${args.topic}?`,
        back: 'Respuesta generada por IA...',
      },
    ];

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ success: true, flashcards }, null, 2),
        },
      ],
    };
  }

  private async generateSummary(args: { content: string }) {
    // This would call the AI service in production
    const summary = 'Resumen generado por IA...';

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ success: true, summary }, null, 2),
        },
      ],
    };
  }

  private async generateQuiz(args: { content: string; count?: number }) {
    // This would call the AI service in production
    const questions = [
      {
        question: '¿Pregunta de ejemplo?',
        options: ['A', 'B', 'C', 'D'],
        correct: 0,
      },
    ];

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ success: true, questions }, null, 2),
        },
      ],
    };
  }

  private async getNotes() {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ success: true, notes: [] }, null, 2),
        },
      ],
    };
  }

  private async getFlashcards(args: { subjectId?: string }) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ success: true, flashcards: [] }, null, 2),
        },
      ],
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Sinapsis MCP Server running on stdio');
  }
}

export default SinapsisMCPServer;
