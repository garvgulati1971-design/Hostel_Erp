import React, { useState, useRef, useEffect } from "react";
import { queryHostelAIModel, queryGeminiLiveAPI } from "../services/aiEngine";
import "./AIAssistant.css";

export default function AIAssistant({ student }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "bot",
            text: `Hello ${student.name}! I am your SRM Hostel AI Concierge. Ask me about curfew rules, outpass guidelines, maintenance troubleshooting, or mess schedules.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            modelUsed: "SRM Domain Engine"
        }
    ]);
    const [input, setInput] = useState("");
    const [modelMode, setModelMode] = useState("domain"); // "domain" or "gemini"
    const [geminiKey, setGeminiKey] = useState(localStorage.getItem("gemini_api_key") || "");
    const [showKeyInput, setShowKeyInput] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSaveKey = () => {
        localStorage.setItem("gemini_api_key", geminiKey);
        setShowKeyInput(false);
        alert("Gemini API Key saved!");
    };

    const handleSend = async (queryText) => {
        const textToSend = queryText || input;
        if (!textToSend.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: "user",
            text: textToSend,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!queryText) setInput("");
        setIsTyping(true);

        try {
            if (modelMode === "gemini") {
                const activeKey = geminiKey || import.meta.env.VITE_GEMINI_API_KEY;
                if (!activeKey) {
                    throw new Error("No Gemini API key supplied. Please click 'Configure API Key' or switch to SRM Domain Engine.");
                }

                const aiReply = await queryGeminiLiveAPI(activeKey, textToSend, messages);

                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        sender: "bot",
                        text: aiReply,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        modelUsed: "Google Gemini 2.5 Flash"
                    }
                ]);
            } else {
                // Use SRM Hostel Domain Engine
                setTimeout(() => {
                    const result = queryHostelAIModel(textToSend);
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now() + 1,
                            sender: "bot",
                            text: result.answer,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            modelUsed: result.source,
                            confidence: result.confidence
                        }
                    ]);
                    setIsTyping(false);
                }, 400);
                return;
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "bot",
                    text: `⚠️ AI Engine Error: ${err.message}`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    modelUsed: "System Fallback"
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const quickPrompts = [
        "What is the curfew timing for Block C?",
        "How do I apply for a weekend outpass?",
        "How do I report a broken AC?",
        "What are the mess timings for today?"
    ];

    return (
        <div className="ai-page fade-in">
            <div className="page-header">
                <div>
                    <h1>🤖 SRM Hostel AI Assistant</h1>
                    <p>Real-time hostel rule intelligence & campus administration engine</p>
                </div>

                {/* Model Selector Bar */}
                <div className="model-selector-bar">
                    <button
                        className={`model-btn ${modelMode === 'domain' ? 'active' : ''}`}
                        onClick={() => setModelMode("domain")}
                    >
                        🏢 SRM Domain Model
                    </button>
                    <button
                        className={`model-btn ${modelMode === 'gemini' ? 'active' : ''}`}
                        onClick={() => setModelMode("gemini")}
                    >
                        ✨ Google Gemini Live API
                    </button>
                    {modelMode === "gemini" && (
                        <button className="btn btn-secondary key-btn" onClick={() => setShowKeyInput(!showKeyInput)}>
                            🔑 {geminiKey ? "Key Configured" : "Add Key"}
                        </button>
                    )}
                </div>
            </div>

            {/* API Key Modal / Drawer */}
            {showKeyInput && (
                <div className="key-config-card fade-in">
                    <h3>Configure Google Gemini API Key</h3>
                    <p>Enter your Gemini API key to enable general live generative capabilities.</p>
                    <div className="key-input-row">
                        <input
                            type="password"
                            placeholder="AIzaSy..."
                            value={geminiKey}
                            onChange={(e) => setGeminiKey(e.target.value)}
                        />
                        <button className="btn btn-emerald" onClick={handleSaveKey}>Save Key</button>
                    </div>
                </div>
            )}

            {/* Main Chat Interface */}
            <div className="chat-container">
                <div className="messages-area">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
                            <div className="avatar">{msg.sender === "bot" ? "🤖" : "👤"}</div>
                            <div className="chat-bubble">
                                <div className="bubble-header">
                                    <span className="sender-name">{msg.sender === "bot" ? "SRM AI Assistant" : student.name}</span>
                                    <span className="msg-time">{msg.time}</span>
                                </div>
                                <div className="bubble-text">
                                    {msg.text.split('\n').map((line, idx) => (
                                        <p key={idx}>{line}</p>
                                    ))}
                                </div>
                                {msg.modelUsed && (
                                    <div className="model-tag-footer">
                                        <span>Model: {msg.modelUsed}</span>
                                        {msg.confidence && <span> • Confidence: {Math.round(msg.confidence * 100)}%</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="chat-bubble-wrapper bot">
                            <div className="avatar">🤖</div>
                            <div className="chat-bubble typing">
                                <span>AI model is evaluating response...</span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Prompt Suggestions */}
                <div className="quick-prompts-bar">
                    <span className="prompt-label">Quick Suggestions:</span>
                    {quickPrompts.map((qp, i) => (
                        <button key={i} className="prompt-chip" onClick={() => handleSend(qp)}>
                            {qp}
                        </button>
                    ))}
                </div>

                {/* Input Bar */}
                <form
                    className="chat-input-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                >
                    <input
                        type="text"
                        placeholder={`Ask anything about hostel rules, fees, leave passes, or mess menu... (${modelMode === 'domain' ? 'SRM Domain AI' : 'Gemini API Mode'})`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        Send Message →
                    </button>
                </form>
            </div>
        </div>
    );
}
