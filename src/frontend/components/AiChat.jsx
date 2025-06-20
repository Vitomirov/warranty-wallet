import React, { useState, useEffect, useRef } from "react";
import axiosPublic from "../context/axiosPublic";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [buttonStyle, setButtonStyle] = useState({});
  const chatRef = useRef();
  const { token } = useAuth();
  const location = useLocation();

  // Responsivno pozicioniranje dugmeta
  useEffect(() => {
    const updateButtonPosition = () => {
      const isMobile = window.innerWidth <= 768;
      if (location.pathname === "/") {
        // Landing page - dugme je više od dna da je odmah vidljivo
        setButtonStyle({
          bottom: isMobile ? "90px" : "120px",
          right: isMobile ? "65px" : "40px",
          zIndex: 10015,
        });
      } else if (token) {
        // Logovan korisnik - pomeri dugme više udesno
        setButtonStyle({
          bottom: isMobile ? "155px" : "90px",
          right: isMobile ? "20px" : "80px",
          zIndex: 10015,
        });
      } else {
        // Ostali slučajevi
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

  // Zatvaranje chata klikom izvan chata
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        setIsChatOpen(false);
      }
    };
    if (isChatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isChatOpen]);

  // Close chat by pressing Escape key
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        setIsChatOpen(false);
      }
    };

    if (isChatOpen) {
      document.addEventListener("keydown", handleKeydown);
    }
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isChatOpen]);

  // Slanje poruke AI-u
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

  // Handle Enter key press
  const handleKeyDown = (e) => {
    // Check if Enter key is pressed AND it's not Shift + Enter (for new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (e.g., new line in textarea)
      handleSubmit(e); // Call your submit function
    }
  };

  return (
    <>
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className={`ai-chat-toggle-btn d-flex align-items-center justify-content-center ${
            token ? "logged-in" : ""
          }`}
          style={buttonStyle} // inline style for position
        >
          💬
        </button>
      )}

      {isChatOpen && (
        <div ref={chatRef} className="ai-chat-container d-flex flex-column">
          <div className="ai-chat-header d-flex justify-content-between align-items-center">
            <h2 className="m-0">AI Assistant</h2>
            <button
              onClick={() => setIsChatOpen(false)}
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
