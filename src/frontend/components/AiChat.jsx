import React, { useState } from "react";
import axiosPublic from "../context/axiosPublic";

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
      const res = await axiosPublic.post("/ai", { prompt });
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
          // bg-blueDark i text-white su sada iz tvojih predefinisanih boja
          className="ai-chat-toggle-btn btn btn-blueDark text-white d-flex align-items-center justify-content-center mb-5"
        >
          💬
        </button>
      )}

      {/* Sam chat prozor, prikazuje se samo ako je isChatOpen true */}
      {isChatOpen && (
        // bg-blueDark za pozadinu, text-white za tekst, border-blueLight za ivicu
        <div className="ai-chat-container bg-blueDark text-white border border-blueLight rounded-3 shadow-lg d-flex flex-column">
          {/* Zaglavlje chata */}
          <div className="ai-chat-header p-3 d-flex justify-content-between align-items-center border-bottom border-blueDark">
            <h2 className="m-0 text-white">AI Assistant</h2>{" "}
            {/* Text color za h2 */}
            <button
              onClick={() => setIsChatOpen(false)}
              // btn-link stilizuje kao link, p-0 uklanja default padding
              // text-blueDark za boju dugmeta, hover efekat ćeš morati da definišeš
              // u SCSS-u ako želiš specifičan :hover, ili koristiš Bootstrap utility
              className="btn btn-link btn-close-chat p-0 text-blueLight"
            >
              &times; {/* Dugme za zatvaranje (X) */}
            </button>
          </div>

          {/* Područje za poruke (odgovore), sa scrollbarom */}
          <div className="ai-chat-messages flex-grow-1 p-3 bg-white text-dark">
            {error && <p className="text-danger text-center">{error}</p>}
            {response && (
              <div className="ai-chat-response p-2 rounded-2 mb-2 bg-white border-start border-blueDark">
                <strong className="text-dark">AI Response:</strong>
                <p className="m-0">{response}</p>
              </div>
            )}
            {loading && (
              <div className="ai-chat-message-info text-dark text-center">
                Thinking...
              </div>
            )}
            {!response && !loading && !error && (
              <div className="ai-chat-message-info text-dark text-center">
                Type your question below to start a conversation with the AI
                assistant.
              </div>
            )}
          </div>

          {/* Forma za unos poruke */}
          <form
            onSubmit={handleSubmit}
            // border-top sa blueLight, bg-blueDark za formu
            className="ai-chat-form p-3 border-top border-blueLight bg-blueDark rounded-bottom-3"
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me anything..."
              rows={3} // Smanjite broj redova
              // bg-white za textarea, text-dark za tekst, border-blueLight za ivicu
              className="form-control w-100 p-2 mb-2 bg-white text-dark border border-blueLight"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              // bg-blueDark za dugme, text-white za tekst, border-blueLight za ivicu
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
