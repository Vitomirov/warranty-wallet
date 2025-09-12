import { useState, useEffect, useRef } from "react";
import axiosPublic from "../context/api/axiosPublic";
import { useAuth } from "../context/auth/AuthContext";
import { useLocation } from "react-router-dom";

export const useAi = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [icon, setIcon] = useState("✨");
  const chatRef = useRef();
  const { token } = useAuth();
  const location = useLocation();

  // Close chat by clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        setIsChatOpen(false);
        setIcon("✨");
      }
    };

    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        setIsChatOpen(false);
        setIcon("✨");
      }
    };

    if (isChatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeydown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeydown);
    };
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

  const handleToggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handlePromptChange = (e) => setPrompt(e.target.value);

  return {
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
    token,
    location,
  };
};
