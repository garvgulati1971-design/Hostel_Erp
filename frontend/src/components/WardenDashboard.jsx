import React, { useState, useEffect } from "react";
import { WARDEN_STATS, INITIAL_PENDING_WARDEN_OUTPASSES, INITIAL_BLOCKS } from "../data/mockData";
import "./WardenDashboard.css";

export default function WardenDashboard({ student, complaints, announcements, setAnnouncements }) {
    const [blocksList, setBlocksList] = useState(INITIAL_BLOCKS);
    const [pendingOutpasses, setPendingOutpasses] = useState(INITIAL_PENDING_WARDEN_OUTPASSES);
    const [broadcastText, setBroadcastText] = useState("");
    const [broadcastCategory, setBroadcastCategory] = useState("Urgent Alert");

    // Student Database & Pagination state
    const [studentsList, setStudentsList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [blockFilter, setBlockFilter] = useState("All");
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);

    // Warnings System state
    const [warningsList, setWarningsList] = useState([]);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [targetStudent, setTargetStudent] = useState(null);
    const [warningType, setWarningType] = useState("Curfew Violation");
    const [warningSeverity, setWarningSeverity] = useState("Minor Warning");
    const [warningDesc, setWarningDesc] = useState("");
    const [warningAction, setWarningAction] = useState("Parent notified via simulated SMS.");

    // Fetch students list with pagination
    useEffect(() => {
        fetchStudents();
        fetchWarnings();
        fetchBlocks();
    }, [page, searchQuery, blockFilter]);

    const fetchBlocks = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/blocks");
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                const mapped = data.data.map(b => ({
                    id: b.id,
                    name: b.name,
                    code: b.code,
                    type: b.type,
                    totalFloors: b.total_floors,
                    capacity: b.capacity,
                    occupied: b.occupied,
                    wardenName: b.warden_name,
                    wardenPhone: b.warden_phone,
                    wardenEmail: b.warden_email,
                    wardenOffice: b.warden_office,
                    serviceTechName: b.service_tech_name,
                    serviceTechRole: b.service_tech_role,
                    serviceTechPhone: b.service_tech_phone
                }));
                setBlocksList(mapped);
            }
        } catch (e) {}
    };

    const fetchStudents = async () => {
        setIsLoadingStudents(true);
        try {
            const b = blockFilter === "All" ? "" : blockFilter;
            const res = await fetch(`http://localhost:5000/api/students?page=${page}&limit=8&search=${searchQuery}&block=${b}`);
            const data = await res.json();
            if (data.success) {
                setStudentsList(data.data);
                setTotalPages(data.totalPages);
            }
        } catch (err) {
            console.log("Using fallback mock database");
            const mock = [
                { id: "SRM20260402", name: "Garv", roll_no: "RA2311003010452", room_no: "402", hostel_block: "C-Block", attendance_rate: 94.2, pending_fees: 30000 },
                { id: "SRM2026401", name: "Aarav Patel", roll_no: "RA2311003010401", room_no: "101", hostel_block: "A-Block", attendance_rate: 74.0, pending_fees: 30000 },
                { id: "SRM2026402", name: "Priya Sundaram", roll_no: "RA2311003010402", room_no: "212", hostel_block: "C-Block", attendance_rate: 98.0, pending_fees: 0 },
                { id: "SRM2026403", name: "Rohan Verma", roll_no: "RA2311003010403", room_no: "304", hostel_block: "B-Block", attendance_rate: 81.5, pending_fees: 0 }
            ];
            setStudentsList(mock);
            setTotalPages(1);
        } finally {
            setIsLoadingStudents(false);
        }
    };

    const fetchWarnings = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/warnings");
            const data = await res.json();
            if (data.success) setWarningsList(data.data);
        } catch (err) {
            setWarningsList([
                { id: "WRN-2026-101", student_name: "Aarav Patel", roll_no: "RA2311003010401", warning_type: "Curfew Violation", severity: "Official Reprimand", description: "Late entry at 11:45 PM", issued_at: "2026-09-01" },
                { id: "WRN-2026-102", student_name: "Karan Nair", roll_no: "RA2311003010407", warning_type: "Noise Disturbance", severity: "Minor Warning", description: "Loud music past 10:30 PM", issued_at: "2026-09-02" }
            ]);
        }
    };

    const handleApprovePass = (passId) => {
        setPendingOutpasses(pendingOutpasses.filter(p => p.id !== passId));
        alert(`Outpass ${passId} officially APPROVED by Warden.`);
    };

    const handleRejectPass = (passId) => {
        setPendingOutpasses(pendingOutpasses.filter(p => p.id !== passId));
        alert(`Outpass ${passId} REJECTED by Warden.`);
    };

    const handleBroadcast = (e) => {
        e.preventDefault();
        if (!broadcastText.trim()) return;

        const newAnnouncement = {
            id: Date.now(),
            title: broadcastText,
            date: "Today",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            category: broadcastCategory,
            priority: "High",
            content: `Official broadcast issued by ${student.warden?.name || 'Chief Warden'} for Block C residents.`
        };

        setAnnouncements([newAnnouncement, ...announcements]);
        setBroadcastText("");
        alert("Broadcast sent successfully to all student dashboards!");
    };

    const openIssueWarningModal = (std) => {
        setTargetStudent(std);
        setShowWarningModal(true);
    };

    const handleIssueWarning = async (e) => {
        e.preventDefault();
        if (!targetStudent || !warningDesc.trim()) return;

        const payload = {
            studentId: targetStudent.id,
            studentName: targetStudent.name,
            rollNo: targetStudent.roll_no,
            warningType,
            severity: warningSeverity,
            description: warningDesc,
            issuedBy: "Dr. K. Sharma (Chief Warden)",
            actionTaken: warningAction
        };

        try {
            await fetch("http://localhost:5000/api/warnings/issue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } catch (e) {}

        const newWrn = {
            id: `WRN-2026-${Math.floor(100 + Math.random() * 900)}`,
            student_name: targetStudent.name,
            roll_no: targetStudent.roll_no,
            warning_type: warningType,
            severity: warningSeverity,
            description: warningDesc,
            issued_at: new Date().toISOString().split('T')[0]
        };

        setWarningsList([newWrn, ...warningsList]);
        setShowWarningModal(false);
        setWarningDesc("");
        alert(`Disciplinary Warning successfully issued to ${targetStudent.name}! Simulated SMS sent to parent.`);
    };

    return (
        <div className="warden-page fade-in">
            <div className="page-header">
                <div>
                    <h1>👨‍💼 Warden & Administration Portal</h1>
                    <p>Hostel Block Occupancy, Disciplinary Control, Student Database & AI Approvals</p>
                </div>
                <span className="badge badge-emerald">CHIEF WARDEN SESSION ACTIVE</span>
            </div>

            {/* Top Stat Cards */}
            <div className="warden-stats-grid">
                <div className="w-card">
                    <span className="w-icon">🏢</span>
                    <div>
                        <small>Total Occupancy</small>
                        <h2>{WARDEN_STATS.occupiedBeds} / {WARDEN_STATS.totalCapacity}</h2>
                        <p className="sub">Beds Assigned (Campus)</p>
                    </div>
                </div>

                <div className="w-card">
                    <span className="w-icon">📍</span>
                    <div>
                        <small>Present in Hostel</small>
                        <h2>{WARDEN_STATS.presentInHostel}</h2>
                        <p className="sub text-emerald">Verified In Campus</p>
                    </div>
                </div>

                <div className="w-card">
                    <span className="w-icon">🎫</span>
                    <div>
                        <small>Active Outpasses</small>
                        <h2>{WARDEN_STATS.onApprovedOutpass}</h2>
                        <p className="sub">On Leave / Day Pass</p>
                    </div>
                </div>

                <div className="w-card danger">
                    <span className="w-icon">⚠️</span>
                    <div>
                        <small>Curfew Flagged</small>
                        <h2>{WARDEN_STATS.unaccountedCurfew}</h2>
                        <p className="sub text-rose">Unaccounted Late Entry</p>
                    </div>
                </div>
            </div>

            {/* 1. LARGE DATABASE STUDENT DIRECTORY VIEW */}
            <div className="w-panel student-db-panel">
                <div className="panel-header-bar">
                    <div>
                        <h2>📊 Scalable Student Database Directory</h2>
                        <p className="panel-sub">Querying indexed database records for attendance, fee dues & disciplinary logs.</p>
                    </div>

                    <div className="db-controls">
                        <input
                            type="text"
                            placeholder="Search by Name / Roll No / Room..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="db-search-input"
                        />
                        <select value={blockFilter} onChange={(e) => { setBlockFilter(e.target.value); setPage(1); }}>
                            <option value="All">All Hostel Blocks</option>
                            <option value="I-Block">I-Block (International & Senior)</option>
                            <option value="G-Block">G-Block (Engineering Deluxe)</option>
                            <option value="H-Block">H-Block (Postgraduate & Research)</option>
                            <option value="C-Block">C-Block (Boys Executive)</option>
                            <option value="A-Block">A-Block (Boys Standard)</option>
                            <option value="B-Block">B-Block (Boys Deluxe)</option>
                        </select>
                    </div>
                </div>

                {isLoadingStudents ? (
                    <div className="loading-box">Loading Database Records...</div>
                ) : (
                    <div className="table-responsive">
                        <table className="warden-table">
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Student Name</th>
                                    <th>Hostel Block</th>
                                    <th>Room</th>
                                    <th>Attendance %</th>
                                    <th>Fee Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentsList.map(s => (
                                    <tr key={s.id}>
                                        <td><strong>{s.roll_no}</strong></td>
                                        <td>{s.name}</td>
                                        <td>{s.hostel_block}</td>
                                        <td>Room {s.room_no}</td>
                                        <td>
                                            <span className={`badge ${s.attendance_rate < 75 ? 'badge-rose' : 'badge-emerald'}`}>
                                                {s.attendance_rate}%
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${s.pending_fees > 0 ? 'badge-amber' : 'badge-emerald'}`}>
                                                {s.pending_fees > 0 ? `₹${s.pending_fees} Due` : 'Paid'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => openIssueWarningModal(s)}>
                                                ⚠️ Issue Warning
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="pagination-bar">
                    <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                        ← Previous Page
                    </button>
                    <span>Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
                    <button className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                        Next Page →
                    </button>
                </div>
            </div>

            <div className="warden-main-grid">
                {/* Outpass Pending Approvals with AI Risk */}
                <div className="w-panel">
                    <h2>🎫 Outpass Approvals Queue ({pendingOutpasses.length})</h2>
                    <p className="panel-sub">Requests evaluated by AI Security Assessor awaiting warden decision.</p>

                    {pendingOutpasses.length === 0 ? (
                        <div className="empty-box">No pending outpasses in approval queue!</div>
                    ) : (
                        <div className="outpasses-list">
                            {pendingOutpasses.map((pass) => (
                                <div key={pass.id} className="approval-card">
                                    <div className="app-header">
                                        <div>
                                            <h3>{pass.studentName}</h3>
                                            <p className="app-meta">Roll: {pass.rollNo} | Room: {pass.roomNo}</p>
                                        </div>
                                        <span className={`badge ${pass.aiRiskScore > 50 ? 'badge-rose' : 'badge-emerald'}`}>
                                            AI Risk: {pass.aiRiskScore}/100 ({pass.aiRiskLevel})
                                        </span>
                                    </div>

                                    <div className="app-details">
                                        <p><strong>Destination:</strong> {pass.destination}</p>
                                        <p><strong>Reason:</strong> {pass.reason}</p>
                                        <p><strong>Timing:</strong> {new Date(pass.outDate).toLocaleString()} → {new Date(pass.expectedInDate).toLocaleString()}</p>
                                    </div>

                                    <div className="ai-flag-box">
                                        🤖 <span>AI Assessment Note: {pass.aiRiskReason}</span>
                                    </div>

                                    <div className="app-actions">
                                        <button className="btn btn-danger" onClick={() => handleRejectPass(pass.id)}>
                                            ✕ Reject Pass
                                        </button>
                                        <button className="btn btn-emerald" onClick={() => handleApprovePass(pass.id)}>
                                            ✓ Approve Outpass
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Broadcast & Disciplinary Warnings Sidebar */}
                <div className="w-side-column">
                    {/* Disciplinary Warnings Issued Log */}
                    <div className="w-panel">
                        <h2>⚠️ Disciplinary Warnings Log ({warningsList.length})</h2>
                        <ul className="critical-tickets-list">
                            {warningsList.map(w => (
                                <li key={w.id}>
                                    <div>
                                        <strong>{w.student_name} ({w.roll_no})</strong>
                                        <p>Type: {w.warning_type} • {w.description}</p>
                                    </div>
                                    <span className="badge badge-rose">{w.severity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Emergency Broadcast Card */}
                    <div className="w-panel">
                        <h2>📢 Dispatch Hostel Broadcast</h2>
                        <p className="panel-sub">Publish instant notices to student dashboards.</p>

                        <form onSubmit={handleBroadcast} className="broadcast-form">
                            <div className="form-group">
                                <label>Notice Category</label>
                                <select value={broadcastCategory} onChange={(e) => setBroadcastCategory(e.target.value)}>
                                    <option value="Urgent Alert">Urgent Utility Alert</option>
                                    <option value="Curfew Notice">Curfew Reminder</option>
                                    <option value="Event Notice">Campus Event</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Announcement Message</label>
                                <textarea
                                    rows="3"
                                    placeholder="Enter broadcast message..."
                                    value={broadcastText}
                                    onChange={(e) => setBroadcastText(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary">
                                📢 Broadcast Notice
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* 4. HOSTEL BLOCKS & DUTY PERSONNEL DIRECTORY */}
            <div className="w-panel blocks-directory-panel">
                <div className="panel-header-bar">
                    <div>
                        <h2>🏢 Campus Hostel Blocks &amp; Assigned Duty Personnel</h2>
                        <p className="panel-sub">Official directory of assigned Block Wardens and dedicated emergency service technicians (Blocks I, G, H, C, A, B).</p>
                    </div>
                    <span className="badge badge-gold">6 HOSTEL WINGS REGISTERED</span>
                </div>

                <div className="blocks-directory-grid">
                    {blocksList.map(block => (
                        <div key={block.id} className="block-info-card">
                            <div className="block-card-header">
                                <div>
                                    <span className="block-code-badge">{block.code}</span>
                                    <h3>{block.name}</h3>
                                </div>
                                <span className="badge badge-blue">{block.type.split(" ")[0]}</span>
                            </div>

                            <div className="occupancy-bar-wrap">
                                <div className="occ-labels">
                                    <small>Occupancy: {block.occupied} / {block.capacity}</small>
                                    <small>{Math.round((block.occupied / block.capacity) * 100)}%</small>
                                </div>
                                <div className="occ-progress-track">
                                    <div 
                                        className="occ-progress-fill" 
                                        style={{ width: `${Math.round((block.occupied / block.capacity) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="staff-roster-box">
                                <div className="roster-item">
                                    <span className="roster-role">👨‍💼 Primary Block Warden:</span>
                                    <strong>{block.wardenName}</strong>
                                    <small>📞 {block.wardenPhone} • {block.wardenOffice}</small>
                                </div>

                                <div className="roster-item">
                                    <span className="roster-role">🛠️ Dedicated Service Lead:</span>
                                    <strong>{block.serviceTechName} ({block.serviceTechRole})</strong>
                                    <small>📞 {block.serviceTechPhone}</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Issue Warning Modal */}
            {showWarningModal && targetStudent && (
                <div className="modal-overlay" onClick={() => setShowWarningModal(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h2>⚠️ Issue Disciplinary Warning Notice</h2>
                        <p className="sub">Issuing formal warning for <strong>{targetStudent.name}</strong> ({targetStudent.roll_no})</p>

                        <form onSubmit={handleIssueWarning} className="warning-form">
                            <div className="form-group">
                                <label>Violation Type</label>
                                <select value={warningType} onChange={(e) => setWarningType(e.target.value)}>
                                    <option value="Curfew Violation">Late Entry / Curfew Violation</option>
                                    <option value="Noise Disturbance">Noise Disturbance / Loud Speakers</option>
                                    <option value="Mess Misconduct">Mess Misconduct / Food Wastage</option>
                                    <option value="Unauthorized Guest">Unauthorized Guest in Room</option>
                                    <option value="Property Damage">Hostel Property Damage</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Severity Level</label>
                                <select value={warningSeverity} onChange={(e) => setWarningSeverity(e.target.value)}>
                                    <option value="Minor Warning">Minor Advisory Notice</option>
                                    <option value="Official Reprimand">Official Reprimand (SMS to Parent)</option>
                                    <option value="Final Notice">Final Disciplinary Notice</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Incident Description & Remarks</label>
                                <textarea
                                    rows="3"
                                    placeholder="Detail the incident date, time and specific violation..."
                                    value={warningDesc}
                                    onChange={(e) => setWarningDesc(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowWarningModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-danger">
                                    🚨 Issue Formal Warning (+SMS Notification)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
