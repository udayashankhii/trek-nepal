// src/AI chatbot/EverTrek.Chatbot.jsx
// Professional Chatbot Component - No interference with other components

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  X,
  Minimize2,
  MapPin,
  History,
  Trash2,
  Plus,
  MessageSquare
} from "lucide-react";
import { createPortal } from "react-dom";
import { marked } from "marked";
import { chatStorage } from "../api/service/chatStorage.js";

const API_URL = import.meta.env.VITE_CHATBOT_URL || "http://localhost:5000";

marked.setOptions({
  breaks: true,
  gfm: true
});

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Namaste! I'm your AI Trek Planning Assistant by EverTrek Nepal guides.\n\nHow can I help you today?",
  quickButtons: [
    { text: "Choose a trek", action: "trek-recommend" },
    { text: "Costs & permits", action: "cost-breakdown" },
    { text: "Packing list", action: "packing-list" },
    { text: "Best season", action: "season-guide" }
  ]
};

const EverTrekChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      try {
        await chatStorage.init();
        setIsInitialized(true);
        
        const allSessions = await chatStorage.getAllSessions();
        setSessions(allSessions);
        
        if (allSessions.length > 0) {
          await loadSession(allSessions[0].id);
        } else {
          await createNewSession();
        }
      } catch (error) {
        console.error('Failed to initialize chat storage:', error);
        setIsInitialized(true);
      }
    };

    initDB();
  }, []);

  // Auto-save messages
  useEffect(() => {
    if (isInitialized && currentSessionId && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && !lastMessage._loaded) {
        chatStorage.saveMessage(currentSessionId, lastMessage).catch(console.error);
      }
    }
  }, [messages, currentSessionId, isInitialized]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized && !showHistory) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, showHistory, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && !showHistory && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized, showHistory]);

  // Create new session
  const createNewSession = async () => {
    try {
      const session = await chatStorage.createSession();
      setCurrentSessionId(session.id);
      setMessages([INITIAL_MESSAGE]);
      
      const allSessions = await chatStorage.getAllSessions();
      setSessions(allSessions);
      
      setShowHistory(false);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  // Load session
  const loadSession = async (sessionId) => {
    try {
      const sessionMessages = await chatStorage.getSessionMessages(sessionId);
      
      if (sessionMessages.length === 0) {
        setMessages([INITIAL_MESSAGE]);
      } else {
        const loadedMessages = sessionMessages.map(msg => ({ ...msg, _loaded: true }));
        setMessages(loadedMessages);
      }
      
      setCurrentSessionId(sessionId);
      setShowHistory(false);
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  // Delete session
  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    
    if (!confirm('Delete this conversation?')) return;
    
    try {
      await chatStorage.deleteSession(sessionId);
      
      const allSessions = await chatStorage.getAllSessions();
      setSessions(allSessions);
      
      if (sessionId === currentSessionId) {
        if (allSessions.length > 0) {
          await loadSession(allSessions[0].id);
        } else {
          await createNewSession();
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  // Export chat history
  const exportHistory = async () => {
    try {
      const data = await chatStorage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evertrek-chat-history-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export history:', error);
    }
  };

  // Clear all history
  const clearAllHistory = async () => {
    if (!confirm('Delete all conversations? This cannot be undone.')) return;
    
    try {
      await chatStorage.clearAllData();
      await createNewSession();
      setSessions([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
      setShowHistory(false);
    } else {
      setIsOpen(true);
    }
  };

  const sendQuickAction = (action) => {
    const presets = {
      "trek-recommend": "Recommend a trek for me.",
      "cost-breakdown": "Explain trek costs and permits.",
      "packing-list": "Create a trekking packing list.",
      "season-guide": "What is the best trekking season in Nepal?"
    };
    const text = presets[action];
    if (!text) return;
    handleSend(text);
  };

  const handleSend = async (presetInput) => {
    const text = presetInput ?? input;
    if (!text?.trim() || isLoading) return;

    const userMessage = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,
          sessionId: currentSessionId
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const htmlContent = marked(data.reply || "");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || data.message || data.answer,
          htmlContent: htmlContent
        }
      ]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again or contact a human trek advisor."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setShowHistory(false);
  };

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
    setShowHistory(false);
  };

  // ✅ FIX 1: Better Escape key handling with capture phase
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        if (showHistory) {
          setShowHistory(false);
        } else {
          closeChat();
        }
      }
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape, true);
      return () => document.removeEventListener("keydown", handleEscape, true);
    }
  }, [isOpen, showHistory]);

  // ✅ FIX 2: Only block body scroll on mobile, properly restore scroll position
  useEffect(() => {
    if (isOpen && !isMinimized && window.innerWidth < 640) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, isMinimized]);

  // ✅ FIX 3: Improved click-outside detection with portal checking
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    const handleClickOutside = (event) => {
      const target = event.target;
      
      // Don't close if clicking inside chat window or toggle button
      if (chatWindowRef.current?.contains(target)) return;
      if (toggleButtonRef.current?.contains(target)) return;
      
      // Don't close if clicking on other portals/modals
      if (target.closest('[role="dialog"]')) return;
      if (target.closest('.chatbot-portal')) return;
      
      closeChat();
    };

    // Use capture phase to catch events before they bubble
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isOpen, isMinimized]);

  const root = document.getElementById("chatbot-root");
  if (!root) {
    console.error('❌ chatbot-root element not found. Add <div id="chatbot-root"></div> to your index.html');
    return null;
  }

  return createPortal(
    // ✅ FIX 4: Wrapper with pointer-events: none for complete isolation
    <div className="chatbot-portal" style={{ pointerEvents: 'none' }}>
      {/* Floating Toggle Button */}
      <button
        ref={toggleButtonRef}
        onClick={toggleChat}
        style={{ pointerEvents: 'auto' }}
        className={`
          fixed bottom-4 right-4 sm:bottom-6 sm:right-6 
          z-[9998] 
          w-14 h-14 sm:w-16 sm:h-16 
          rounded-full 
          shadow-2xl 
          flex items-center justify-center 
          transition-all duration-300 ease-out 
          group 
          hover:shadow-emerald-500/25 
          focus:outline-none 
          focus-visible:ring-4 
          focus-visible:ring-emerald-500/50
          ${isOpen
            ? "bg-emerald-600 hover:bg-emerald-700 scale-105 ring-4 ring-emerald-400/50"
            : "bg-[#0F2A44] hover:bg-[#14385C]"
          }
        `}
        aria-label={isOpen ? "Close EverTrek Chatbot" : "Open EverTrek Chatbot"}
        aria-expanded={isOpen}
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center p-1 overflow-hidden shadow-lg">
          <img
            src="/logo7.webp"
            alt="EverTrek Nepal"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain group-hover:scale-110 transition-transform duration-200"
            loading="lazy"
          />
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <>
          {/* ✅ FIX 5: Mobile backdrop only, with proper pointer events */}
          {!isMinimized && (
            <div 
              style={{ pointerEvents: 'auto' }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9997] sm:hidden transition-opacity"
              onClick={closeChat}
              aria-hidden="true"
            />
          )}

          <div
            ref={chatWindowRef}
            style={{ pointerEvents: 'auto' }}
            className={`
              fixed 
              z-[9999]
              flex flex-col
              shadow-2xl 
              border 
              backdrop-blur-xl 
              transition-all 
              duration-300 
              ease-out 
              rounded-3xl 
              overflow-hidden
              ${isMinimized
                ? "bottom-20 right-4 sm:bottom-28 sm:right-6 h-20 w-80 bg-emerald-600 shadow-emerald-500/25"
                : "bottom-4 right-4 sm:bottom-28 sm:right-6 w-[calc(100vw-2rem)] sm:w-full sm:max-w-md h-[calc(100vh-2rem)] sm:h-[600px] bg-[#F7F9FB] border-[#E5E9EF]"
              }
            `}
            role="dialog"
            aria-label="EverTrek Chatbot"
            aria-modal="true"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 flex justify-between items-center border-b bg-white/95 backdrop-blur-sm rounded-t-3xl shadow-sm border-[#E5E9EF] flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0F2A44] flex items-center justify-center p-1 shadow-lg flex-shrink-0">
                  <img
                    src="/logo7.webp"
                    alt="EverTrek Nepal"
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-[#0F2A44] truncate">
                    EverTrek Chatbot
                  </h3>
                  <p className="text-xs text-[#1F7A63] flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    Trek Planning Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  aria-label="Chat history"
                  title="Chat History"
                >
                  <History className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
                <button
                  onClick={toggleMinimize}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  <Minimize2
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transition-transform ${
                      isMinimized ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={closeChat}
                  className="p-2 hover:bg-red-50 rounded-xl text-red-500 hover:bg-red-100 hover:scale-105 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* History Sidebar */}
            {!isMinimized && showHistory && (
              <div className="absolute top-[73px] sm:top-[85px] left-0 right-0 bottom-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col">
                <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                  <h4 className="font-semibold text-sm sm:text-base text-[#0F2A44]">Chat History</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={clearAllHistory}
                      className="p-2 hover:bg-red-50 rounded-lg transition-all"
                      title="Clear All"
                      aria-label="Clear all history"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <button
                      onClick={createNewSession}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all"
                      title="New Chat"
                      aria-label="Start new chat"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => loadSession(session.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all hover:shadow-md group ${
                        session.id === currentSessionId
                          ? 'bg-emerald-50 border-2 border-emerald-200'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {session.title || 'New Trek Conversation'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{new Date(session.lastActivity).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => deleteSession(session.id, e)}
                          className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition-all flex-shrink-0"
                          aria-label="Delete conversation"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {sessions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No chat history yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Messages Area */}
            {!isMinimized && !showHistory && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 scrollbar-thin scrollbar-thumb-gray-300/50 scrollbar-track-transparent">
                {messages.map((msg, i) => (
                  <div key={i} className="space-y-2 sm:space-y-3 animate-fadeIn">
                    <div
                      className={`max-w-[85%] p-3 sm:p-4 rounded-2xl shadow-sm text-sm leading-relaxed transition-all duration-200 hover:shadow-md ${
                        msg.role === "user"
                          ? "ml-auto bg-gradient-to-r from-[#1F7A63] to-emerald-600 text-white shadow-emerald-500/25"
                          : "bg-white/80 backdrop-blur-sm border border-gray-100/50 shadow-lg markdown-content"
                      }`}
                    >
                      {msg.role === "assistant" && msg.htmlContent ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: msg.htmlContent }}
                          className="prose prose-sm max-w-none"
                        />
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>

                    {msg.quickButtons && (
                      <div className="flex flex-wrap gap-2 pl-1">
                        {msg.quickButtons.map((btn, j) => (
                          <button
                            key={j}
                            onClick={() => sendQuickAction(btn.action)}
                            className="px-3 sm:px-4 py-2 text-xs bg-white/90 hover:bg-white border border-emerald-200 hover:border-emerald-300 text-emerald-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium backdrop-blur-sm"
                          >
                            {btn.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm animate-fadeIn">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">
                      Consulting trekking experts…
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Minimized State */}
            {isMinimized && (
              <div className="p-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <img
                      src="/logo7.webp"
                      alt="Logo"
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">EverTrek Chatbot</p>
                    <p className="text-xs opacity-90">{messages.length} messages</p>
                  </div>
                </div>
              </div>
            )}

            {/* Input Area */}
            {!isMinimized && !showHistory && (
              <div className="p-3 sm:p-5 sm:pt-0 border-t border-gray-100/50 bg-gradient-to-t from-white/70 backdrop-blur-sm flex-shrink-0">
                <div className="flex items-end gap-2 sm:gap-3 p-1 rounded-2xl bg-white/50 border border-emerald-100/50">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask about treks, costs, permits..."
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-none outline-none text-sm resize-none placeholder-gray-500 focus:placeholder-transparent"
                    disabled={isLoading}
                    maxLength={500}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input?.trim() || isLoading}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#0F2A44] to-[#14385C] hover:from-[#14385C] hover:to-[#1A456F] shadow-lg hover:shadow-xl text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"
                    aria-label="Send message"
                  >
                    <Send
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                        isLoading ? "animate-pulse" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>,
    root
  );
};

export default EverTrekChatbot;