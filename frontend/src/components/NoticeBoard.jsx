import React, { useState, useEffect } from "react";
import CollegeLogo from "./CollegeLogo";
import { INITIAL_NOTICES } from "../data/mockData";
import "./NoticeBoard.css";

export default function NoticeBoard({ student }) {
    const [notices, setNotices] = useState(INITIAL_NOTICES);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedBlock, setSelectedBlock] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeNoticeModal, setActiveNoticeModal] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:5000/api/notices");
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                // Map DB schema to component format
                const mapped = data.data.map(n => ({
                    id: n.id,
                    refNo: n.ref_no,
                    title: n.title,
                    category: n.category,
                    priority: n.priority,
                    issuedBy: n.issued_by,
                    targetBlocks: n.target_blocks,
                    content: n.content,
                    date: n.date,
                    attachmentName: n.attachment_name,
                    signatoryTitle: n.issued_by.includes("Warden") ? "Chief Warden & Dean of Hostels" : "Directorate of Student Affairs"
                }));
                setNotices(mapped);
            }
        } catch (err) {
            console.log("Using local notices fallback");
        } finally {
            setLoading(false);
        }
    };

    const categories = ["All", "Chief Warden Circular", "Maintenance Notice", "Mess Notice", "General Circular"];
    const blocks = ["All", "Block I", "Block G", "Block H", "Block C"];

    const filteredNotices = notices.filter(n => {
        const matchesCategory = selectedCategory === "All" || n.category === selectedCategory;
        const matchesBlock = selectedBlock === "All" || n.targetBlocks.includes("All") || n.targetBlocks.includes(selectedBlock);
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              n.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              n.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesBlock && matchesSearch;
    });

    return (
        <div className="notices-page fade-in">
            {/* Header */}
            <div className="notices-header-bar">
                <div>
                    <div className="official-kicker">
                        <span>OFFICIAL INSTITUTIONAL BULLETIN</span>
                        <span className="badge badge-gold">DIRECTORATE OF HOSTELS</span>
                    </div>
                    <h1>📢 University Notice Board &amp; Circulars</h1>
                    <p>Official announcements, maintenance schedules, mess circulars &amp; warden directives</p>
                </div>

                <div className="header-meta-seal">
                    <CollegeLogo size="sm" showText={false} />
                    <div className="seal-text">
                        <small>Authentic Circular Archive</small>
                        <strong>SRMIST Kattankulathur</strong>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="notices-filter-box">
                <div className="search-group">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search circulars by keyword, reference no. (e.g. SRM/CW/CIR)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="notices-search-input"
                    />
                </div>

                <div className="filter-dropdowns">
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map(c => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
                    </select>

                    <select value={selectedBlock} onChange={(e) => setSelectedBlock(e.target.value)}>
                        {blocks.map(b => <option key={b} value={b}>{b === "All" ? "All Target Blocks" : b}</option>)}
                    </select>
                </div>
            </div>

            {/* Notices List */}
            {loading ? (
                <div className="notices-loading">Loading official notices from campus servers...</div>
            ) : filteredNotices.length === 0 ? (
                <div className="empty-notices-card">
                    <div className="empty-icon">📭</div>
                    <h3>No circulars matching your criteria</h3>
                    <p>Try resetting filters or searching with a different keyword.</p>
                </div>
            ) : (
                <div className="notices-grid">
                    {filteredNotices.map((notice) => (
                        <div 
                            key={notice.id} 
                            className={`notice-card ${notice.priority === 'Urgent Alert' ? 'urgent' : ''}`}
                            onClick={() => setActiveNoticeModal(notice)}
                        >
                            <div className="notice-card-top">
                                <span className={`badge ${
                                    notice.priority === 'Urgent Alert' ? 'badge-urgent' :
                                    notice.priority === 'High Priority' ? 'badge-rose' :
                                    notice.category === 'Mess Notice' ? 'badge-emerald' : 'badge-blue'
                                }`}>
                                    {notice.priority}
                                </span>
                                <span className="notice-date">{notice.date}</span>
                            </div>

                            <div className="notice-ref-pill">Ref: {notice.refNo}</div>
                            <h3 className="notice-title">{notice.title}</h3>
                            <p className="notice-snippet">{notice.content}</p>

                            <div className="notice-card-footer">
                                <div className="target-pill">
                                    <span>📍 {notice.targetBlocks}</span>
                                </div>
                                <div className="read-more-btn">
                                    Official Circular Letterhead →
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal: High-Fidelity University Letterhead View */}
            {activeNoticeModal && (
                <div className="circular-modal-backdrop" onClick={() => setActiveNoticeModal(null)}>
                    <div className="circular-letterhead-modal fade-in" onClick={(e) => e.stopPropagation()}>
                        <button className="close-letterhead-btn" onClick={() => setActiveNoticeModal(null)}>✕</button>

                        {/* Official Letterhead Banner */}
                        <div className="letterhead-header">
                            <CollegeLogo size="lg" showText={false} />
                            <div className="letterhead-title-block">
                                <h2>SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</h2>
                                <h4>(Deemed to be University under Section 3 of UGC Act, 1956)</h4>
                                <p className="letterhead-dept">OFFICE OF THE CHIEF WARDEN &amp; DIRECTORATE OF HOSTEL AFFAIRS</p>
                                <small>Kattankulathur, Chengalpattu District, Tamil Nadu - 603203</small>
                            </div>
                        </div>

                        <div className="letterhead-divider"></div>

                        {/* Reference & Date Line */}
                        <div className="letterhead-meta-row">
                            <div>
                                <strong>Ref No:</strong> {activeNoticeModal.refNo}
                            </div>
                            <div>
                                <strong>Date of Issuance:</strong> {activeNoticeModal.date}
                            </div>
                        </div>

                        {/* Target Blocks */}
                        <div className="target-banner">
                            <strong>TARGET AUDIENCE: </strong>
                            <span>{activeNoticeModal.targetBlocks}</span>
                        </div>

                        {/* Circular Subject */}
                        <div className="circular-subject-box">
                            <strong>SUBJECT: </strong>
                            <span>{activeNoticeModal.title.toUpperCase()}</span>
                        </div>

                        {/* Circular Main Body */}
                        <div className="circular-body-content">
                            <p>{activeNoticeModal.content}</p>
                            <p>
                                All hostel residents are advised to note the above instructions carefully and cooperate with the hostel wardens, security staff, and estate managers. Failure to comply with mandatory institutional directives may attract administrative disciplinary action.
                            </p>
                            <p>
                                For any queries or clarifications, students may contact their respective Block Warden Desk or reply through the SRM Hostel ERP Anonymous Suggestion Portal.
                            </p>
                        </div>

                        {/* Signatory Box with Official Stamp */}
                        <div className="letterhead-signatory-section">
                            <div className="official-stamp-seal">
                                <div className="stamp-inner">
                                    <span>SRM HOSTEL</span>
                                    <span>★ VERIFIED ★</span>
                                    <span>OFFICE OF CW</span>
                                </div>
                            </div>

                            <div className="signatory-block">
                                <div className="digital-signature">Dr. K. Sharma</div>
                                <strong>{activeNoticeModal.issuedBy}</strong>
                                <span>{activeNoticeModal.signatoryTitle || "Chief Warden & Dean of Hostels"}</span>
                                <small>SRM Institute of Science &amp; Technology</small>
                            </div>
                        </div>

                        {/* Attachment & Action Footer */}
                        <div className="letterhead-modal-footer">
                            <div className="attachment-info">
                                <span>📎 {activeNoticeModal.attachmentName || "Official_Notice.pdf"}</span>
                                <small>(Digitally signed university document)</small>
                            </div>

                            <div className="modal-actions">
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => alert(`Downloading "${activeNoticeModal.attachmentName || 'Notice.pdf'}" with official digital watermark.`)}
                                >
                                    📥 Download Official PDF
                                </button>
                                <button className="btn btn-primary" onClick={() => setActiveNoticeModal(null)}>
                                    Acknowledge &amp; Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
