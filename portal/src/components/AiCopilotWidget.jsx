import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export default function AiCopilotWidget({ user, policies = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${user.name}! I am your XortLogix HR Assistant. I can assist you with your live leave balances, company policies, approval routes, and HR procedures. How can I help you today?`
    }
  ]);
  const chatBottomRef = useRef(null);

  const quickPrompts = [
    'How many annual leaves do I have?',
    'What is our medical leave policy?',
    'Who is my reporting manager?',
    'Can I apply for emergency leave?'
  ];

  useEffect(() => {
    if (isOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const generateAssistantResponse = (query) => {
    const q = (query || '').trim().toLowerCase();
    const cleanQ = q.replace(/[?!.,;:'"()]/g, ' ').replace(/\s+/g, ' ').trim();
    const words = cleanQ.split(' ').filter(Boolean);

    // 1. Greetings & Salutations (e.g. "hello", "hi", "hey", "salam", "good morning")
    const greetingWords = ['hello', 'hi', 'hey', 'hiya', 'salam', 'assalam', 'aoa', 'halo', 'hola'];
    const hasGreetingWord = words.some(w => greetingWords.includes(w));
    const isShortGreeting = words.length <= 4 && hasGreetingWord;
    const isTimeGreeting = q.includes('good morning') || q.includes('good afternoon') || q.includes('good evening') || q.includes('good day');

    if (isShortGreeting || isTimeGreeting) {
      return `Hello ${user.name}! How can I assist you today? You can ask me about your live leave balances, how to apply for leave, company policies, or your reporting lead.`;
    }

    // 2. Well-being & Casual Check-in (e.g. "how are you", "how are you doing")
    if (q.includes('how are you') || q.includes('how r u') || q.includes('how do you do') || q.includes('how is it going') || q.includes("how's it going") || q.includes('what are you doing') || q.includes("whats up") || q.includes("what's up")) {
      return `I am doing great, thank you for asking! I am ready to help you with your XortLogix portal questions, leave balances, or company policies. What can I do for you?`;
    }

    // 3. Gratitude & Politeness (e.g. "thank you", "thanks")
    if (q.includes('thank') || q.includes('thx') || q.includes('appreciate') || q.includes('shukriya') || q.includes('jazakallah')) {
      return `You're very welcome, ${user.name}! Feel free to ask if there is anything else you need.`;
    }

    // 4. Affirmation / Short Acknowledgement (e.g. "ok", "okay", "sure", "got it")
    if (['ok', 'okay', 'alright', 'got it', 'sure', 'cool', 'great', 'perfect', 'fine', 'noted'].includes(cleanQ)) {
      return `Great! Let me know if you have any other questions about your leave balances, policies, or portal features.`;
    }

    // 5. Farewell / Sign-off (e.g. "bye", "goodbye")
    if (q.includes('bye') || q.includes('goodbye') || q.includes('see you') || q.includes('take care')) {
      return `Goodbye ${user.name}! Have a productive day ahead. Reach out anytime you need HR support.`;
    }

    // 6. Bot Identity / Capabilities / Help (e.g. "who are you", "what can you do", "help")
    if (q.includes('who are you') || q.includes('what can you do') || q.includes('what do you do') || cleanQ === 'help' || q.includes('what is this') || q.includes('commands')) {
      return `I am your XortLogix HR Assistant. Here is what I can help you with:
1. Check your live leave balances (Annual, Medical, Casual, Emergency)
2. Guide you on applying for leave and approval workflows
3. Provide details on company policies and office rules
4. Check your reporting manager and department contacts
5. Help you update your profile photo, username, or password
6. Direct you to HR Helpdesk or latest company announcements`;
    }

    // Live leave balances extraction
    const annual = user.leaveBalances?.annual || { remaining: 20, total: 20, used: 0 };
    const medical = user.leaveBalances?.medical || { remaining: 10, total: 10, used: 0 };
    const casual = user.leaveBalances?.casual || { remaining: 5, total: 5, used: 0 };

    // 7. How to Apply for Leave / Application Process
    if (q.includes('how to apply') || q.includes('apply for leave') || q.includes('apply leave') || q.includes('take leave') || q.includes('request leave') || q.includes('submit leave') || (q.includes('apply') && q.includes('leave'))) {
      return `To apply for a leave:
1. Click the "Apply for Leave" button in the top navigation bar (or press Ctrl/Cmd + K).
2. Choose your leave category (Annual, Medical, Casual, or Emergency).
3. Select your start date and end date, and type a brief explanation.
4. Click Submit. Your request will be routed to your Lead (${user.reportingLead || 'Team Lead'}) and HR for approval.`;
    }

    // 8. Specific Leave Queries
    // 8a. Annual / Vacation leave
    if (q.includes('annual') || q.includes('vacation')) {
      return `According to your active records, you have ${annual.remaining} remaining Annual Vacation days out of ${annual.total} total days (${annual.used} days used so far). Annual leaves require at least 3 days advance notice.`;
    }

    // 8b. Medical / Sick leave
    if (q.includes('medical') || q.includes('sick') || q.includes('doctor') || q.includes('illness') || q.includes('hospital')) {
      return `You have ${medical.remaining} Medical & Sick days remaining out of ${medical.total} total days (${medical.used} days used). Absences exceeding 2 consecutive days require an official medical certificate upon return.`;
    }

    // 8c. Casual / Personal leave
    if (q.includes('casual') || q.includes('personal leave') || q.includes('personal day')) {
      return `You have ${casual.remaining} Casual Leave days remaining out of ${casual.total} total days (${casual.used} used) for personal errands or short urgent matters.`;
    }

    // 8d. Emergency leave
    if (q.includes('emergency')) {
      return `Yes, all employees are entitled to Emergency Leave for sudden unforeseen situations. Emergency requests are prioritized and routed directly to ${user.reportingLead || 'your Lead'} and HR Operations.`;
    }

    // 8e. Maternity / Paternity / Parental leave
    if (q.includes('maternity') || q.includes('paternity') || q.includes('parental') || q.includes('pregnant') || q.includes('pregnancy')) {
      const maternityPol = policies.find(p => p.name?.toLowerCase().includes('maternity'));
      if (maternityPol) {
        return `The Maternity Leave policy is currently active (${maternityPol.days || 84} calendar days). Eligible staff can apply through the portal with notification to HR Operations.`;
      } else {
        return `There is currently no active Maternity Leave policy configured in the system. HR administrators can configure and activate it directly from the Leave Policy tab when required.`;
      }
    }

    // 8f. General Balance query (e.g. "how many leaves", "my leaves", "leave balance", "remaining balance")
    if (q.includes('balance') || q.includes('how many leave') || q.includes('how many leaves') || q.includes('remaining leave') || q.includes('my leave') || q.includes('total leave') || q.includes('check leave') || q.includes('leave quota')) {
      const totalRemaining = annual.remaining + medical.remaining + casual.remaining;
      return `Here is your current live leave breakdown:
- Annual Vacation: ${annual.remaining} days remaining (of ${annual.total})
- Medical & Sick: ${medical.remaining} days remaining (of ${medical.total})
- Casual Leave: ${casual.remaining} days remaining (of ${casual.total})
Total available leaves: ${totalRemaining} days.`;
    }

    // 9. Reporting Hierarchy / Manager / Leads
    if (q.includes('lead') || q.includes('manager') || q.includes('boss') || q.includes('supervisor') || q.includes('report to') || q.includes('reporting') || q.includes('head')) {
      return `Here is your assigned reporting hierarchy:
- Direct Lead: ${user.reportingLead || 'Assigned Lead'} (${user.team || user.department})
- Department Head: ${user.departmentHead || 'Elena Rostova'}
- HR Operations: ${user.hrContact || 'David Miller'}
- Your Department: ${user.department || 'General'}`;
    }

    // 10. Profile Settings / Password / Picture / Avatar
    if (q.includes('password') || q.includes('profile') || q.includes('photo') || q.includes('picture') || q.includes('avatar') || q.includes('change name') || q.includes('update account') || q.includes('settings')) {
      return `To manage your profile, photo, or password:
1. Click on your user badge at the bottom of the left sidebar, or click the settings cog in the top header.
2. In the Profile Settings page, click "Choose New Photo" to upload an image locally from your device.
3. You can also update your display name and change your login password securely.`;
    }

    // 11. Company Policies in General / Policy Rules
    if (q.includes('policy') || q.includes('policies') || q.includes('rule') || q.includes('rules') || q.includes('handbook') || q.includes('guidelines')) {
      const activeCount = policies.filter(p => p.status === 'Active' || p.is_active !== false).length;
      return `There are currently ${activeCount} active leave policies in XortLogix Portal:
- Annual Vacation: 20 days per year (at least 3 days advance notice)
- Medical & Sick: 10 days per year (medical slip needed for 2+ consecutive days)
- Casual Leave: 5 days per year (for quick personal errands)
- Carry Forward: Up to 5 unused annual days can roll into next calendar year
You can view full details under the Leave Policy section.`;
    }

    // 12. Office Timings / Working Hours / Days
    if (q.includes('timing') || q.includes('working hour') || q.includes('work hour') || q.includes('office timing') || q.includes('shift') || q.includes('hours') || q.includes('schedule') || q.includes('holiday')) {
      return `Standard XortLogix office hours are Monday to Friday, 9:00 AM to 6:00 PM with a 1-hour lunch break. Saturdays and Sundays are official off days. Company observed holidays are posted in the Announcements section.`;
    }

    // 13. Payroll / Salary / Payslip
    if (q.includes('salary') || q.includes('payroll') || q.includes('payslip') || q.includes('pay slip') || q.includes('compensation') || q.includes('bank')) {
      return `Monthly payroll is processed on the 28th of every month. For payslip copies, tax deduction statements, or banking updates, please submit an inquiry under HR Helpdesk or contact Finance Operations.`;
    }

    // 14. HR Specialist & Who is the HR
    if (q.includes('who is the hr') || q.includes('who is hr') || q.includes('who is my hr') || q.includes('hr specialist') || q.includes('hr contact') || q.includes('contact hr') || q.includes('hr manager') || (q.includes('who') && q.includes('hr')) || cleanQ === 'hr') {
      return `Our HR Operations Specialist is David Miller (email: david.hr@xortlogix.com). You can reach out directly via email or submit an inquiry ticket in the HR Helpdesk.`;
    }

    // 15. HR Helpdesk / Ticket / Support
    if (q.includes('ticket') || q.includes('helpdesk') || q.includes('support') || q.includes('complaint')) {
      return `For official HR requests, disputes, or verification letters, you can raise an inquiry ticket in the HR Helpdesk section, or contact People Operations (${user.hrContact || 'David Miller'}) directly at hr@xortlogix.com.`;
    }

    // 16. Announcements / Company News
    if (q.includes('announcement') || q.includes('news') || q.includes('notice') || q.includes('broadcast')) {
      return `Important company news and executive broadcasts appear on your Dashboard banner and under the Announcements tab. HR administrators can post new company-wide announcements at any time.`;
    }

    // 17. Contextual, Helpful Fallback (Zero asterisks or bullet stars)
    return `I want to make sure I give you the exact information you need. Could you please specify your question?

You can ask me about:
1. "How many leaves do I have?" (check your live balances)
2. "What is the medical leave policy?" (policy rules)
3. "Who is my reporting manager?" (reporting hierarchy)
4. "How do I apply for leave?" (application steps)
5. "How do I change my password or profile photo?" (account settings)`;
  };

  const handleSend = (userQuery) => {
    const q = (userQuery || input).trim();
    if (!q) return;

    const newMessages = [...messages, { sender: 'user', text: q }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = generateAssistantResponse(q);
      aiResponse = (aiResponse || '').replace(/[\*•]/g, '').trim();
      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 300);
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: `Chat refreshed! How can I assist you with your leave balances or HR policies, ${user.name}?`
      }
    ]);
  };

  return (
    <>
      {/* 1. Floating Launch Pill / Widget Button (Always visible on bottom right) */}
      <div style={{
        position: 'fixed',
        bottom: '22px',
        right: '24px',
        zIndex: 90
      }}>
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="ai-copilot-launcher"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '10px 18px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
              color: '#ffffff',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.35), 0 2px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              fontWeight: 600,
              fontSize: '0.86rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(99, 102, 241, 0.4)';
              e.currentTarget.style.borderColor = '#818cf8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.35)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Sparkles size={16} color="#818cf8" />
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-4px',
                width: '7px',
                height: '7px',
                background: '#4ade80',
                borderRadius: '50%',
                boxShadow: '0 0 6px #4ade80'
              }} />
            </div>
            <span>XortLogix HR</span>
          </button>
        ) : (
          /* 2. Expanded Floating Chat Box on Bottom Right */
          <div style={{
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '520px',
            maxHeight: 'calc(100vh - 44px)',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'modalIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Widget Top Bar */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
              padding: '14px 18px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '15px'
                }}>
                  X
                </div>
                <div>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                    XortLogix HR
                  </h3>
                  <p style={{ fontSize: '0.68rem', color: '#a5b4fc' }}>
                    Employee & Policy Assistant
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={handleClearChat}
                  title="Clear conversation"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#c7d2fe',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <RefreshCw size={13} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimize widget"
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: '#f8fafc'
            }}>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '88%'
                  }}
                >
                  {m.sender === 'ai' && (
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#e0e7ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4f46e5',
                      flexShrink: 0,
                      marginTop: '2px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      HR
                    </div>
                  )}

                  <div style={{
                    background: m.sender === 'user' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : '#ffffff',
                    color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                    padding: '9px 13px',
                    borderRadius: '12px',
                    borderTopLeftRadius: m.sender === 'ai' ? '3px' : '12px',
                    borderTopRightRadius: m.sender === 'user' ? '3px' : '12px',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    border: m.sender === 'ai' ? '1px solid #e2e8f0' : 'none',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                    whiteSpace: 'pre-line'
                  }}>
                    {typeof m.text === 'string' ? m.text.replace(/[\*•]/g, '') : m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontSize: '11px', fontWeight: 700 }}>
                    HR
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 14px', fontSize: '0.78rem', color: '#64748b' }}>
                    Consulting records...
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div style={{
              padding: '6px 12px',
              background: '#ffffff',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none'
            }}>
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  style={{
                    fontSize: '0.72rem',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#eef2ff';
                    e.currentTarget.style.borderColor = '#c7d2fe';
                    e.currentTarget.style.color = '#4338ca';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#475569';
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div style={{
              padding: '10px 12px',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <input
                type="text"
                placeholder="Ask XortLogix HR a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                style={{
                  flex: 1,
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  outline: 'none',
                  background: '#f8fafc',
                  color: '#0f172a'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.background = '#f8fafc';
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: input.trim() ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : '#e2e8f0',
                  color: input.trim() ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: input.trim() ? 'pointer' : 'default',
                  transition: 'all 0.15s ease'
                }}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
