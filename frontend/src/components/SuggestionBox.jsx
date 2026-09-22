import React, { useState, useEffect } from "react";
import CollegeLogo from "./CollegeLogo";
import { INITIAL_SUGGESTIONS } from "../data/mockData";
import { moderateSuggestionAI } from "../services/aiEngine";
import "./SuggestionBox.css";

export default function SuggestionBox({ student, userRole }) {
    const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("trending"); // "trending" | "recent"
    const [showNewModal, setShowNewModal] = useState(false);
    const [activeDiscussionId, setActiveDiscussionId] = useState(null);

    // Form inputs
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Mess & Dining");
    const [authorAlias, setAuthorAlias] = useState("Anonymous Resident");
    const [hostelBlock, setHostelBlock] = useState(student.hostelBlock || "C-Block (Boys Executive)");

    // AI Shield state
    const [aiFeedback, setAiFeedback] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Opinion comment input state: { [suggestionId]: string }
    const [commentInputs, setCommentInputs] = useState({});

    // Warden official reply state
    const [wardenReplyInputs, setWardenReplyInputs] = useState({});
    const [wardenStatusInputs, setWardenStatusInputs] = useState({});

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/suggestions");
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                // Map server DB records
                const mapped = data.data.map(s => ({
                    id: s.id,
                    category: s.category,
                    title: s.title,
                    content: s.content,
                    authorAlias: s.author_alias,
                    hostelBlock: s.hostel_block,
                    aiStatus: s.ai_status,
                    aiAnalysis: s.ai_analysis,
                    aiSentiment: s.ai_sentiment,
                    upvotes: s.upvotes,
                    downvotes: s.downvotes,
                    wardenResponse: s.warden_response,
                    wardenStatus: s.warden_status,
                    createdAt: s.created_at ? new Date(s.created_at).toLocaleDateString() : "Recently",
                    comments: s.comments || []
                }));
                setSuggestions(mapped);
            }
        } catch (e) {
            console.log("Using local suggestions dataset fallback");
        }
    };

    // Live AI validation as user types
    const handleCheckAI = () => {
        if (!title.trim() && !content.trim()) {
            setAiFeedback(null);
            return;
        }
        const check = moderateSuggestionAI(title, content);
        setAiFeedback(check);
    };

    const handleCreateSuggestion = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Step 1: AI Guard evaluation
        const aiCheck = moderateSuggestionAI(title, content);
        setAiFeedback(aiCheck);

        if (!aiCheck.isApproved) {
            setIsSubmitting(false);
            return; // Block submission!
        }

        // Step 2: Post to backend
        const payload = {
            title,
            content,
            category,
            authorAlias: authorAlias.trim() || "Anonymous Resident",
            hostelBlock
        };

        try {
            const res = await fetch("http://localhost:5000/api/suggestions/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!data.success && data.isBlockedByAI) {
                setAiFeedback({
                    isApproved: false,
                    feedback: data.message
                });
                setIsSubmitting(false);
                return;
            }
        } catch (err) {
            console.log("Local state fallback for suggestion");
        }

        const newSug = {
            id: `SUG-${Date.now()}`,
            category,
            title,
            content,
            authorAlias: authorAlias.trim() || "Anonymous Resident",
            hostelBlock,
            aiStatus: "Approved",
            aiAnalysis: aiCheck.feedback,
            aiSentiment: aiCheck.sentiment,
            upvotes: 1,
            downvotes: 0,
            wardenResponse: null,
            wardenStatus: "Open for Discussion",
            createdAt: "Just now",
            comments: []
        };

        setSuggestions([newSug, ...suggestions]);
        setShowNewModal(false);
        setTitle("");
        setContent("");
        setAiFeedback(null);
        setIsSubmitting(false);
        alert("Success! Your suggestion has been verified by the AI Content Shield and published to the student community board.");
    };

    const handleVote = async (id, voteType) => {
        try {
            await fetch("http://localhost:5000/api/suggestions/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ suggestionId: id, voteType })
            });
        } catch (e) {}

        setSuggestions(prev => prev.map(s => {
            if (s.id === id) {
                return {
                    ...s,
                    upvotes: voteType === "up" ? s.upvotes + 1 : s.upvotes,
                    downvotes: voteType === "down" ? s.downvotes + 1 : s.downvotes
                };
            }
            return s;
        }));
    };

    const handleAddComment = async (suggestionId) => {
        const text = commentInputs[suggestionId];
        if (!text || !text.trim()) return;

        // AI filter check for comment too!
        const aiCheck = moderateSuggestionAI("Comment", text);
        if (!aiCheck.isApproved) {
            alert(`⚠️ Comment Blocked by AI Guard: ${aiCheck.feedback}`);
            return;
        }

        const authorName = userRole === "warden" ? "Dr. K. Sharma (Chief Warden)" : "Fellow Resident";

        try {
            await fetch("http://localhost:5000/api/suggestions/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    suggestionId,
                    authorAlias: authorName,
                    commentText: text,
                    isWarden: userRole === "warden"
                })
            });
        } catch (e) {}

        const newComment = {
            id: `COM-${Date.now()}`,
            authorAlias: authorName,
            commentText: text,
            isWarden: userRole === "warden",
            time: "Just now"
        };

        setSuggestions(prev => prev.map(s => {
            if (s.id === suggestionId) {
                return { ...s, comments: [...(s.comments || []), newComment] };
            }
            return s;
        }));

        setCommentInputs({ ...commentInputs, [suggestionId]: "" });
    };

    const handleWardenResponse = async (suggestionId) => {
        const text = wardenReplyInputs[suggestionId];
        const status = wardenStatusInputs[suggestionId] || "Under Review";
        if (!text || !text.trim()) return;

        try {
            await fetch("http://localhost:5000/api/suggestions/warden-respond", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    suggestionId,
                    responseText: text,
                    wardenStatus: status
                })
            });
        } catch (e) {}

        setSuggestions(prev => prev.map(s => {
            if (s.id === suggestionId) {
                return { ...s, wardenResponse: text, wardenStatus: status };
            }
            return s;
        }));

        setWardenReplyInputs({ ...wardenReplyInputs, [suggestionId]: "" });
        alert("Official Warden Response posted to this student suggestion!");
    };

    const categories = ["All", "Mess & Dining", "Campus Wi-Fi", "Infrastructure & Study Spaces", "Hostel Amenities", "Curfew & Resident Policy", "Sports & Fitness"];

    let sortedList = [...suggestions];
    if (sortBy === "trending") {
        sortedList.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    } else {
        sortedList.reverse();
    }

    const filteredSuggestions = selectedCategory === "All"
        ? sortedList
        : sortedList.filter(s => s.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    return (
        <div className="suggestion-box-page fade-in">
            {/* Header */}
            <div className="suggestion-header">
                <div>
                    <div className="ai-shield-tag">
                        <span>🛡️ AI-MODERATED ANONYMOUS STUDENT VOICE</span>
                        <span className="badge badge-gold">DEMOCRATIC CAMPUS FORUM</span>
                    </div>
                    <h1>💡 Anonymous Suggestion Box &amp; Ideas</h1>
                    <p>
                        Post constructive suggestions anonymously. Our AI Content Guard ensures nothing vulgar, abusive, or harmful is posted, while allowing everyone to vote and give opinions.
                    </p>
                </div>

                <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
                    ✍️ Post Anonymous Suggestion
                </button>
            </div>

            {/* Explainer Banner */}
            <div className="ai-safeguard-banner">
                <div className="shield-icon">🤖🛡️</div>
                <div className="shield-text">
                    <strong>Real-Time AI Moderation Shield Active:</strong>
                    <p>
                        Suggestions are analyzed before publishing. Vulgarity, profanity, defamatory harassment, and malicious spam are automatically blocked. Clean and constructive ideas are published publicly so residents and wardens can discuss, upvote, and enact improvements.
                    </p>
                </div>
            </div>

            {/* Filter & Sort Bar */}
            <div className="suggestion-controls-bar">
                <div className="cat-filter-chips">
                    {categories.map(c => (
                        <button 
                            key={c}
                            className={`chip ${selectedCategory === c ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                <div className="sort-group">
                    <span>Sort by:</span>
                    <button 
                        className={`sort-btn ${sortBy === 'trending' ? 'active' : ''}`}
                        onClick={() => setSortBy('trending')}
                    >
                        🔥 Most Upvoted
                    </button>
                    <button 
                        className={`sort-btn ${sortBy === 'recent' ? 'active' : ''}`}
                        onClick={() => setSortBy('recent')}
                    >
                        ⏱️ Recent
                    </button>
                </div>
            </div>

            {/* Suggestions Feed */}
            <div className="suggestions-feed">
                {filteredSuggestions.map((sug) => (
                    <div key={sug.id} className="suggestion-card">
                        <div className="suggestion-card-top">
                            <div className="sug-left-meta">
                                <span className="sug-category-badge">{sug.category}</span>
                                <span className="sug-block-tag">📍 {sug.hostelBlock}</span>
                                <span className="ai-verified-badge">
                                    <span className="sparkle">✨</span> AI Verified Clean
                                </span>
                            </div>

                            <span className="sug-time">{sug.createdAt}</span>
                        </div>

                        <h2 className="sug-title">{sug.title}</h2>
                        <p className="sug-content">{sug.content}</p>

                        {/* AI Classification Pill */}
                        <div className="ai-analysis-pill">
                            <span className="ai-bot-icon">🤖</span>
                            <div className="ai-pill-text">
                                <small>AI Sentiment Assessment:</small>
                                <span>{sug.aiSentiment || "Constructive Community Feedback"}</span>
                            </div>
                        </div>

                        {/* Official Warden Response (if available) */}
                        {sug.wardenResponse && (
                            <div className="warden-response-box">
                                <div className="warden-res-header">
                                    <span>👨‍💼 Official Administration Response</span>
                                    <span className="badge badge-emerald">{sug.wardenStatus || "Accepted"}</span>
                                </div>
                                <p>{sug.wardenResponse}</p>
                            </div>
                        )}

                        {/* Action Bar (Voting & Discussion Toggle) */}
                        <div className="sug-action-bar">
                            <div className="vote-buttons-cluster">
                                <button 
                                    className="vote-btn upvote" 
                                    onClick={() => handleVote(sug.id, 'up')}
                                    title="Upvote / Agree with this suggestion"
                                >
                                    👍 Agree ({sug.upvotes})
                                </button>
                                <button 
                                    className="vote-btn downvote" 
                                    onClick={() => handleVote(sug.id, 'down')}
                                    title="Downvote / Disagree"
                                >
                                    👎 ({sug.downvotes})
                                </button>
                            </div>

                            <div className="author-pill">
                                <span>Author: <strong>{sug.authorAlias}</strong></span>
                            </div>

                            <button 
                                className="toggle-discussion-btn"
                                onClick={() => setActiveDiscussionId(activeDiscussionId === sug.id ? null : sug.id)}
                            >
                                💬 Opinions &amp; Discussion ({(sug.comments || []).length})
                            </button>
                        </div>

                        {/* Discussion Section */}
                        {activeDiscussionId === sug.id && (
                            <div className="discussion-drawer fade-in">
                                <h4>Resident Opinions &amp; Community Voices:</h4>
                                
                                <div className="comments-list">
                                    {(sug.comments || []).length === 0 ? (
                                        <p className="no-comments-yet">No opinions shared yet. Be the first to give your perspective!</p>
                                    ) : (
                                        sug.comments.map((c, i) => (
                                            <div key={i} className={`comment-bubble ${c.isWarden ? 'warden-comment' : ''}`}>
                                                <div className="comment-header">
                                                    <strong>{c.authorAlias}</strong>
                                                    <small>{c.time || "Recently"}</small>
                                                </div>
                                                <p>{c.commentText}</p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Add Opinion Input */}
                                <div className="add-comment-box">
                                    <input 
                                        type="text" 
                                        placeholder="Share your respectful opinion (AI screened)..."
                                        value={commentInputs[sug.id] || ""}
                                        onChange={(e) => setCommentInputs({ ...commentInputs, [sug.id]: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(sug.id)}
                                    />
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleAddComment(sug.id)}>
                                        Post Opinion
                                    </button>
                                </div>

                                {/* Warden Action Section (If Warden Logged In) */}
                                {userRole === "warden" && (
                                    <div className="warden-admin-reply-box">
                                        <div className="warden-reply-label">👨‍💼 Post Official Warden Resolution:</div>
                                        <div className="warden-reply-controls">
                                            <input 
                                                type="text" 
                                                placeholder="Enter official administration action / note..."
                                                value={wardenReplyInputs[sug.id] || ""}
                                                onChange={(e) => setWardenReplyInputs({ ...wardenReplyInputs, [sug.id]: e.target.value })}
                                            />
                                            <select 
                                                value={wardenStatusInputs[sug.id] || "Under Review"}
                                                onChange={(e) => setWardenStatusInputs({ ...wardenStatusInputs, [sug.id]: e.target.value })}
                                            >
                                                <option value="Under Active Review">Under Active Review</option>
                                                <option value="Accepted & Planned">Accepted &amp; Planned</option>
                                                <option value="Action Taken">Action Taken</option>
                                                <option value="Closed / Explained">Closed / Explained</option>
                                            </select>
                                            <button className="btn btn-emerald btn-sm" onClick={() => handleWardenResponse(sug.id)}>
                                                Publish Official Notice
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal: Post New Suggestion */}
            {showNewModal && (
                <div className="suggestion-modal-backdrop" onClick={() => setShowNewModal(false)}>
                    <form className="suggestion-modal-card fade-in" onClick={(e) => e.stopPropagation()} onSubmit={handleCreateSuggestion}>
                        <div className="modal-header">
                            <div>
                                <h2>✍️ Submit Anonymous Suggestion</h2>
                                <p className="modal-sub">Protected by automated AI safety guard</p>
                            </div>
                            <button type="button" className="close-btn" onClick={() => setShowNewModal(false)}>✕</button>
                        </div>

                        <div className="form-group">
                            <label>Suggestion Title *</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Request 24x7 study common room in Block G"
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); }}
                                onBlur={handleCheckAI}
                                required 
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="Mess & Dining">Mess &amp; Dining</option>
                                    <option value="Campus Wi-Fi">Campus Wi-Fi &amp; Internet</option>
                                    <option value="Infrastructure & Study Spaces">Infrastructure &amp; Study Spaces</option>
                                    <option value="Hostel Amenities">Hostel Amenities &amp; Laundry</option>
                                    <option value="Curfew & Resident Policy">Curfew &amp; Resident Policy</option>
                                    <option value="Sports & Fitness">Sports &amp; Fitness</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Hostel Block Concerned</label>
                                <select value={hostelBlock} onChange={(e) => setHostelBlock(e.target.value)}>
                                    <option value="All Blocks">All Blocks (Campus-wide)</option>
                                    <option value="I-Block (International & Senior Wing)">I-Block (International &amp; Senior)</option>
                                    <option value="G-Block (Engineering Boys Deluxe)">G-Block (Engineering Deluxe)</option>
                                    <option value="H-Block (Postgraduate & Research Block)">H-Block (Postgraduate &amp; Research)</option>
                                    <option value="C-Block (Boys Executive)">C-Block (Boys Executive)</option>
                                    <option value="A-Block (Boys Standard)">A-Block (Standard)</option>
                                    <option value="B-Block (Boys Deluxe)">B-Block (Deluxe)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Your Anonymous Alias / Handle</label>
                            <input 
                                type="text" 
                                placeholder="Anonymous Resident (or e.g. Block I Resident, Placement Rep)"
                                value={authorAlias}
                                onChange={(e) => setAuthorAlias(e.target.value)}
                            />
                            <small className="field-hint">Your real student ID and roll number are never revealed.</small>
                        </div>

                        <div className="form-group">
                            <label>Detailed Suggestion &amp; Constructive Reasoning *</label>
                            <textarea 
                                rows="4"
                                placeholder="Explain the problem and proposed solution clearly so fellow residents and wardens can support it..."
                                value={content}
                                onChange={(e) => { setContent(e.target.value); }}
                                onBlur={handleCheckAI}
                                required 
                            />
                        </div>

                        {/* AI Guard Live Banner */}
                        {aiFeedback && (
                            <div className={`ai-guard-feedback-box ${aiFeedback.isApproved ? 'clean' : 'blocked'}`}>
                                <div className="guard-icon">{aiFeedback.isApproved ? '✅' : '🛑'}</div>
                                <div>
                                    <strong>{aiFeedback.isApproved ? 'AI Content Verified Clean' : 'AI Safety Filter Blocked Submission'}</strong>
                                    <p>{aiFeedback.feedback || aiFeedback.reason}</p>
                                </div>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowNewModal(false)}>
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className={`btn ${aiFeedback && !aiFeedback.isApproved ? 'btn-danger' : 'btn-primary'}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Running AI Screen..." : "Screen & Post Suggestion →"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
