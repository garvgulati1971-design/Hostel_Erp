import React from "react";
import CollegeLogo from "./CollegeLogo";
import { TODAY_MESS_MENU, INITIAL_NOTICES, INITIAL_HOLIDAYS_2026, INITIAL_ITEM_REQUESTS, HOSTEL_EVENT_GALLERY, INITIAL_SUGGESTIONS } from "../data/mockData";
import "./Dashboard.css";

export default function Dashboard({ student, setPage, outpasses, complaints, announcements, userRole, setRole }) {
    const activeOutpass = outpasses.find((p) => p.status === "Approved");
    const openComplaintsCount = complaints.filter((c) => c.status !== "Resolved").length;

    // Latest items for dashboard widgets
    const nextHoliday = INITIAL_HOLIDAYS_2026.find(h => new Date(h.date) >= new Date("2026-09-21")) || INITIAL_HOLIDAYS_2026[10];
    const latestNotices = INITIAL_NOTICES.slice(0, 2);
    const blockRequests = INITIAL_ITEM_REQUESTS.filter(r => r.status === "Open" || r.status === "Help Offered").slice(0, 2);
    const featuredEvent = HOSTEL_EVENT_GALLERY[0];
    const topSuggestion = INITIAL_SUGGESTIONS[0];

    return (
        <div className="dashboard-view fade-in">
            {/* Live Campus Ticker Tape */}
            <div className="campus-ticker-wrap">
                <div className="ticker-badge">📢 CAMPUS BULLETIN:</div>
                <div className="ticker-content">
                    <span className="ticker-item">★ All hostellers in Blocks I, G, H, C must sync RFID badges by Sept 25</span>
                    <span className="ticker-sep">•</span>
                    <span className="ticker-item">Next Holiday: {nextHoliday.name} ({nextHoliday.date})</span>
                    <span className="ticker-sep">•</span>
                    <span className="ticker-item">Swad Sangam Mess Food Fest this Friday at Central Quad</span>
                    <span className="ticker-sep">•</span>
                    <span className="ticker-item">Aaruush extended hostel curfew: 23:00 hrs with valid digital pass</span>
                </div>
            </div>

            {/* Topbar / Welcome Section with Official University Branding */}
            <div className="dash-header">
                <div className="dash-header-left">
                    <CollegeLogo size="md" showText={false} />
                    <div>
                        <div className="welcome-tag">
                            <span className="inst-sub">SRM INSTITUTE OF SCIENCE &amp; TECHNOLOGY</span>
                            <span className="badge badge-gold">ACADEMIC YEAR 2026–27</span>
                            <span className="badge badge-emerald">RFID: BONAFIDE HOSTELLER</span>
                        </div>
                        <h1>Welcome back, {student.name} 👋</h1>
                        <p className="student-subline">
                            {student.hostelBlock} • Room {student.roomNo} (Bed {student.bedNo}) • {student.course}
                        </p>
                    </div>
                </div>

                <div className="header-actions">
                    <button className="role-switch-btn" onClick={() => setRole(userRole === 'student' ? 'warden' : 'student')}>
                        🔄 Switch to {userRole === 'student' ? 'Warden Portal' : 'Student Portal'}
                    </button>
                    <div className="user-avatar-badge" title="Verified Resident Profile" onClick={() => setPage("profile")}>
                        <span>{student.name.charAt(0)}</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="stats-row">
                <div className="stat-card" onClick={() => setPage("profile")}>
                    <div className="stat-icon">🚪</div>
                    <div>
                        <small>Room &amp; Hostel Wing</small>
                        <h2>{student.hostelBlock.split(" ")[0]} - {student.roomNo}</h2>
                        <p>{student.roomType}</p>
                    </div>
                </div>

                <div className="stat-card" onClick={() => setPage("outpass")}>
                    <div className="stat-icon">🎫</div>
                    <div>
                        <small>Gate Pass Clearance</small>
                        <h2>{activeOutpass ? "Pass Active" : "In Campus"}</h2>
                        <span className={`badge ${activeOutpass ? 'badge-emerald' : 'badge-indigo'}`}>
                            {activeOutpass ? "Digital QR Ready" : "Curfew 09:00 PM"}
                        </span>
                    </div>
                </div>

                <div className="stat-card" onClick={() => setPage("fees")}>
                    <div className="stat-icon">💳</div>
                    <div>
                        <small>Pending Fee Balance</small>
                        <h2>₹{student.pendingFees.toLocaleString('en-IN')}</h2>
                        <span className="badge badge-amber">Due Sept 15</span>
                    </div>
                </div>

                <div className="stat-card" onClick={() => setPage("complaints")}>
                    <div className="stat-icon">🛠️</div>
                    <div>
                        <small>Active Maintenance</small>
                        <h2>{openComplaintsCount} Tickets</h2>
                        <p>{openComplaintsCount > 0 ? "Under SLA Resolution" : "All fixtures operational"}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div>
                        <small>Night Attendance</small>
                        <h2>{student.attendanceRate}%</h2>
                        <span className="badge badge-emerald">Eligible for Outpass</span>
                    </div>
                </div>
            </div>

            {/* Quick Navigation Action Grid */}
            <div className="quick-actions-bar">
                <span className="qa-label">Quick Portal Access:</span>
                <button className="action-btn" onClick={() => setPage("notices")}>
                    📢 Official Circulars
                </button>
                <button className="action-btn" onClick={() => setPage("holidays")}>
                    📅 Holiday Calendar
                </button>
                <button className="action-btn" onClick={() => setPage("gallery")}>
                    📸 Event Gallery
                </button>
                <button className="action-btn" onClick={() => setPage("suggestions")}>
                    💡 Suggestion Box (AI)
                </button>
                <button className="action-btn" onClick={() => setPage("sharehub")}>
                    🤝 Block Item Requests
                </button>
                <button className="action-btn" onClick={() => setPage("outpass")}>
                    🎫 Apply Gate Pass
                </button>
            </div>

            {/* Middle Dashboard Feature Grid */}
            <div className="dash-middle-grid">
                {/* 1. Official Notices Panel */}
                <div className="dash-panel" onClick={() => setPage("notices")} style={{ cursor: "pointer" }}>
                    <div className="panel-header">
                        <div className="ph-left">
                            <h2>📢 Official Notices &amp; Directives</h2>
                            <span className="badge badge-blue">Directorate Feed</span>
                        </div>
                        <span className="panel-link">View All Notices →</span>
                    </div>

                    <div className="announcements-list">
                        {latestNotices.map((notice) => (
                            <div key={notice.id} className="announcement-item">
                                <div className="ann-top">
                                    <strong>{notice.title}</strong>
                                    <span className="badge badge-urgent">{notice.priority}</span>
                                </div>
                                <p>{notice.content}</p>
                                <div className="ann-meta">
                                    <small>Ref: {notice.refNo} • {notice.date}</small>
                                    <small className="target-text">📍 {notice.targetBlocks}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Upcoming Holiday & Mess Highlights Card */}
                <div className="dash-panel" onClick={() => setPage("holidays")} style={{ cursor: 'pointer' }}>
                    <div className="panel-header">
                        <div className="ph-left">
                            <h2>📅 Next Campus Holiday</h2>
                            <span className="badge badge-gold">Countdown Active</span>
                        </div>
                        <span className="panel-link">View 2026 Schedule →</span>
                    </div>

                    <div className="holiday-highlight-card">
                        <div className="hh-top">
                            <span className="hh-emoji">🎉</span>
                            <div>
                                <h3>{nextHoliday.name}</h3>
                                <p>{new Date(nextHoliday.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ({nextHoliday.day})</p>
                            </div>
                        </div>

                        <div className="hh-details-grid">
                            <div className="hh-detail-item">
                                <small>Dining Schedule:</small>
                                <strong>🍽️ {nextHoliday.messStatus}</strong>
                            </div>
                            <div className="hh-detail-item">
                                <small>Hostel Gate Regulation:</small>
                                <strong>🎫 {nextHoliday.outpassRequired}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Block Peer Requests (ShareHub Preview) */}
                <div className="dash-panel" onClick={() => setPage("sharehub")} style={{ cursor: 'pointer' }}>
                    <div className="panel-header">
                        <div className="ph-left">
                            <h2>🤝 Block Item Requests (ShareHub)</h2>
                            <span className="badge badge-emerald">Peer Aid Pool</span>
                        </div>
                        <span className="panel-link">Open ShareHub →</span>
                    </div>

                    <div className="peer-requests-preview">
                        {blockRequests.map((req) => (
                            <div key={req.id} className="peer-req-item">
                                <div className="pr-top">
                                    <strong>📦 {req.itemName}</strong>
                                    <span className={`badge ${req.status === 'Help Offered' ? 'badge-emerald' : 'badge-amber'}`}>
                                        {req.status}
                                    </span>
                                </div>
                                <p>{req.description}</p>
                                <div className="pr-meta">
                                    <small>📍 {req.hostelBlock} • Room {req.studentRoom}</small>
                                    <small className="pr-action-hint">Click to offer help →</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Mess Special & Dining Highlights */}
                <div className="dash-panel" onClick={() => setPage("mess")} style={{ cursor: 'pointer' }}>
                    <div className="panel-header">
                        <div className="ph-left">
                            <h2>🍛 Today's Special Dining</h2>
                            <span className="badge badge-emerald">Mess Open</span>
                        </div>
                        <span className="panel-link">Weekly Menu →</span>
                    </div>

                    <div className="mess-preview-box">
                        <div className="mess-highlight-badge">✨ {TODAY_MESS_MENU.lunch.highlight}</div>
                        <ul className="mini-dish-list">
                            {TODAY_MESS_MENU.lunch.items.slice(0, 4).map((dish, i) => (
                                <li key={i}>• {dish}</li>
                            ))}
                        </ul>
                        <div className="mess-action-link">View Full 4-Meal Menu &amp; Calories →</div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: AI Suggestion Voice + Event Gallery Highlights */}
            <div className="dash-bottom-grid">
                {/* Community Voice Highlight */}
                <div className="community-voice-card" onClick={() => setPage("suggestions")}>
                    <div className="cv-header">
                        <div>
                            <span className="badge badge-indigo">STUDENT VOICE OF THE WEEK</span>
                            <h3>💡 {topSuggestion.title}</h3>
                        </div>
                        <span className="cv-upvotes">👍 {topSuggestion.upvotes} Votes</span>
                    </div>
                    <p className="cv-snippet">"{topSuggestion.content}"</p>
                    <div className="cv-footer">
                        <span>Status: <strong className="text-emerald">{topSuggestion.wardenStatus}</strong></span>
                        <span className="cv-cta">Join Discussion &amp; Give Opinion →</span>
                    </div>
                </div>

                {/* Event Gallery Snapshot */}
                <div className="event-preview-banner" onClick={() => setPage("gallery")}>
                    <img src={featuredEvent.coverImage} alt={featuredEvent.title} className="event-preview-bg" />
                    <div className="event-preview-overlay">
                        <span className="badge badge-gold">HOSTEL CULTURAL ARCHIVE</span>
                        <h3>{featuredEvent.title}</h3>
                        <p>{featuredEvent.venue} • {featuredEvent.date}</p>
                        <div className="event-btn-link">Explore Photo Gallery ({featuredEvent.photoCount} Shots) →</div>
                    </div>
                </div>
            </div>
        </div>
    );
}