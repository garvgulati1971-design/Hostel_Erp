import React, { useState } from "react";
import { classifyComplaintAI } from "../services/aiEngine";
import "./ComplaintsPortal.css";

export default function ComplaintsPortal({ complaints, setComplaints, student }) {
    const [showForm, setShowForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [roomNo, setRoomNo] = useState(student.roomNo || "402");

    // Real-time AI Classification
    const aiPrediction = classifyComplaintAI(title, description);

    const handleSubmitTicket = (e) => {
        e.preventDefault();

        const newTicket = {
            id: `TKT-${Math.floor(4000 + Math.random() * 900)}`,
            title: title || "General Issue",
            category: aiPrediction.category,
            description: description || "No details provided.",
            roomNo,
            priority: aiPrediction.priority,
            status: "Pending",
            assignedTech: aiPrediction.assignedTech,
            estimatedHours: aiPrediction.estimatedHours,
            createdAt: new Date().toISOString(),
            aiAnalysis: aiPrediction.reasoning
        };

        setComplaints([newTicket, ...complaints]);
        setShowForm(false);
        setTitle("");
        setDescription("");
        alert(`Ticket #${newTicket.id} registered! AI auto-prioritized this as ${newTicket.priority} and assigned to ${newTicket.assignedTech}.`);
    };

    const filteredComplaints = filterStatus === "All" 
        ? complaints 
        : complaints.filter(c => c.status === filterStatus);

    return (
        <div className="complaints-page fade-in">
            <div className="page-header">
                <div>
                    <h1>🛠️ Maintenance & Complaints Portal</h1>
                    <p>AI-assisted ticket classification and automated dispatch</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Close Form" : "+ Log New Ticket"}
                </button>
            </div>

            {/* Complaint Form Modal / Card */}
            {showForm && (
                <form className="complaint-form-card fade-in" onSubmit={handleSubmitTicket}>
                    <h2>Log Maintenance Request</h2>
                    <p className="form-sub">Our AI model analyzes request text to determine department assignment and SLA urgency.</p>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Room / Location Number</label>
                            <input
                                type="text"
                                value={roomNo}
                                onChange={(e) => setRoomNo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Issue Subject / Short Title</label>
                            <input
                                type="text"
                                placeholder="e.g. AC leaking water / Lamp light flickering"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Detailed Description</label>
                            <textarea
                                rows="3"
                                placeholder="Describe problem symptoms, timing, and urgency..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* AI Real-time Classifier Card */}
                    <div className="ai-classifier-panel">
                        <div className="ai-classifier-header">
                            <div className="ai-title">
                                🤖 <span>AI Ticket Analyzer Prediction</span>
                            </div>
                            <span className={`badge ${aiPrediction.priority === 'Emergency' ? 'badge-rose' : aiPrediction.priority === 'High' ? 'badge-amber' : 'badge-emerald'}`}>
                                Priority: {aiPrediction.priority}
                            </span>
                        </div>

                        <div className="ai-classifier-grid">
                            <div>
                                <small>Detected Category</small>
                                <strong>{aiPrediction.category}</strong>
                            </div>
                            <div>
                                <small>Assigned Dispatch Tech</small>
                                <strong>{aiPrediction.assignedTech}</strong>
                            </div>
                            <div>
                                <small>Estimated Resolution SLA</small>
                                <strong>Within {aiPrediction.estimatedHours} Hours</strong>
                            </div>
                        </div>
                        <p className="ai-reasoning">💡 <em>AI Notes: {aiPrediction.reasoning}</em></p>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-emerald">
                            Submit Ticket & Dispatch Technician
                        </button>
                    </div>
                </form>
            )}

            {/* Filter Pills */}
            <div className="filters-bar">
                {["All", "Pending", "In Progress", "Resolved"].map((st) => (
                    <button
                        key={st}
                        className={`filter-btn ${filterStatus === st ? "active" : ""}`}
                        onClick={() => setFilterStatus(st)}
                    >
                        {st} ({st === "All" ? complaints.length : complaints.filter(c => c.status === st).length})
                    </button>
                ))}
            </div>

            {/* Tickets Grid */}
            <div className="tickets-grid">
                {filteredComplaints.length === 0 ? (
                    <div className="empty-tickets">No complaints found under filter "{filterStatus}".</div>
                ) : (
                    filteredComplaints.map((ticket) => (
                        <div key={ticket.id} className="ticket-card">
                            <div className="ticket-header">
                                <div>
                                    <span className="ticket-id">#{ticket.id}</span>
                                    <h3>{ticket.title}</h3>
                                </div>
                                <span className={`badge ${ticket.priority === 'Emergency' ? 'badge-rose' : ticket.priority === 'High' ? 'badge-amber' : ticket.priority === 'Medium' ? 'badge-blue' : 'badge-emerald'}`}>
                                    {ticket.priority}
                                </span>
                            </div>

                            <p className="ticket-desc">{ticket.description}</p>

                            <div className="ticket-meta-grid">
                                <div>
                                    <small>Category</small>
                                    <p>{ticket.category}</p>
                                </div>
                                <div>
                                    <small>Room Location</small>
                                    <p>Block C - Room {ticket.roomNo}</p>
                                </div>
                                <div>
                                    <small>Assigned Tech</small>
                                    <p>{ticket.assignedTech}</p>
                                </div>
                                <div>
                                    <small>Logged On</small>
                                    <p>{new Date(ticket.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="ai-note-box">
                                🤖 <small>{ticket.aiAnalysis || "AI auto-categorized and assigned priority."}</small>
                            </div>

                            {/* Ticket Timeline Stepper */}
                            <div className="timeline-stepper">
                                <div className={`step ${ticket.status !== 'Draft' ? 'completed' : ''}`}>
                                    <div className="dot"></div>
                                    <span>Logged</span>
                                </div>
                                <div className={`step ${ticket.status === 'In Progress' || ticket.status === 'Resolved' ? 'completed' : ''}`}>
                                    <div className="dot"></div>
                                    <span>Assigned</span>
                                </div>
                                <div className={`step ${ticket.status === 'Resolved' ? 'completed' : ''}`}>
                                    <div className="dot"></div>
                                    <span>Resolved</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
