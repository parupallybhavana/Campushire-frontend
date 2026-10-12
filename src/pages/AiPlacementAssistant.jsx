import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { Sparkles, Send, User, Bot, BookOpen, Code2, FileText, ArrowRight } from 'lucide-react';

function AiPlacementAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your CampusHire AI Placement Assistant. Ask me anything about placement preparation plans, DSA topics, resume improvements, or company selection processes!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/ai/chat', { prompt: userMsg });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'I am here to guide your placement preparation! For DSA, focus on Arrays, Strings, and Trees. For HR rounds, structure your answers using the STAR method.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "How should I prepare for a Java Developer placement drive?",
    "Give me tips to improve my resume for ATS screening.",
    "What HR questions are asked at top IT companies?",
    "Generate a 7-day study plan for DSA and Coding."
  ];

  return (
    <AppLayout>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.75rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles style={{ color: '#8B5CF6' }} /> AI Placement Assistant
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Instant AI guidance for placement preparation, DSA roadmap, and resume optimization.</p>
      </div>

      <div className="card" style={{ height: '620px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {/* Chat Messages Container */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#FAFAFD' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              {m.sender === 'bot' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={20} />
                </div>
              )}

              <div style={{
                padding: '14px 18px',
                borderRadius: '16px',
                backgroundColor: m.sender === 'user' ? '#4F46E5' : '#FFFFFF',
                color: m.sender === 'user' ? '#FFFFFF' : '#1E293B',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                fontSize: '0.925rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-line'
              }}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} />
              </div>
              <div style={{ padding: '12px 18px', borderRadius: '16px', background: '#FFFFFF', color: '#64748B', fontSize: '0.9rem' }}>
                AI Assistant is formulating response...
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div style={{ padding: '10px 20px', background: '#FFFFFF', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              className="btn btn-secondary btn-sm"
              onClick={() => { setInput(qp); }}
              style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', borderRadius: '16px' }}
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} style={{ padding: '16px 20px', background: '#FFFFFF', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Ask AI about placement preparation..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </AppLayout>
  );
}

export default AiPlacementAssistant;
