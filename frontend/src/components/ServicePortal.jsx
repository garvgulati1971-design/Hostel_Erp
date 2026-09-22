import React, { useState, useEffect } from "react";
import "./ServicePortal.css";

export default function ServicePortal({ complaints, setComplaints }) {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [smsLogs, setSmsLogs] = useState([]);
    const [activeSmsModal, setActiveSmsModal] = useState(null);
    const [testPhone, setTestPhone] = useState("+91 98400 55667");
    const [testMsg, setTestMsg] = useState("URGENT: Water leakage reported in Block C Room 302. Plumber requested immediately.");
    const [resolutionNoteInput, setResolutionNoteInput] = useState({});

    // Fetch live SMS logs from Express backend (or fallback to local)
    useEffect(() => {
        fetchSmsLogs();
    }, []);

    const fetchSmsLogs = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/sms/logs");
            const data = await res.json();
            if (data.success) {
                setSmsLogs(data.data);
            }
        } catch (err) {
            console.log("Using local mock SMS logs");
            setSmsLogs([
                { id: "SMS-9901", recipient_phone: "+91 98400 11223", recipient_name: "Suresh (AC Tech)", role: "Service Tech", trigger_event: "New Ticket Assigned", message: "HOSTEL ERP TICKET ASSIGNED: Room 402 AC cooling reduced & dripping. Student: Garv (+91 98765 43210). Priority: Medium.", status: "Delivered (Simulated)", timestamp: "2026-09-03 16:30" },
                { id: "SMS-9902", recipient_phone: "+91 98400 55667", recipient_name: "Mani (Plumber)", role: "Service Tech", trigger_event: "Emergency Plumbing Ticket", message: "ALERT: Bathroom tap leakage in Room 101. Student: Aarav Patel (+91 98401 22334). Priority: High.", status: "Delivered (Simulated)", timestamp: "2026-09-03 17:10" }
            ]);
        }
    };

    const handleUpdateStatus = async (ticketId, newStatus) => {
        const note = resolutionNoteInput[ticketId] || "Work completed by technician.";
        try {
            await fetch("http://localhost:5000/api/complaints/update-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId, status: newStatus, resolutionNotes: note })
            });
        } catch (e) {
            console.log("Local state update fallback");
        }

        // Update local UI state
        setComplaints(prev => prev.map(c => c.id === ticketId ? { ...c, status: newStatus, resolutionNotes: note } : c));
        
        // Trigger simulated SMS to student
        const newSms = {
            id: `SMS-${Math.floor(1000 + Math.random() * 9000)}`,
            recipient_phone: "+91 98765 43210",
            recipient_name: "Garv (Student)",
            role: "Student",
            trigger_event: `Ticket ${newStatus}`,
            message: `HOSTEL SERVICE ALERT: Your request ${ticketId} status has been updated to [${newStatus}]. Notes: ${note}`,
            status: "Delivered (Simulated)",
            timestamp: new Date().toLocaleTimeString()
        };

        setSmsLogs([newSms, ...smsLogs]);
        setActiveSmsModal(newSms);
    };

    const handleSendCustomSms = async (e) => {
        e.preventDefault();
        if (!testPhone.trim() || !testMsg.trim()) return;

        const newSms = {
            id: `SMS-${Math.floor(1000 + Math.random() * 9000)}`,
            recipient_phone: testPhone,
            recipient_name: "Service Tech / Resident",
            role: "Service Tech",
            trigger_event: "Manual SMS Dispatch",
            message: testMsg,
            status: "Delivered (Simulated)",
            timestamp: new Date().toLocaleTimeString()
        };

        try {
            await fetch("http://localhost:5000/api/sms/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipientPhone: testPhone, recipientName: "Service Tech", role: "Service Tech", message: testMsg })
            });
        } catch (err) {}

        setSmsLogs([newSms, ...smsLogs]);
        setActiveSmsModal(newSms);
        setTestMsg("");
    };

    const filteredComplaints = complaints.filter(c => {
        const matchCategory = selectedCategory === "All" || c.category.includes(selectedCategory);
        const matchStatus = selectedStatus === "All" || c.status === selectedStatus;
        return matchCategory && matchStatus;
    });

    return (
        <div className="service-portal-page fade-in">
            <div className="page-header">
                <div>
                    <h1>🛠️ Service Staff & Maintenance Control Portal</h1>
                    <p>Technician Task Board, Ticket Resolution Hub & Instant SMS Gateway Dispatcher</p>
                </div>
                <span className="badge badge-amber">SERVICE TECHNICIAN MODE ACTIVE</span>
            </div>

            {/* Quick Stats Grid */}
            <div className="service-stats-grid">
                <div className="s-card">
                    <span className="s-icon">📋</span>
                    <div>
                        <small>Total Generated Requests</small>
                        <h2>{complaints.length}</h2>
                        <p className="sub">All Categories</p>
                    </div>
                </div>

                <div className="s-card warning">
                    <span className="s-icon">⏳</span>
                    <div>
                        <small>Pending & In Progress</small>
                        <h2>{complaints.filter(c => c.status !== 'Resolved').length}</h2>
                        <p className="sub text-amber">Requires Tech Action</p>
                    </div>
                </div>

                <div className="s-card success">
                    <span className="s-icon">✅</span>
                    <div>
                        <small>Resolved Tickets</small>
                        <h2>{complaints.filter(c => c.status === 'Resolved').length}</h2>
                        <p className="sub text-emerald">Successfully Repaired</p>
                    </div>
                </div>

                <div className="s-card info">
                    <span className="s-icon">📱</span>
                    <div>
                        <small>SMS Notifications Sent</small>
                        <h2>{smsLogs.length}</h2>
                        <p className="sub text-sky">Simulated Gateway</p>
                    </div>
                </div>
            </div>

            <div className="service-main-layout">
                {/* Maintenance Task Queue */}
                <div className="service-task-panel">
                    <div className="panel-header-bar">
                        <div>
                            <h2>🔧 Maintenance Request Task Queue</h2>
                            <p className="panel-sub">Select discipline and update ticket status to notify residents via SMS.</p>
                        </div>

                        <div className="filter-group">
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="All">All Disciplines</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Electrical">Electrical</option>
                                <option value="HVAC">HVAC / Air Conditioning</option>
                                <option value="WiFi">WiFi & Networking</option>
                                <option value="Housekeeping">Housekeeping</option>
                            </select>

                            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                                <option value="All">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    {filteredComplaints.length === 0 ? (
                        <div className="empty-box">No maintenance requests matching selected filters!</div>
                    ) : (
                        <div className="tickets-grid">
                            {filteredComplaints.map(t => (
                                <div key={t.id} className={`ticket-card status-${t.status.toLowerCase().replace(' ', '-')}`}>
                                    <div className="ticket-top">
                                        <div>
                                            <span className="ticket-id">#{t.id}</span>
                                            <h3>{t.title}</h3>
                                            <small className="room-tag">Room {t.roomNo || t.room_no} • {t.category}</small>
                                        </div>
                                        <span className={`badge ${t.priority === 'Emergency' || t.priority === 'High' ? 'badge-rose' : 'badge-amber'}`}>
                                            {t.priority} Priority
                                        </span>
                                    </div>

                                    <p className="ticket-desc">{t.description}</p>

                                    <div className="tech-assigned-info">
                                        <strong>Assigned Technician:</strong> {t.assignedTech || t.assigned_tech || 'Technician Desk'}
                                    </div>

                                    <div className="resolution-input-box">
                                        <input
                                            type="text"
                                            placeholder="Enter repair notes (e.g., Replaced valve, cleaned AC filter)..."
                                            value={resolutionNoteInput[t.id] || ""}
                                            onChange={(e) => setResolutionNoteInput({ ...resolutionNoteInput, [t.id]: e.target.value })}
                                        />
                                    </div>

                                    <div className="ticket-status-actions">
                                        <span className="current-status-lbl">Current: <strong>{t.status}</strong></span>
                                        
                                        <div className="action-btns">
                                            {t.status !== 'In Progress' && (
                                                <button className="btn btn-warning btn-sm" onClick={() => handleUpdateStatus(t.id, 'In Progress')}>
                                                    ⏳ Set In Progress
                                                </button>
                                            )}
                                            {t.status !== 'Resolved' && (
                                                <button className="btn btn-emerald btn-sm" onClick={() => handleUpdateStatus(t.id, 'Resolved')}>
                                                    ✅ Mark Resolved (+SMS)
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Simulated SMS Gateway Drawer */}
                <div className="sms-gateway-panel">
                    <div className="sms-panel-card">
                        <h2>📱 Simulated SMS Gateway Service</h2>
                        <p className="panel-sub">Whenever a request is generated or updated, an SMS notification is sent to technician's phone.</p>

                        <form onSubmit={handleSendCustomSms} className="sms-test-form">
                            <div className="form-group">
                                <label>Recipient Mobile Number</label>
                                <input
                                    type="text"
                                    value={testPhone}
                                    onChange={(e) => setTestPhone(e.target.value)}
                                    placeholder="+91 98400 XXXXX"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Dispatch SMS Message Body</label>
                                <textarea
                                    rows="3"
                                    value={testMsg}
                                    onChange={(e) => setTestMsg(e.target.value)}
                                    placeholder="Type SMS text..."
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary">
                                🚀 Trigger Test SMS Dispatch
                            </button>
                        </form>
                    </div>

                    <div className="sms-logs-card">
                        <h3>📜 Live Dispatched SMS Notification Log</h3>
                        <div className="sms-logs-list">
                            {smsLogs.map(log => (
                                <div key={log.id} className="sms-log-item" onClick={() => setActiveSmsModal(log)}>
                                    <div className="sms-log-head">
                                        <strong>{log.recipient_name || log.recipient_phone}</strong>
                                        <small>{log.timestamp}</small>
                                    </div>
                                    <p className="sms-preview">{log.message}</p>
                                    <div className="sms-meta">
                                        <span className="badge badge-emerald">{log.status}</span>
                                        <small className="event-tag">{log.trigger_event}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Smartphone Simulated SMS Preview Modal */}
            {activeSmsModal && (
                <div className="modal-overlay" onClick={() => setActiveSmsModal(null)}>
                    <div className="phone-sms-mockup" onClick={(e) => e.stopPropagation()}>
                        <div className="phone-header">
                            <span className="speaker"></span>
                            <span className="time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="phone-screen">
                            <div className="sms-sender-bar">
                                <button className="close-phone" onClick={() => setActiveSmsModal(null)}>✕</button>
                                <div>
                                    <strong>SRM-HOSTEL-SMS</strong>
                                    <small>{activeSmsModal.recipient_phone}</small>
                                </div>
                            </div>

                            <div className="sms-bubble-container">
                                <div className="sms-bubble">
                                    <div className="bubble-head">📩 {activeSmsModal.trigger_event}</div>
                                    <p>{activeSmsModal.message}</p>
                                    <small className="bubble-time">{activeSmsModal.timestamp} • Delivered</small>
                                </div>
                            </div>
                            
                            <div className="phone-footer-hint">
                                Simulated SMS Notification received on technician handset
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
