import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Send,
  FileText,
  Lightbulb,
  HelpCircle,
  BookOpen,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export const AIPanel = () => {
  const { currentPageId, pages, addBlock } = useEditorStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: '¡Hola! Soy Sinapsis AI. Puedo ayudarte a:\n\n📝 **Resumir** tus notas\n💡 Generar **ideas** y explicaciones\n❓ Crear **preguntas** de examen\n📇 Generar **flashcards**\n\n¿En qué puedo ayudarte hoy?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentPage = pages.find((p) => p.id === currentPageId);

  const quickActions = [
    {
      id: 'summarize',
      label: 'Resumir nota',
      icon: FileText,
      action: () => handleQuickAction('Resumir el contenido de esta nota en puntos clave.'),
    },
    {
      id: 'explain',
      label: 'Explicar',
      icon: Lightbulb,
      action: () => handleQuickAction('Explicar este concepto de forma sencilla.'),
    },
    {
      id: 'quiz',
      label: 'Crear quiz',
      icon: HelpCircle,
      action: () => handleQuickAction('Generar 5 preguntas tipo test sobre este contenido.'),
    },
    {
      id: 'flashcards',
      label: 'Generar flashcards',
      icon: BookOpen,
      action: () => handleQuickAction('Crear tarjetas de memoria (flashcards) con los conceptos clave.'),
    },
  ];

  const handleQuickAction = async (prompt: string) => {
    setInput(prompt);
    await handleSend(prompt);
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText, currentPage);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponse,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (prompt: string, page?: typeof currentPage): string => {
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes('resumir') || lowerPrompt.includes('resumen')) {
      return `## Resumen de la nota

${page ? `Basado en "${page.title}"` : ''}

### Puntos clave:

1. **Concepto principal**: Este tema aborda ideas fundamentales que son importantes para el aprendizaje.

2. **Ideas secundarias**: Se desarrollan varios puntos de apoyo que complementan la idea principal.

3. **Aplicación práctica**: El conocimiento puede aplicarse en diferentes contextos.

> 💡 *Consejo*: Repasa estos puntos regularmente para mejorar la retención.`;
    }

    if (lowerPrompt.includes('pregunta') || lowerPrompt.includes('quiz') || lowerPrompt.includes('examen')) {
      return `## Preguntas de Repaso

### Pregunta 1
¿Cuál es el concepto principal tratado en esta nota?

- [ ] Opción A
- [x] **Opción correcta** (respuesta ejemplo)
- [ ] Opción C
- [ ] Opción D

### Pregunta 2
Sobre el tema mencionado, ¿cuál es la mejor aplicación práctica?

*Respuesta: La aplicación práctica más relevante sería...*`;
    }

    if (lowerPrompt.includes('flashcard') || lowerPrompt.includes('tarjeta')) {
      return `## Flashcards Generadas

### Tarjeta 1
**Frente**: ¿Cuál es el concepto principal?
**Reverso**: El concepto principal es [contenido de la nota]

### Tarjeta 2
**Frente**: ¿Cómo se aplica este conocimiento?
**Reverso**: Se aplica mediante [acción específica]

### Tarjeta 3
**Frente**: ¿Cuál es un error común?
**Reverso**: Un error común es [error común]

---
*Estas tarjetas se han añadido a tu mazo de estudio.*`;
    }

    return `## Respuesta de Sinapsis AI

Entiendo tu pregunta sobre "${prompt}".

${page ? `Analizando tu nota "${page.title}"...` : ''}

### Análisis:

Basándome en tu solicitud, te puedo indicar que:

1. **Contexto**: Esta pregunta se relaciona con el aprendizaje activo.

2. **Recomendación**: Te sugiero utilizar el sistema de flashcards para mejor retención.

3. **Próximo paso**: ¿Te gustaría que profundice en algún aspecto específico?

---
*¿Necesitas más ayuda? Puedo explicarte cualquier concepto o generar más contenido educativo.*`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-foreground">Sinapsis AI</h2>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-b border-border/30">
        <p className="text-xs text-muted-foreground mb-2">Acciones rápidas</p>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                onClick={action.action}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm text-foreground"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4 text-primary" />
                {action.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              {message.role === 'ai' && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30">
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className="p-1 hover:bg-background rounded transition-colors"
                    title="Copiar"
                  >
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleQuickAction(message.content)}
                    className="p-1 hover:bg-background rounded transition-colors"
                    title="Regenerar"
                  >
                    <RefreshCw className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/30">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu pregunta..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
          <motion.button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-primary hover:bg-primary/80 disabled:opacity-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-4 h-4 text-foreground" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
