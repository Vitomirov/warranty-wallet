import React from "react";
import { useAi } from "../../hooks/useAi";
import { useAuth } from "../../context/auth/AuthContext";
import { useLocation } from "react-router-dom";

function AIChat() {
  const { token } = useAuth();
  const location = useLocation();
  const {
    prompt,
    messages,
    loading,
    error,
    isChatOpen,
    icon,
    chatRef,
    handleSubmit,
    handleKeyDown,
    handleToggleChat,
    handlePromptChange,
  } = useAi();

  const isHomePage = location.pathname === "/";
  const buttonClass = `ai-chat-toggle-btn d-flex align-items-center justify-content-center ${
    token ? "logged-in" : ""
  } ${isHomePage ? "homepage" : ""}`;

  return (
    <>
      {/*
        The button is now only rendered when the chat is NOT open.
        This removes the redundant "X" icon when the chat window is visible.
      */}
      {!isChatOpen && (
        <button onClick={handleToggleChat} className={buttonClass}>
          {icon}
        </button>
      )}

      {isChatOpen && (
        <div ref={chatRef} className="ai-chat-container d-flex flex-column">
          <div className="ai-chat-header d-flex justify-content-between align-items-center">
            <h2 className="m-0">AI Assistant</h2>
            {/* This is the X button that closes the chat */}
            <button onClick={handleToggleChat} className="btn-close-chat">
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
              onChange={handlePromptChange}
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
