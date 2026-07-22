import React, { useState } from 'react';
import { WhatsAppMessage } from '../types';
import { Send, Phone, Video, MoreVertical, CheckCheck, Smartphone, Sparkles, MessageSquare } from 'lucide-react';

interface WhatsAppBotSimulatorProps {
  onSendMessage: (text: string) => Promise<any>;
}

export const WhatsAppBotSimulator: React.FC<WhatsAppBotSimulatorProps> = ({ onSendMessage }) => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: '👋 *Welcome to AirIQ Citizen Air Alert Service!*\n\nType any 6-digit Indian pincode (e.g., *110001* for Delhi or *400001* for Mumbai) to receive instant live AQI + health advisory in your language.',
      timestamp: '10:42 AM',
      buttons: ['Try 110001', 'Try 400001', 'School Closure Info'],
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSend = async (textToSend?: string) => {
    const msgText = (textToSend || input).trim();
    if (!msgText) return;

    const userMsg: WhatsAppMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: msgText,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await onSendMessage(msgText);
      if (res && res.response) {
        setTimeout(() => {
          const botMsg: WhatsAppMessage = {
            id: `b-${Date.now()}`,
            sender: 'bot',
            text: res.response.text,
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            buttons: res.response.buttons,
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsTyping(false);
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  return (
    <div className="glass-surface rounded-2xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">WhatsApp Citizen Bot Simulator</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 inline" />
              <span>Simulator / Demo Mode</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test pincode lookups (e.g. 110001, 400001) in real-time. Responds in &lt;1.2s with local language health guidance.
          </p>
        </div>

        {/* Quick Test Chips */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Quick Pincodes:</span>
          <button
            onClick={() => handleSend('110001')}
            className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold hover:bg-slate-700"
          >
            110001 (Delhi)
          </button>
          <button
            onClick={() => handleSend('400001')}
            className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-400 font-mono font-bold hover:bg-slate-700"
          >
            400001 (Mumbai)
          </button>
          <button
            onClick={() => handleSend('School')}
            className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-amber-400 font-bold hover:bg-slate-700"
          >
            School Alert
          </button>
        </div>
      </div>

      {/* Smartphone Frame Mockup */}
      <div className="max-w-md mx-auto bg-slate-950 rounded-3xl border-4 border-slate-700 overflow-hidden shadow-2xl flex flex-col h-[520px]">
        
        {/* WhatsApp App Header Bar */}
        <div className="bg-emerald-800 px-4 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-emerald-900 border border-emerald-400 flex items-center justify-center font-bold text-xs text-emerald-200">
              IQ
            </div>
            <div>
              <p className="font-bold text-xs leading-tight">AirIQ Citizen Service</p>
              <p className="text-[10px] text-emerald-200 opacity-90">Official CPCB Verified Bot • Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-emerald-100">
            <Phone className="w-4 h-4 cursor-pointer" />
            <Video className="w-4 h-4 cursor-pointer" />
            <MoreVertical className="w-4 h-4 cursor-pointer" />
          </div>
        </div>

        {/* Message Thread Box */}
        <div className="flex-1 bg-[radial-gradient(#022c22_1px,transparent_1px)] [background-size:12px_12px] p-4 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                  m.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {/* Quick Action Buttons inside message */}
                {m.buttons && m.buttons.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                    {m.buttons.map((b, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(b.replace('Try ', ''))}
                        className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold text-[10px] hover:bg-emerald-900 transition-colors"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-1 flex items-center justify-end space-x-1 text-[9px] text-slate-400">
                  <span>{m.timestamp}</span>
                  {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-cyan-300 inline" />}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-400 text-xs w-28">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}
        </div>

        {/* Message Input Bar */}
        <div className="bg-slate-900 p-2.5 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type pincode (e.g. 110001)..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
