import React, { useState } from "react";
import axiosInstance from "../context/axiosInstance";

function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Stanje za kontrolu vidljivosti chat prozora
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Ne brišemo prethodni odgovor, dodajemo novi
    // setResponse("");

    try {
      const res = await axiosInstance.post("/ai", { prompt });
      // Možete ovde dodavati odgovore u niz da bi se prikazala istorija chata
      setResponse(res.data.response); // Za sada, samo poslednji odgovor
      setPrompt(""); // Obriši prompt nakon slanja
    } catch (err) {
      console.error("Error submitting AI prompt:", err);
      // Detaljnija poruka o grešci za korisnika
      setError(
        "Error fetching AI response. Please check your network or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Dugme za otvaranje/zatvaranje chat bota */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="ai-chat-toggle-btn btn btn-primary d-flex align-items-center justify-content-center"
          // Inline stilovi su uklonjeni i zamenjeni klasama, osim za ikonicu
          // Z-index i box-shadow se mogu postaviti u SCSS klasi, ali ovde radi i kao utility class
        >
          💬 {/* Ikona chat balona */}
        </button>
      )}

      {/* Sam chat prozor, prikazuje se samo ako je isChatOpen true */}
      {isChatOpen && (
        <div
          className="ai-chat-container bg-white border border-light rounded-3 shadow-lg d-flex flex-column"
          // Svi inline stilovi su prebačeni u klase
        >
          {/* Zaglavlje chata */}
          <div className="ai-chat-header p-3 d-flex justify-content-between align-items-center">
            <h2 className="m-0">AI Assistant</h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="btn btn-link btn-close-chat p-0" // btn-link stilizuje kao link, p-0 uklanja default padding
            >
              &times; {/* Dugme za zatvaranje (X) */}
            </button>
          </div>

          {/* Područje za poruke (odgovore), sa scrollbarom */}
          <div className="ai-chat-messages flex-grow-1 p-3">
            {error && <p className="text-danger text-center">{error}</p>}
            {response && (
              <div className="ai-chat-response p-2 rounded-2 mb-2">
                <strong>AI Response:</strong>
                <p className="m-0">{response}</p>
              </div>
            )}
            {loading && (
              <div className="ai-chat-message-info text-center">
                Thinking...
              </div>
            )}
            {!response && !loading && !error && (
              <div className="ai-chat-message-info text-center">
                Type your question below to start a conversation with the AI
                assistant.
              </div>
            )}
          </div>

          {/* Forma za unos poruke */}
          <form
            onSubmit={handleSubmit}
            className="ai-chat-form p-3 border-top bg-light rounded-bottom-3"
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me anything..."
              rows={3} // Smanjite broj redova
              className="form-control w-100 p-2 mb-2" // Bootstrap form-control klasa obezbeđuje većinu stila
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="btn btn-primary w-100 py-2 px-3 rounded-2 btn-submit-chat"
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
