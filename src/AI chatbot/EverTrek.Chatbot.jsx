import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  X,
  Minimize2,
  MapPin,
  Mountain
} from "lucide-react";
import { createPortal } from "react-dom";

const EverTrekChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Namaste. I'm your AI Trek Planning Assistant, verified by EverTrek Nepal guides.\n\nHow can I help you today?",
      quickButtons: [
        { text: "Choose a trek", action: "trek-recommend" },
        { text: "Costs & permits", action: "cost-breakdown" },
        { text: "Packing list", action: "packing-list" },
        { text: "Best season", action: "season-guide" }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Refs for outside-click detection
  const chatWindowRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Toggle chat state (open/close)
  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
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
      // Simulated API delay
      await new Promise((resolve) =>
        setTimeout(resolve, 1200 + Math.random() * 800)
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Thank you for your question. I can help with trek selection, safety, costs, and preparation.\n\nPlease specify the trek name or your travel dates for more accuracy.",
          quickButtons: [
            { text: "Compare treks", action: "compare" },
            { text: "Book a trek", action: "booking" },
            { text: "Talk to a guide", action: "human" }
          ]
        }
      ]);
    } catch (error) {
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

  // Close chat completely
  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Toggle minimize
  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeChat();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Prevent body scroll when chat is open (optional)
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isMinimized]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      const target = event.target;

      // Ignore if click is inside chat window
      if (chatWindowRef.current?.contains(target)) return;

      // Ignore if click is on the floating toggle button
      if (toggleButtonRef.current?.contains(target)) return;

      // Close chat when clicking anywhere else
      closeChat();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const root = document.getElementById("chatbot-root");
  if (!root) return null;

  return createPortal(
    <>
      {/* Floating Button - Toggle Open/Close */}
      <button
        ref={toggleButtonRef}
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ease-out group hover:shadow-emerald-500/25 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 ${
          isOpen
            ? "bg-emerald-600 hover:bg-emerald-700 scale-105 ring-4 ring-emerald-400/50"
            : "bg-[#0F2A44] hover:bg-[#14385C]"
        }`}
        aria-label={isOpen ? "Close EverTrek Chatbot" : "Open EverTrek Chatbot"}
        aria-expanded={isOpen}
      >
        {/* Logo wrapper */}
        <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center p-1 overflow-hidden shadow-lg">
          <img
            src="/logo7.webp"
            alt="EverTrek Nepal"
            className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-200"
            loading="lazy"
          />
          {/* Fallback - show on image error */}
          <Mountain className="w-5 h-5 text-[#0F2A44] hidden" />
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className={`fixed bottom-28 right-6 z-[9999] w-full max-w-sm flex flex-col shadow-2xl border backdrop-blur-xl transition-all duration-300 ease-out rounded-3xl overflow-hidden ${
            isMinimized
              ? "h-20 bg-emerald-600 shadow-emerald-500/25"
              : "h-[600px] bg-[#F7F9FB] border-[#E5E9EF]"
          }`}
        >
          {/* Header */}
          <div className="p-5 flex justify-between items-center border-b bg-white/95 backdrop-blur-sm rounded-t-3xl shadow-sm border-[#E5E9EF]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#0F2A44] flex items-center justify-center p-1 shadow-lg">
                <img
                  src="/logo7.webp"
                  alt="EverTrek Nepal"
                  className="w-9 h-9 object-contain rounded-lg"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-lg text-[#0F2A44] truncate">
                  EverTrek Chatbot
                </h3>
                <p className="text-xs text-[#1F7A63] flex items-center gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  Trek Planning Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleMinimize}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                <Minimize2
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    isMinimized ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                onClick={closeChat}
                className="p-2 hover:bg-red-50 rounded-xl text-red-500 hover:bg-red-100 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-gray-300/50 scrollbar-track-transparent">
              {messages.map((msg, i) => (
                <div key={i} className="space-y-3">
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed transition-all duration-200 hover:shadow-md ${
                      msg.role === "user"
                        ? "ml-auto bg-gradient-to-r from-[#1F7A63] to-emerald-600 text-white shadow-emerald-500/25"
                        : "bg-white/80 backdrop-blur-sm border border-gray-100/50 shadow-lg"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.quickButtons && (
                    <div className="flex flex-wrap gap-2 pl-1">
                      {msg.quickButtons.map((btn, j) => (
                        <button
                          key={j}
                          onClick={() => sendQuickAction(btn.action)}
                          className="px-4 py-2 text-xs bg-white/90 hover:bg白 border border-emerald-200 hover:border-emerald-300 text-emerald-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium backdrop-blur-sm"
                        >
                          {btn.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600 font-medium">
                    Consulting trekking experts…
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Minimized State Preview */}
          {isMinimized && (
            <div className="p-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-13 h-13 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <img
                    src="/logo7.webp"
                    alt="Logo"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">EverTrek Chatbot</p>
                  <p className="text-xs opacity-90">3 new messages</p>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          {!isMinimized && (
            <div className="p-5 pt-0 border-t border-gray-100/50 bg-gradient-to-t from-white/70 backdrop-blur-sm">
              <div className="flex items-end gap-3 p-1 rounded-2xl bg-white/50 border border-emerald-100/50">
                <input
                  ref={(el) => el && el.focus()}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about Everest Base Camp, Annapurna costs, permits..."
                  className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-sm resize-none placeholder-gray-500 focus:placeholder-transparent"
                  disabled={isLoading}
                  maxLength={500}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input?.trim() || isLoading}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#0F2A44] to-[#14385C] hover:from-[#14385C] hover:to-[#1A456F] shadow-lg hover:shadow-xl text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send
                    className={`w-5 h-5 transition-transform ${
                      isLoading ? "animate-pulse" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>,
    root
  );
};

export default EverTrekChatbot;
