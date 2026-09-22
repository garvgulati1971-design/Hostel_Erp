import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import OutpassManager from "./components/OutpassManager";
import ComplaintsPortal from "./components/ComplaintsPortal";
import MessPortal from "./components/MessPortal";
import Fees from "./components/Fees";
import Profile from "./components/Profile";
import AIAssistant from "./components/AIAssistant";
import WardenDashboard from "./components/WardenDashboard";
import ServicePortal from "./components/ServicePortal";
import CollegeLogo from "./components/CollegeLogo";
import NoticeBoard from "./components/NoticeBoard";
import HolidayCalendar from "./components/HolidayCalendar";
import EventGallery from "./components/EventGallery";
import SuggestionBox from "./components/SuggestionBox";
import ItemRequestBox from "./components/ItemRequestBox";
import ThemeSelector from "./components/ThemeSelector";

import {
    INITIAL_STUDENT,
    INITIAL_ANNOUNCEMENTS,
    INITIAL_OUTPASSES,
    INITIAL_COMPLAINTS
} from "./data/mockData";

import "./App.css";

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("student"); // "student" | "warden" | "service"
    const [page, setPage] = useState("dashboard");

    // Theme state (srm, navy, slate, light)
    const [theme, setTheme] = useState(() => localStorage.getItem("hostel_erp_theme") || "srm");

    // Live Campus Clock
    const [currentClock, setCurrentClock] = useState(() => new Date().toLocaleTimeString('en-IN', { hour12: false }) + " IST");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("hostel_erp_theme", theme);
    }, [theme]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentClock(new Date().toLocaleTimeString('en-IN', { hour12: false }) + " IST");
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // State data
    const [student] = useState(INITIAL_STUDENT);
    const [outpasses, setOutpasses] = useState(INITIAL_OUTPASSES);
    const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
    const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);

    const handleLogin = (e) => {
        e.preventDefault();

        if (username === "Warden" && password === "warden123") {
            setUserRole("warden");
            setLoggedIn(true);
            setPage("warden");
        } else if (username === "Service" && password === "tech123") {
            setUserRole("service");
            setLoggedIn(true);
            setPage("service");
        } else if ((username === "Garv" && password === "12345") || username.trim().length > 0) {
            setUserRole("student");
            setLoggedIn(true);
            setPage("dashboard");
        } else {
            alert("Invalid credentials! Try 'Garv' / '12345', 'Warden' / 'warden123' or 'Service' / 'tech123'");
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUsername("");
        setPassword("");
        setPage("dashboard");
    };

    // Quick fill helper
    const fillStudentDemo = () => {
        setUsername("Garv");
        setPassword("12345");
    };

    const fillWardenDemo = () => {
        setUsername("Warden");
        setPassword("warden123");
    };

    const fillServiceDemo = () => {
        setUsername("Service");
        setPassword("tech123");
    };

    // Login View
    if (!loggedIn) {
        return (
            <div className="login-screen-bg">
                <div className="login-top-actions">
                    <ThemeSelector currentTheme={theme} onSelectTheme={setTheme} />
                </div>

                <div className="login-container fade-in">
                    <div className="login-header">
                        <CollegeLogo size="large" showSubtitle={true} subtitle="Directorate of Student Residential Affairs" />
                        <h1>Hostel ERP & Administration Portal</h1>
                        <p>Academic Session 2026–2027 • Official University System</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>University Roll No / Administrative ID</label>
                            <input
                                type="text"
                                placeholder="Enter Garv, Warden or Service"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password / Security Pin</label>
                            <input
                                type="password"
                                placeholder="Enter password (12345 / warden123 / tech123)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary login-btn">
                            Sign In to Residential Portal →
                        </button>
                    </form>

                    <div className="demo-credentials-box">
                        <small>⚡ Instant Demo Role Access:</small>
                        <div className="demo-btns">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={fillStudentDemo}>
                                👤 Resident Student Portal (Garv / Block I)
                            </button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={fillWardenDemo}>
                                👨‍💼 Chief Warden Portal (Dr. K. Sharma)
                            </button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={fillServiceDemo}>
                                🛠️ Maintenance & Service Desk (Service)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="main-sidebar">
                <div className="sidebar-brand">
                    <CollegeLogo size="small" showSubtitle={true} subtitle="Hostel ERP System" />
                    <div style={{ marginTop: '8px' }}>
                        <small className="role-tag">
                            {userRole === 'warden' ? 'CHIEF WARDEN PORTAL' : userRole === 'service' ? 'SERVICE STAFF PORTAL' : 'STUDENT PORTAL'}
                        </small>
                    </div>
                </div>

                {/* Quick Role Switcher Pill */}
                <div className="role-switcher-box">
                    <small>Active Persona:</small>
                    <div className="role-pills">
                        <button
                            className={`role-pill ${userRole === 'student' ? 'active' : ''}`}
                            onClick={() => { setUserRole('student'); setPage('dashboard'); }}
                            title="Switch to Student View"
                        >
                            👤 Student
                        </button>
                        <button
                            className={`role-pill ${userRole === 'warden' ? 'active' : ''}`}
                            onClick={() => { setUserRole('warden'); setPage('warden'); }}
                            title="Switch to Warden View"
                        >
                            👨‍💼 Warden
                        </button>
                        <button
                            className={`role-pill ${userRole === 'service' ? 'active' : ''}`}
                            onClick={() => { setUserRole('service'); setPage('service'); }}
                            title="Switch to Service Staff View"
                        >
                            🛠️ Service
                        </button>
                    </div>
                </div>

                <nav className="nav-menu">
                    {userRole === "student" && (
                        <>
                            <div className="nav-section-title">Core Residence</div>
                            <button className={`nav-item ${page === 'dashboard' ? 'active' : ''}`} onClick={() => setPage("dashboard")}>
                                <span>🏠</span> Dashboard
                            </button>

                            <button className={`nav-item ${page === 'outpass' ? 'active' : ''}`} onClick={() => setPage("outpass")}>
                                <span>🎫</span> Outpass & Gate Pass
                            </button>

                            <button className={`nav-item ${page === 'complaints' ? 'active' : ''}`} onClick={() => setPage("complaints")}>
                                <span>🛠️</span> Maintenance Requests
                                {complaints.filter(c => c.status !== 'Resolved').length > 0 && (
                                    <span className="nav-badge-num">{complaints.filter(c => c.status !== 'Resolved').length}</span>
                                )}
                            </button>

                            <button className={`nav-item ${page === 'mess' ? 'active' : ''}`} onClick={() => setPage("mess")}>
                                <span>🍽️</span> Mess & Dining
                            </button>

                            <button className={`nav-item ${page === 'fees' ? 'active' : ''}`} onClick={() => setPage("fees")}>
                                <span>💳</span> Fees & Receipts
                            </button>

                            <button className={`nav-item ${page === 'profile' ? 'active' : ''}`} onClick={() => setPage("profile")}>
                                <span>👤</span> Resident Profile
                            </button>

                            <div className="nav-section-title">Campus & Community</div>
                            <button className={`nav-item ${page === 'notices' ? 'active' : ''}`} onClick={() => setPage("notices")}>
                                <span>📢</span> Official Notices
                            </button>

                            <button className={`nav-item ${page === 'holidays' ? 'active' : ''}`} onClick={() => setPage("holidays")}>
                                <span>📅</span> Holiday Calendar
                            </button>

                            <button className={`nav-item ${page === 'gallery' ? 'active' : ''}`} onClick={() => setPage("gallery")}>
                                <span>📸</span> Event Gallery
                            </button>

                            <button className={`nav-item ${page === 'suggestions' ? 'active' : ''}`} onClick={() => setPage("suggestions")}>
                                <span>💡</span> Anonymous Suggestions
                            </button>

                            <button className={`nav-item ${page === 'sharehub' ? 'active' : ''}`} onClick={() => setPage("sharehub")}>
                                <span>🤝</span> Peer ShareHub
                            </button>

                            <div className="nav-section-title">AI & Intelligence</div>
                            <button className={`nav-item ai-nav ${page === 'ai' ? 'active' : ''}`} onClick={() => setPage("ai")}>
                                <span>🤖</span> AI Assistant
                                <span className="badge badge-emerald nav-ai-tag">Online</span>
                            </button>
                        </>
                    )}

                    {userRole === "warden" && (
                        <>
                            <div className="nav-section-title">Administration</div>
                            <button className={`nav-item warden-nav ${page === 'warden' ? 'active' : ''}`} onClick={() => setPage("warden")}>
                                <span>👨‍💼</span> Warden Control & DB
                            </button>
                            <button className={`nav-item ${page === 'notices' ? 'active' : ''}`} onClick={() => setPage("notices")}>
                                <span>📢</span> Official Circulars
                            </button>
                            <button className={`nav-item ${page === 'suggestions' ? 'active' : ''}`} onClick={() => setPage("suggestions")}>
                                <span>💡</span> Student Suggestions & AI
                            </button>
                            <button className={`nav-item ${page === 'complaints' ? 'active' : ''}`} onClick={() => setPage("complaints")}>
                                <span>🛠️</span> Maintenance Overview
                            </button>
                            <button className={`nav-item ${page === 'sharehub' ? 'active' : ''}`} onClick={() => setPage("sharehub")}>
                                <span>🤝</span> Block Item Requests
                            </button>
                            <button className={`nav-item ${page === 'holidays' ? 'active' : ''}`} onClick={() => setPage("holidays")}>
                                <span>📅</span> Holiday Calendar
                            </button>
                            <button className={`nav-item ${page === 'gallery' ? 'active' : ''}`} onClick={() => setPage("gallery")}>
                                <span>📸</span> Hostel Gallery
                            </button>
                            <div className="nav-section-title">AI & Diagnostics</div>
                            <button className={`nav-item ai-nav ${page === 'ai' ? 'active' : ''}`} onClick={() => setPage("ai")}>
                                <span>🤖</span> AI Assistant
                            </button>
                        </>
                    )}

                    {userRole === "service" && (
                        <>
                            <div className="nav-section-title">Field Operations</div>
                            <button className={`nav-item service-nav ${page === 'service' ? 'active' : ''}`} onClick={() => setPage("service")}>
                                <span>🛠️</span> Service Requests & SMS
                            </button>
                            <button className={`nav-item ${page === 'notices' ? 'active' : ''}`} onClick={() => setPage("notices")}>
                                <span>📢</span> Campus Notices
                            </button>
                            <button className={`nav-item ${page === 'holidays' ? 'active' : ''}`} onClick={() => setPage("holidays")}>
                                <span>📅</span> Holiday Calendar
                            </button>
                            <button className={`nav-item ai-nav ${page === 'ai' ? 'active' : ''}`} onClick={() => setPage("ai")}>
                                <span>🤖</span> AI Assistant
                            </button>
                        </>
                    )}
                </nav>

                <div className="sidebar-user-footer">
                    <div className="user-mini-info">
                        <div className="mini-avatar">
                            {userRole === 'warden' ? 'W' : userRole === 'service' ? 'S' : student.name.charAt(0)}
                        </div>
                        <div>
                            <strong>
                                {userRole === 'warden' ? 'Dr. K. Sharma' : userRole === 'service' ? 'Service Tech Desk' : student.name}
                            </strong>
                            <small>
                                {userRole === 'warden' ? 'Chief Warden' : userRole === 'service' ? 'Maintenance Lead' : `Room ${student.roomNo} (${student.hostelBlock})`}
                            </small>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Sign Out">
                        🚪
                    </button>
                </div>
            </aside>

            {/* Main View Area with Institutional Header */}
            <main className="main-view-area">
                <header className="campus-top-bar">
                    <div className="top-bar-left">
                        <span className="top-bar-dept">
                            <strong>SRM INSTITUTE OF SCIENCE & TECHNOLOGY</strong> &bull; Directorate of Student Affairs &bull; AY 2026-27
                        </span>
                        <span className="top-bar-helpline">📞 Security Hotline: Ext. 8021</span>
                    </div>
                    <div className="top-bar-right">
                        <ThemeSelector currentTheme={theme} onSelectTheme={setTheme} />
                        <span className="campus-clock-pill">🕒 {currentClock}</span>
                        <span className="campus-status-pill">
                            <span className="campus-status-dot"></span>
                            Live Campus
                        </span>
                        <span className="campus-curfew-tag">⏰ Curfew: 21:30 IST</span>
                    </div>
                </header>

                <div className="page-content-wrapper">
                    {page === "dashboard" && (
                        <Dashboard
                            student={student}
                            setPage={setPage}
                            outpasses={outpasses}
                            complaints={complaints}
                            announcements={announcements}
                            userRole={userRole}
                            setRole={setUserRole}
                        />
                    )}

                    {page === "outpass" && (
                        <OutpassManager
                            outpasses={outpasses}
                            setOutpasses={setOutpasses}
                            student={student}
                            setPage={setPage}
                            userRole={userRole}
                        />
                    )}

                    {page === "complaints" && (
                        <ComplaintsPortal
                            complaints={complaints}
                            setComplaints={setComplaints}
                            student={student}
                        />
                    )}

                    {page === "mess" && <MessPortal />}

                    {page === "fees" && <Fees student={student} setPage={setPage} />}

                    {page === "profile" && <Profile student={student} setPage={setPage} />}

                    {page === "ai" && <AIAssistant student={student} />}

                    {page === "warden" && (
                        <WardenDashboard
                            student={student}
                            complaints={complaints}
                            announcements={announcements}
                            setAnnouncements={setAnnouncements}
                        />
                    )}

                    {page === "service" && (
                        <ServicePortal
                            complaints={complaints}
                            setComplaints={setComplaints}
                        />
                    )}

                    {page === "notices" && (
                        <NoticeBoard
                            userRole={userRole}
                            student={student}
                        />
                    )}

                    {page === "holidays" && (
                        <HolidayCalendar
                            setPage={setPage}
                        />
                    )}

                    {page === "gallery" && (
                        <EventGallery
                            student={student}
                        />
                    )}

                    {page === "suggestions" && (
                        <SuggestionBox
                            student={student}
                            userRole={userRole}
                        />
                    )}

                    {page === "sharehub" && (
                        <ItemRequestBox
                            student={student}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
