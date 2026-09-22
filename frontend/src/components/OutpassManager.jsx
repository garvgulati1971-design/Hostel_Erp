import React, { useState } from "react";
import { assessOutpassRiskAI } from "../services/aiEngine";
import "./OutpassManager.css";

export default function OutpassManager({ outpasses, setOutpasses, student, setPage, userRole }) {
    const [showForm, setShowForm] = useState(false);

    // Form inputs
    const [type, setType] = useState("Day Outpass");
    const [destination, setDestination] = useState("");
    const [reason, setReason] = useState("");
    const [outDate, setOutDate] = useState("2026-09-04T10:00");
    const [expectedInDate, setExpectedInDate] = useState("2026-09-04T18:00");

    // Real-time AI Risk evaluation
    const aiAssessment = assessOutpassRiskAI({
        destination,
        reason,
        type,
        outDate,
        expectedInDate,
        attendanceRate: student.attendanceRate
    });

    const handleApply = (e) => {
        e.preventDefault();

        const newPass = {
            id: `OTP-2026-${Math.floor(100 + Math.random() * 900)}`,
            type,
            destination: destination || "City Visit",
            reason: reason || "Personal Work",
            outDate,
            expectedInDate,
            status: aiAssessment.riskScore < 35 ? "Approved" : "Pending Warden Review",
            qrCode: `SRM-PASS-${student.name.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
            approvedBy: aiAssessment.riskScore < 35 ? "AI Fast-Track Auto-Approve" : "Pending Warden",
            aiRiskScore: aiAssessment.riskScore,
            aiRiskLevel: aiAssessment.riskLevel,
            createdAt: new Date().toISOString()
        };

        setOutpasses([newPass, ...outpasses]);
        setShowForm(false);
        setDestination("");
        setReason("");
        alert(
            newPass.status === "Approved"
                ? "Outpass submitted! AI Fast-Track approved your pass immediately."
                : "Outpass submitted! High/Moderate risk detected; sent to Warden Dr. K. Sharma for review."
        );
    };

    const activePass = outpasses.find((p) => p.status === "Approved");

    return (
        <div className="outpass-page fade-in">
            <div className="page-header">
                <div>
                    <h1>🎫 Gate Pass & Outpass Center</h1>
                    <p>Digital QR passes with AI security risk evaluation</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Close Form" : "+ Apply New Outpass"}
                </button>
            </div>

            {/* Active Gate Pass Section */}
            {activePass && (
                <div className="active-pass-card">
                    <div className="pass-status-strip">
                        <span className="badge badge-emerald">ACTIVE QR GATE PASS</span>
                        <small>Pass ID: {activePass.id}</small>
                    </div>

                    <div className="pass-grid">
                        <div className="pass-details">
                            <h2>{activePass.type}</h2>
                            <p className="dest">📍 Destination: <strong>{activePass.destination}</strong></p>
                            <p className="reason">📝 Reason: {activePass.reason}</p>

                            <div className="time-box">
                                <div>
                                    <small>Valid Out Time</small>
                                    <p>{new Date(activePass.outDate).toLocaleString()}</p>
                                </div>
                                <div>
                                    <small>Curfew Return Time</small>
                                    <p>{new Date(activePass.expectedInDate).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="approval-meta">
                                <span>Approved By: <strong>{activePass.approvedBy}</strong></span>
                                <span className="badge badge-indigo">AI Risk: {activePass.aiRiskScore}/100 ({activePass.aiRiskLevel})</span>
                            </div>
                        </div>

                        {/* Digital QR Code Display */}
                        <div className="qr-container">
                            <div className="qr-box">
                                <div className="qr-simulated">
                                    <div className="qr-corner top-left"></div>
                                    <div className="qr-corner top-right"></div>
                                    <div className="qr-corner bottom-left"></div>
                                    <div className="qr-center-text">SRM QR</div>
                                </div>
                            </div>
                            <small className="qr-label">Scan at Main Gate Scanner</small>
                            <span className="badge badge-emerald">READY TO SCAN</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Apply Outpass Form with Real-time AI Risk Assessor */}
            {showForm && (
                <form className="outpass-form-card fade-in" onSubmit={handleApply}>
                    <h2>Request Digital Outpass</h2>
                    <p className="form-sub">Our AI model continuously evaluates destination safety, timings, and attendance parameters.</p>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Outpass Category</label>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="Day Outpass">Day Outpass (Return before 08:30 PM)</option>
                                <option value="Weekend Night Leave">Weekend Night Leave (Home / Family)</option>
                                <option value="Emergency Outpass">Emergency Outpass</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Destination Location</label>
                            <input
                                type="text"
                                placeholder="e.g. Forum Mall Vadapalani / Home Bangalore"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Departure Date & Time</label>
                            <input
                                type="datetime-local"
                                value={outDate}
                                onChange={(e) => setOutDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Expected Return Date & Time</label>
                            <input
                                type="datetime-local"
                                value={expectedInDate}
                                onChange={(e) => setExpectedInDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Detailed Purpose / Reason</label>
                            <textarea
                                rows="2"
                                placeholder="Specify purpose of leaving hostel..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* AI Real-Time Risk Assessor Preview Box */}
                    <div className="ai-risk-panel">
                        <div className="ai-risk-header">
                            <div className="ai-title">
                                🤖 <span>AI Security Risk Engine Preview</span>
                            </div>
                            <span className={`badge ${aiAssessment.riskLevel === 'Low Risk' ? 'badge-emerald' : aiAssessment.riskLevel === 'Moderate Risk' ? 'badge-amber' : 'badge-rose'}`}>
                                {aiAssessment.riskLevel} (Score: {aiAssessment.riskScore}/100)
                            </span>
                        </div>

                        <div className="ai-risk-body">
                            <p><strong>Recommendation:</strong> {aiAssessment.recommendation}</p>
                            <ul className="risk-flags">
                                {aiAssessment.flags.map((flag, i) => (
                                    <li key={i}>• {flag}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-emerald">
                            Submit Request & Generate Gate Pass
                        </button>
                    </div>
                </form>
            )}

            {/* Outpass History Table */}
            <div className="outpass-history-card">
                <h2>Outpass Request History</h2>

                <table className="outpass-table">
                    <thead>
                        <tr>
                            <th>Pass ID</th>
                            <th>Type</th>
                            <th>Destination</th>
                            <th>Out Time</th>
                            <th>Return Time</th>
                            <th>AI Risk</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {outpasses.map((pass) => (
                            <tr key={pass.id}>
                                <td><strong>{pass.id}</strong></td>
                                <td>{pass.type}</td>
                                <td>{pass.destination}</td>
                                <td>{new Date(pass.outDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{new Date(pass.expectedInDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                <td>
                                    <span className={`badge ${pass.aiRiskScore < 30 ? 'badge-emerald' : pass.aiRiskScore < 70 ? 'badge-amber' : 'badge-rose'}`}>
                                        {pass.aiRiskScore ?? 10}/100
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${pass.status === 'Approved' ? 'badge-emerald' : pass.status === 'Completed' ? 'badge-blue' : 'badge-amber'}`}>
                                        {pass.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
