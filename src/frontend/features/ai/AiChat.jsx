import React, { useState, useEffect, useRef } from "react";
import axiosPublic from "../../context/api/axiosPublic";
import { useAuth } from "../../context/auth/AuthContext";
import { useLocation } from "react-router-dom";

function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [icon, setIcon] = useState("✨");
  const [buttonStyle, setButtonStyle] = useState({});
  const chatRef = useRef();
  const { token } = useAuth();
  const location = useLocation();

  // Responsive button positioning
  useEffect(() => {
    const updateButtonPosition = () => {
      const isMobile = window.innerWidth <= 768;
      if (location.pathname === "/") {
        setButtonStyle({
          bottom: isMobile ? "90px" : "120px",
          right: isMobile ? "65px" : "40px",
          zIndex: 10015,
        });
      } else if (token) {
        setButtonStyle({
          bottom: isMobile ? "155px" : "90px",
          right: isMobile ? "20px" : "80px",
          zIndex: 10015,
        });
      } else {
        setButtonStyle({
          bottom: isMobile ? "110px" : "120px",
          right: isMobile ? "35px" : "40px",
          zIndex: 10015,
        });
      }
    };
    updateButtonPosition();
    window.addEventListener("resize", updateButtonPosition);
    return () => window.removeEventListener("resize", updateButtonPosition);
  }, [location.pathname, token]);

  // Close chat by clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        setIsChatOpen(false);
        setIcon("✨");
      }
    };
    if (isChatOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isChatOpen]);

  // Close chat by pressing Escape
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        setIsChatOpen(false);
        setIcon("✨");
      }
    };
    if (isChatOpen) document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isChatOpen]);

  // Send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    const newUserMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const res = await axiosPublic.post("/ai", {
        prompt,
        history: [...messages, newUserMessage],
      });
      const newAiMessage = { role: "assistant", content: res.data.response };
      setMessages((prev) => [...prev, newAiMessage]);
      setPrompt("");
    } catch (err) {
      console.error(err);
      setError("AI is currently unavailable. Please try again later.");
      setMessages((prev) => prev.slice(0, prev.length - 1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      {!isChatOpen && (
        <button
          onClick={() => {
            setIsChatOpen(true);
            setIcon("❌");
          }}
          className={`ai-chat-toggle-btn d-flex align-items-center justify-content-center ${
            token ? "logged-in" : ""
          }`}
          style={buttonStyle}
        >
          {icon}
        </button>
      )}

      {isChatOpen && (
        <div ref={chatRef} className="ai-chat-container d-flex flex-column">
          <div className="ai-chat-header d-flex justify-content-between align-items-center">
            <h2 className="m-0">AI Assistant</h2>
            <button
              onClick={() => {
                setIsChatOpen(false);
                setIcon("✨");
              }}
              className="btn-close-chat"
            >
              &times;
            </button>
          </div>

          <div className="ai-chat-messages flex-grow-1">
            {messages.length === 0 && !loading && !error && (
              <div className="ai-chat-message text-center">
                Hi there! Need help or have a question? I'm here for you.
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-2 ${
                  msg.role === "user" ? "user-msg" : "ai-msg"
                }`}
              >
                <strong>{msg.role === "user" ? "You:" : "AI:"}</strong>
                <p className="m-0">{msg.content}</p>
              </div>
            ))}
            {loading && <div className="text-center">Thinking...</div>}
            {error && <div className="text-danger text-center">{error}</div>}
          </div>

          <form onSubmit={handleSubmit} className="ai-chat-form">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={3}
              className="form-control mb-2"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="btn-submit-chat"
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default AIChat;
