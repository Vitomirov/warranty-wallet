import React, { useState } from "react";
import axiosPublic from "../context/axiosPublic";

function AIChat() {
  const [prompt, setPrompt] = useState("");
  // State to store conversation history
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // State to control chat window visibility
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Handles message submission to AI
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    // Adds user's message to history
    const newUserMessage = { role: "user", content: prompt };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    // Prepares messages for backend (filters out system messages if any)
    const messagesToSend = [...messages, newUserMessage].filter(
      (msg) => msg.role !== "system"
    );

    try {
      const res = await axiosPublic.post("/ai", {
        prompt: prompt,
        history: messagesToSend,
      });

      // Adds AI's response to history
      const aiResponseContent = res.data.response;
      const newAiMessage = { role: "assistant", content: aiResponseContent };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
      setPrompt("");
    } catch (err) {
      // Handles errors during AI response fetching
      console.error("Error submitting AI prompt:", err);
      setError(
        "Error fetching AI response. Please check your network or try again."
      );
      // Remove the last user message if no response was received due to an error
      setMessages((prevMessages) =>
        prevMessages.slice(0, prevMessages.length - 1)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button to open/close the chatbot */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          // bg-blueDark i text-white are from your predefined colors
          className="ai-chat-toggle-btn btn btn-blueDark text-white d-flex align-items-center justify-content-center mb-5 me-4 fixed bottom-0 right-0 z-50 p-3 rounded-full shadow-lg"
          // Dodato: Fixed pozicioniranje i z-index za dugme
        >
          💬
        </button>
      )}

      {/* The chat window itself, displayed only if isChatOpen is true */}
      {isChatOpen && (
        // bg-blueDark for background, text-white for text, border-blueLight for border
        <div
          className="ai-chat-container bg-blueDark text-white border border-blueLight rounded-3 shadow-lg d-flex flex-column me-4 fixed bottom-0 right-0 z-50"
          style={{ width: "320px", height: "400px" }} // Adjusted fixed size for clarity
        >
          {/* Chat Header */}
          <div className="ai-chat-header montserrat p-3 d-flex justify-content-between align-items-center border-bottom border-blueDark">
            <h2 className="m-0 text-white">AI Assistant</h2>{" "}
            {/* Text color for h2 */}
            <button
              onClick={() => setIsChatOpen(false)}
              // btn-link styles as a link, p-0 removes default padding
              // text-blueDark for button color
              className="btn btn-link btn-close-chat p-0 text-blueLight"
            >
              &times; {/* Close button (X) */}
            </button>
          </div>

          {/* Message area (responses), with scrollbar */}
          <div className="ai-chat-messages flex-grow-1 p-3 bg-white text-dark overflow-y-auto">
            {/* Display initial message if no messages, not loading, and no error */}
            {messages.length === 0 && !loading && !error && (
              <div className="ai-chat-message-info text-dark montserrat text-center fs-5">
                Type your question below to start a conversation with the AI
                assistant.
              </div>
            )}
            {/* Map through messages array to display conversation */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-2 mb-2 ${
                  msg.role === "user"
                    ? "bg-blue-100 text-blue-800 ms-auto me-0" // User message on the right
                    : "bg-gray-100 text-gray-800 me-auto ms-0 border-start border-blueDark" // AI message on the left
                }`}
                style={{ maxWidth: "80%" }} // Keep messages within reasonable width
              >
                <strong
                  className={`${
                    msg.role === "user" ? "text-blue-800" : "text-dark"
                  } montserrat`}
                >
                  {msg.role === "user" ? "You:" : "AI Response:"}
                </strong>
                <p className="m-0 whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
            {/* Display loading indicator */}
            {loading && (
              <div className="ai-chat-message-info text-dark text-center">
                Thinking...
              </div>
            )}
            {/* Display error message */}
            {error && <p className="text-danger text-center">{error}</p>}
          </div>

          {/* Message input form */}
          <form
            onSubmit={handleSubmit}
            // border-top with blueLight, bg-blueDark for form
            className="ai-chat-form p-3 border-top border-blueLight bg-blueDark rounded-bottom-3"
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me anything..."
              rows={3} // Reduce the number of rows
              // bg-white for textarea, text-dark for text, border-blueLight for border
              className="form-control w-100 p-2 mb-2 bg-white text-dark border border-blueLight"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              // bg-blueDark for button, text-white for text, border-blueLight for border
              className="btn btn-blueDark text-white border border-blueLight w-100 py-2 px-3 rounded-2 btn-submit-chat"
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
