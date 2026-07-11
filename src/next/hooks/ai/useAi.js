"use client";

import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/api/client";

export default function useAi() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [icon, setIcon] = useState("✨");
  const chatRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        setIsChatOpen(false);
        setIcon("✨");
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsChatOpen(false);
        setIcon("✨");
      }
    };

    if (isChatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isChatOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    const newUserMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const res = await axiosInstance.post("/ai", {
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
  };
}
