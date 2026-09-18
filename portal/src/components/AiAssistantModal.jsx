import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, User } from 'lucide-react';

export default function AiAssistantModal({ isOpen, onClose, user, policies }) {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${user.name}! I am your WorkSphere HR Copilot. I can assist you with your personal leave balances, policy entitlements, approval routes, and reporting lines. How can I help you today?`
    }
  ]);

  const quickPrompts = [
    'How many annual leaves do I have?',
    'What is our medical leave policy?',
    'Who is my Team Lead?',
    'Can I submit an emergency request?',
    'What is the approval workflow for maternity leave?'
  ];

  const handleSend = (userQuery) => {
    const q = (userQuery || input).trim();
    if (!q) return;

    const newMessages = [...messages, { sender: 'user', text: q }];
    setMessages(newMessages);
    setInput('');

    setTimeout(() => {
      let aiResponse = "Checking company policies and verified records...";
      const lower = q.toLowerCase();

      if (lower.includes('annual leave') || lower.includes('balance') || lower.includes('how many')) {
        aiResponse = `According to your active record, you have **${user.leaveBalances.annual.remaining} remaining Annual Vacation days** out of your ${user.leaveBalances.annual.total} total days entitlement (${user.leaveBalances.annual.used} used so far this calendar cycle).`;
      } else if (lower.includes('medical leave')) {
        aiResponse = `Our Medical Leave Policy grants **10 days per annum** effective immediately on joining. You currently have **${user.leaveBalances.medical.remaining} days remaining** (${user.leaveBalances.medical.used} used). Leaves exceeding 2 consecutive days require a medical practitioner's note.`;
      } else if (lower.includes('team lead') || lower.includes('lead') || lower.includes('manager')) {
        aiResponse = `Your direct reporting Team Lead is **${user.reportingLead}** in the ${user.team} (${user.department} Department). Your Department Head is **${user.departmentHead}**.`;
      } else if (lower.includes('emergency')) {
        aiResponse = `Yes. All employees (including probationary staff and interns) can submit an **Emergency Leave Request**. These requests are prioritized and routed directly to your Team Lead (${user.reportingLead}) and HR for immediate review.`;
      } else if (lower.includes('maternity')) {
        aiResponse = `The **Maternity Leave Policy** provides **90 days entitlement** to Full-Time female employees after 6 months of active service. The approval chain is: **Team Lead → Department Head → HR Operations**.`;
      } else {
        aiResponse = `Based on records for **${user.name}** in the **${user.department} Department**, you can manage this from your self-service dashboard or consult your HR Business Partner, **${user.hrContact}**.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 300);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '520px', height: '580px', display: 'flex', flexDirection: 'column' }}>
        {/* Header - Clean Monochrome Header */}
        <div className="modal-header" style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111827'
            }}>
              <Sparkles size={15} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827' }}>WorkSphere HR Copilot</h3>
              <p style={{ fontSize: '0.72rem', color: '#6b7280' }}>Verified company data & policy assistant</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={18} />
          </button>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              style={{
                display: 'flex',
                gap: '8px',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {m.sender === 'ai' && (
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#f3f4f6', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', flexShrink: 0 }}>
                  <Bot size={14} />
                </div>
              )}
              <div style={{
                background: m.sender === 'user' ? '#111827' : '#f9fafb',
                color: m.sender === 'user' ? '#ffffff' : '#111827',
                border: m.sender === 'user' ? 'none' : '1px solid #e5e7eb',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                lineHeight: 1.45
              }}>
                <div dangerouslySetInnerHTML={{ 
                  __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                }} />
              </div>
              {m.sender === 'user' && (
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                  <User size={13} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Suggestions */}
        <div style={{ padding: '6px 14px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {quickPrompts.slice(0, 3).map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              style={{
                background: '#ffffff',
                border: '1px solid #d1d5db',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                color: '#374151',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '10px 14px', background: '#ffffff', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, fontSize: '0.8rem' }}
            placeholder="Ask about policies, balances, contacts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className="btn-primary-saas" 
            onClick={() => handleSend()}
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            <Send size={13} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
