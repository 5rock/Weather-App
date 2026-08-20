import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Loader2, User } from 'lucide-react';
import useWeather from '../hooks/useWeather';
import { askWeatherAssistant } from '../services/aiApi';

const WeatherAssistant = () => {
  const { currentWeather } = useWeather();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! I am your AI Weather Assistant. Ask me what to wear, if you need an umbrella, or if it is a good day for outdoor activities!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await askWeatherAssistant(userMsg, currentWeather);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', content: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] glass-panel rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/20 dark:border-white/5 bg-sky-500/10 dark:bg-sky-500/5">
        <div className="p-2 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white">AI Weather Assistant</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-slate-800 text-sky-500 shadow-sm'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 text-sky-500 shadow-sm">
              <Bot size={16} />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700">
              <Loader2 size={16} className="animate-spin text-sky-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the weather..."
            className="w-full pl-4 pr-12 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50 disabled:hover:bg-sky-500 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default WeatherAssistant;
