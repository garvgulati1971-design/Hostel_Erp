import React, { useState, useEffect } from "react";
import CollegeLogo from "./CollegeLogo";
import { INITIAL_HOLIDAYS_2026 } from "../data/mockData";
import "./HolidayCalendar.css";

export default function HolidayCalendar() {
    const [holidays, setHolidays] = useState(INITIAL_HOLIDAYS_2026);
    const [filterType, setFilterType] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHolidays();
    }, []);

    const fetchHolidays = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:5000/api/holidays");
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                setHolidays(data.data);
            }
        } catch (e) {
            console.log("Using local holidays dataset fallback");
        } finally {
            setLoading(false);
        }
    };

    // Calculate dynamic countdown relative to Sept 2026 current mock date
    const getCountdownLabel = (dateStr) => {
        const today = new Date("2026-09-21");
        const holidayDate = new Date(dateStr);
        const diffDays = Math.ceil((holidayDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { label: "Concluded", status: "past" };
        } else if (diffDays === 0) {
            return { label: "Today!", status: "today" };
        } else if (diffDays <= 7) {
            return { label: `In ${diffDays} days`, status: "soon" };
        } else if (diffDays <= 30) {
            return { label: `In ${Math.ceil(diffDays / 7)} weeks`, status: "upcoming" };
        } else {
            return { label: `In ${Math.ceil(diffDays / 30)} months`, status: "future" };
        }
    };

    const types = ["All", "Upcoming Only", "National Holiday", "Major National Festival", "Gazetted Holiday", "State & Cultural Festival"];

    const filteredHolidays = holidays.filter(h => {
        const countdown = getCountdownLabel(h.date);
        if (filterType === "Upcoming Only" && countdown.status === "past") return false;
        if (filterType !== "All" && filterType !== "Upcoming Only" && !h.type.toLowerCase().includes(filterType.toLowerCase())) return false;
        if (searchQuery && !h.name.toLowerCase().includes(searchQuery.toLowerCase()) && !h.type.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="holidays-page fade-in">
            {/* Top Header */}
            <div className="holidays-header">
                <div>
                    <div className="academic-term-badge">
                        <span>ACADEMIC YEAR 2026 - 2027</span>
                        <span className="badge badge-gold">OFFICIAL HOSTEL CALENDAR</span>
                    </div>
                    <h1>📅 Academic &amp; Hostel Holiday Calendar</h1>
                    <p>Official list of gazetted public holidays, semester breaks &amp; hostel mess feast schedules</p>
                </div>

                <div className="holidays-header-actions">
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                        🖨️ Print / Save PDF
                    </button>
                    <button className="btn btn-emerald" onClick={() => alert("Synced 2026 Hostel Holidays to your Google / Apple Calendar!")}>
                        📥 Add to Calendar (.ics)
                    </button>
                </div>
            </div>

            {/* Quick Status Stats Row */}
            <div className="holiday-stats-row">
                <div className="holiday-stat-card">
                    <span className="stat-emoji">🏖️</span>
                    <div>
                        <small>Total Listed Holidays</small>
                        <h3>{holidays.length} Days</h3>
                    </div>
                </div>

                <div className="holiday-stat-card highlight">
                    <span className="stat-emoji">⏳</span>
                    <div>
                        <small>Next Major Holiday</small>
                        <h3>Gandhi Jayanti (Oct 2)</h3>
                        <span className="badge badge-emerald">In 11 Days</span>
                    </div>
                </div>

                <div className="holiday-stat-card">
                    <span className="stat-emoji">🍲</span>
                    <div>
                        <small>Festive Mess Feasts</small>
                        <h3>12 Special Meals</h3>
                    </div>
                </div>

                <div className="holiday-stat-card">
                    <span className="stat-emoji">🎫</span>
                    <div>
                        <small>Home Outpass Allowed</small>
                        <h3>All Festive Breaks</h3>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="holiday-controls-bar">
                <div className="search-box">
                    <span>🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search holidays, festivals, or types..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-chips">
                    {types.map(t => (
                        <button 
                            key={t}
                            className={`chip-btn ${filterType === t ? 'active' : ''}`}
                            onClick={() => setFilterType(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Holidays Table / Card View */}
            <div className="holidays-table-container">
                <table className="holidays-table">
                    <thead>
                        <tr>
                            <th>Date &amp; Day</th>
                            <th>Holiday / Festival Name</th>
                            <th>Classification</th>
                            <th>Mess &amp; Dining Status</th>
                            <th>Hostel Outpass Guideline</th>
                            <th>Countdown</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHolidays.map((item) => {
                            const countdown = getCountdownLabel(item.date);
                            return (
                                <tr key={item.id} className={countdown.status === 'past' ? 'past-row' : countdown.status === 'soon' ? 'highlight-row' : ''}>
                                    <td className="date-cell">
                                        <div className="date-block">
                                            <span className="date-main">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <span className="day-name">{item.day}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="holiday-title-cell">
                                            <strong>{item.name}</strong>
                                            {countdown.status === 'soon' && <span className="pulse-dot" title="Upcoming this month"></span>}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${
                                            item.type.includes('National') ? 'badge-rose' :
                                            item.type.includes('Major') ? 'badge-gold' :
                                            item.type.includes('Gazetted') ? 'badge-blue' : 'badge-indigo'
                                        }`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="mess-status-cell">
                                            <span>🍽️ {item.messStatus}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="outpass-status-cell">
                                            <span>🎫 {item.outpassRequired}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`countdown-badge ${countdown.status}`}>
                                            {countdown.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Institutional Note */}
            <div className="holiday-disclaimer-box">
                <div className="disclaimer-icon">ℹ️</div>
                <div>
                    <strong>SRM Directorate of Student Affairs Regulation:</strong>
                    <p>
                        Gazetted and festive holidays are observed across all SRM campuses. During festival vacations (Pongal, Diwali), students travelling home must generate a verified <strong>Weekend / Vacation Outpass</strong> on the portal at least 24 hours prior to gate exit. Regular mess operations continue for students staying in the hostel.
                    </p>
                </div>
            </div>
        </div>
    );
}
