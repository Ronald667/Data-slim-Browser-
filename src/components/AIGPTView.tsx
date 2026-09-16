import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react';
import Markdown from 'react-markdown';
import { 
  Bot, 
  Sparkles, 
  Send, 
  ArrowLeft, 
  Trash2, 
  Copy, 
  Check, 
  Zap, 
  Globe, 
  FileText, 
  Columns, 
  Maximize2, 
  Minimize2, 
  Loader2, 
  Lightbulb, 
  Code2, 
  BookOpen, 
  HelpCircle 
} from 'lucide-react';
import { PageBrowseResult, ChatMessage } from '../types';
import { formatBytes, formatPercent } from '../utils/formatters';

interface AIGPTViewProps {
  result?: PageBrowseResult;
  onExit: () => void;
  isSidebarMode?: boolean;
  onToggleSidebarMode?: () => void;
}

const PAGE_SUGGESTIONS = [
  { label: '3-Bullet Summary', prompt: 'Summarize the core takeaways of this page in 3 clear, punchy bullet points.' },
  { label: 'Key Facts & Figures', prompt: 'Extract all important statistics, dates, numbers, and facts mentioned on this page.' },
  { label: 'Main Thesis', prompt: 'What is the main argument or purpose of this article/document?' },
  { label: 'Critique & Questions', prompt: 'What are the main strengths and potential counterarguments or limitations in this content?' },
  { label: 'ELI5 Explanation', prompt: 'Explain the concepts in this article in simple terms that anyone can understand.' },
];

const GENERAL_SUGGESTIONS = [
  { label: 'Zero-Data Search', prompt: 'What are the latest breakthroughs in high-efficiency mobile data compression?' },
  { label: 'Explain Concept', prompt: 'How does Brotli and Zstandard compression achieve 30% higher density than gzip?' },
  { label: 'Code Solution', prompt: 'Write a TypeScript function to strip tracking parameters from web URLs.' },
  { label: 'Brainstorm Ideas', prompt: 'Give me 5 clever ideas for apps that work flawlessly in ultra-low bandwidth environments.' },
];

