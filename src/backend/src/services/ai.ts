import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key',
});

export interface FlashcardData {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export class AIService {
  async generateFlashcards(topic: string, count: number = 5): Promise<FlashcardData[]> {
    const prompt = `
Genera ${count} tarjetas de memoria (flashcards) sobre el tema: "${topic}"

Formato JSON array sin markdown:
[
  {"front": "pregunta", "back": "respuesta"},
  ...
]
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    try {
      const content = response.choices[0]?.message?.content || '[]';
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  async generateSummary(content: string): Promise<string> {
    const prompt = `
Resume el siguiente contenido de manera clara y concisa:

${content}

Resumen:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'No se pudo generar el resumen';
  }

  async generateQuiz(content: string, count: number = 5): Promise<QuizQuestion[]> {
    const prompt = `
Basado en el siguiente contenido, genera ${count} preguntas de quiz con 4 opciones cada una:

${content}

Formato JSON array:
[
  {"question": "pregunta", "options": ["A", "B", "C", "D"], "correct": 0},
  ...
]
(correct es el índice de la respuesta correcta: 0=A, 1=B, 2=C, 3=D)
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    try {
      const content = response.choices[0]?.message?.content || '[]';
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  async generateStudyPlan(topic: string, days: number = 7): Promise<string> {
    const prompt = `
Crea un plan de estudio para ${days} días sobre el tema: "${topic}"

Formato:
Día 1: ...
Día 2: ...
etc.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || 'No se pudo generar el plan';
  }

  async explainConcept(concept: string): Promise<string> {
    const prompt = `
Explica el siguiente concepto de manera clara y sencilla:

${concept}

Incluye:
- Definición
- Ejemplos prácticos
- Errores comunes a evitar
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 800,
    });

    return response.choices[0]?.message?.content || 'No se pudo generar la explicación';
  }
}

export const aiService = new AIService();