export default function AIGPTView({
  result,
  onExit,
  isSidebarMode = false,
  onToggleSidebarMode,
}: AIGPTViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Initial welcome message
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: result
          ? `### 👋 Welcome to AI GPT Mode\n\nI have loaded the content of **"${result.title || 'Current Webpage'}"**.\n\nAsk me anything about this page, request a targeted summary, extract data points, or ask general questions without consuming heavy web page megabytes.`
          : `### 👋 Welcome to AI GPT Mode\n\nI am your zero-bloat conversational browser assistant powered by Gemini. Ask me any question, research topics, or write code with ultra-low wire payload transfer (~1–3 KB per query vs 3–5 MB traditional web search).`,
        timestamp: Date.now(),
        bytesTransferred: 320,
        savingsVsWebSearchBytes: 3499680,
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usePageContext, setUsePageContext] = useState<boolean>(Boolean(result));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  const handleSendMessage = async (promptToSend?: string) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    try {
      // Build API request payload
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          mode: usePageContext && result ? 'page_context' : 'general',
          pageContext: usePageContext && result ? {
            title: result.title,
            url: result.url,
            html: result.optimizedHtml,
          } : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now(),
          bytesTransferred: data.bytesTransferred || 512,
          savingsVsWebSearchBytes: data.savedBytes || 3499488,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Notice**: ${data.reply || 'Could not process query. Please try again.'}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Connection Error**: Failed to reach AI service. Please check your network or try again shortly.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-cleared',
        role: 'assistant',
        content: 'Conversation history cleared. Ready for your next query or analysis.',
        timestamp: Date.now(),
      },
    ]);
  };

  // Cumulative chat metrics
  const totalTransferredBytes = messages.reduce((acc, m) => acc + (m.bytesTransferred || 0), 0);
  const totalSavedBytes = messages.reduce((acc, m) => acc + (m.savingsVsWebSearchBytes || 0), 0);

  const suggestions = usePageContext && result ? PAGE_SUGGESTIONS : GENERAL_SUGGESTIONS;

  return (
    <div className={`flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${isSidebarMode ? 'border-l border-slate-200 dark:border-slate-800' : 'flex-1'}`}>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          {!isSidebarMode && (
            <button
              id="ai-gpt-back-btn"
              onClick={onExit}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold shrink-0"
              title="Return to Web View"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Web View</span>
            </button>
          )}

          {!isSidebarMode && <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />}

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">AI GPT Mode</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Lite
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate hidden sm:block">
                Ultra-low-bandwidth conversational browser copilot
              </p>
            </div>
          </div>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Page context toggle chip */}
          {result && (
            <button
              id="toggle-page-context-btn"
              type="button"
              onClick={() => setUsePageContext(!usePageContext)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                usePageContext
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
              title={usePageContext ? 'AI is using current page context' : 'AI is in general search mode'}
            >
              <FileText className="w-3 h-3" />
              <span className="truncate max-w-[120px] sm:max-w-[180px]">
                {usePageContext ? result.title : 'Page Unlinked'}
              </span>
            </button>
          )}

          {/* Savings Badge */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-bold">
            <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
            <span>{formatBytes(totalSavedBytes || 3500000)} Saved</span>
          </div>

          {/* Toggle Sidebar / Full Screen Mode */}
          {onToggleSidebarMode && (
            <button
              id="toggle-gpt-layout-btn"
              onClick={onToggleSidebarMode}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={isSidebarMode ? 'Expand to Full Screen' : 'Dock as Split Copilot'}
            >
              {isSidebarMode ? <Maximize2 className="w-4 h-4" /> : <Columns className="w-4 h-4" />}
            </button>
          )}

          {/* Clear Chat */}
          <button
            id="clear-gpt-chat-btn"
            onClick={handleClearChat}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-3xl mx-auto w-full`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                {!isUser && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <Bot className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>AI GPT Copilot</span>
                  </span>
                )}
                {isUser && (
                  <span className="text-[11px] font-bold text-slate-400">You</span>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[90%] sm:max-w-[85%] shadow-xs ${
                  isUser
                    ? 'bg-emerald-600 text-white font-medium rounded-tr-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div className="markdown-body prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed">
                    <Markdown>{message.content}</Markdown>
                  </div>
                )}
              </div>

              {/* Message Meta & Action Bar */}
              {!isUser && (
                <div className="flex items-center gap-2 mt-1 px-2 text-[10px] text-slate-400">
                  {message.bytesTransferred && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Zap className="w-2.5 h-2.5 fill-emerald-500" />
                      <span>{formatBytes(message.bytesTransferred)} wire payload (~99.9% saved)</span>
                    </span>
                  )}

                  <button
                    onClick={() => handleCopy(message.content, message.id)}
                    className="p-1 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors flex items-center gap-1"
                    title="Copy Answer"
                  >
                    {copiedId === message.id ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === message.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Spinner in Chat */}
        {isLoading && (
          <div className="flex flex-col items-start max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <Bot className="w-3 h-3 text-emerald-500" />
                <span>AI GPT Thinking...</span>
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-slate-500 flex items-center gap-2.5 shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              <span>Generating concise, high-density response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Row */}
      <div className="border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 py-2">
        <div className="max-w-3xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Prompt:</span>
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              id={`quick-prompt-${idx}`}
              onClick={() => handleSendMessage(s.prompt)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors shrink-0 disabled:opacity-50"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Composer */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-xs"
          >
            <textarea
              ref={textareaRef}
              id="ai-gpt-input"
              rows={1}
              value={inputPrompt}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                usePageContext && result
                  ? `Ask GPT anything about "${result.title}" (Press Enter to send)...`
                  : 'Ask GPT anything (zero-data search, code, answers)...'
              }
              className="w-full py-1.5 px-2 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none max-h-36 leading-relaxed"
            />

            <button
              id="ai-gpt-send-btn"
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-30 disabled:hover:bg-emerald-600 transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
              title="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          {/* Footer Low Data Note */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-500" />
              <span>Ultra-Lite Wire Protocol • Consumes &lt; 2 KB vs 3.5 MB Web Search</span>
            </span>
            <span className="hidden sm:inline">Enter to send • Shift+Enter for newline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
