import React, { useState } from "react";
import { HOSTEL_EVENT_GALLERY } from "../data/mockData";
import "./EventGallery.css";

export default function EventGallery({ student }) {
    const [events, setEvents] = useState(HOSTEL_EVENT_GALLERY);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [activeLightbox, setActiveLightbox] = useState(null); // { event, photoIndex }
    const [showUploadModal, setShowUploadModal] = useState(false);

    // Upload memory form state
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadBlock, setUploadBlock] = useState(student.hostelBlock || "C-Block");
    const [uploadCategory, setUploadCategory] = useState("Cultural Fest");
    const [uploadDesc, setUploadDesc] = useState("");

    const categories = ["All", "Cultural Fest", "Sports Tournament", "Mess & Dining", "Tech & Innovation", "Festival & Celebrations", "Hostel Community"];

    const filteredEvents = selectedCategory === "All"
        ? events
        : events.filter(e => e.category === selectedCategory);

    const handleUploadSubmit = (e) => {
        e.preventDefault();
        if (!uploadTitle.trim()) return;

        const newEvent = {
            id: `EVT-${Date.now()}`,
            title: uploadTitle,
            category: uploadCategory,
            date: "Recent Submission",
            venue: `${uploadBlock} Common Grounds`,
            attendees: "Student Memory",
            photoCount: 1,
            coverImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
            description: uploadDesc || "Hostel life memory submitted by resident student.",
            highlights: [`Contributed by ${student.name} (${uploadBlock})`],
            gallery: ["https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80"]
        };

        setEvents([newEvent, ...events]);
        setShowUploadModal(false);
        setUploadTitle("");
        setUploadDesc("");
        alert("Thank you! Your hostel event memory has been submitted to the gallery moderation queue.");
    };

    return (
        <div className="gallery-page fade-in">
            {/* Header */}
            <div className="gallery-header">
                <div>
                    <div className="gallery-tag">
                        <span>CAMPUS CHRONICLES &amp; MEMORIES</span>
                        <span className="badge badge-gold">ANNUAL ARCHIVES</span>
                    </div>
                    <h1>📸 Hostel Event &amp; Cultural Gallery</h1>
                    <p>Relive Milan Cultural Fest, Hostel Premier League, Mess Food Carnivals &amp; Campus Celebrations</p>
                </div>

                <button className="btn btn-emerald" onClick={() => setShowUploadModal(true)}>
                    ➕ Share Hostel Photo / Memory
                </button>
            </div>

            {/* Category Filter Pills */}
            <div className="gallery-filter-chips">
                {categories.map(c => (
                    <button 
                        key={c}
                        className={`filter-chip ${selectedCategory === c ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(c)}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Event Cards Grid */}
            <div className="gallery-grid">
                {filteredEvents.map((evt) => (
                    <div key={evt.id} className="event-album-card" onClick={() => setActiveLightbox({ event: evt, photoIndex: 0 })}>
                        <div className="album-media-wrapper">
                            <img src={evt.coverImage} alt={evt.title} className="album-cover-img" loading="lazy" />
                            <div className="album-overlay">
                                <span className="view-album-cta">🔍 View High-Res Album ({evt.photoCount || evt.gallery.length} Photos)</span>
                            </div>
                            <span className="album-category-badge">{evt.category}</span>
                            <span className="album-photos-count">📷 {evt.photoCount || evt.gallery.length} Shots</span>
                        </div>

                        <div className="album-content">
                            <div className="album-meta-row">
                                <span className="album-date">📅 {evt.date}</span>
                                <span className="album-venue">📍 {evt.venue}</span>
                            </div>

                            <h3 className="album-title">{evt.title}</h3>
                            <p className="album-desc">{evt.description}</p>

                            {evt.highlights && (
                                <div className="album-highlights">
                                    <small>✨ Highlights:</small>
                                    <ul>
                                        {evt.highlights.map((h, i) => (
                                            <li key={i}>{h}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="album-footer">
                                <span className="attendees-tag">👥 {evt.attendees}</span>
                                <span className="open-link">Open Lightbox →</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fullscreen Lightbox Modal */}
            {activeLightbox && (
                <div className="lightbox-backdrop" onClick={() => setActiveLightbox(null)}>
                    <div className="lightbox-container fade-in" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-close-btn" onClick={() => setActiveLightbox(null)}>✕</button>

                        <div className="lightbox-main-view">
                            <img 
                                src={activeLightbox.event.gallery[activeLightbox.photoIndex] || activeLightbox.event.coverImage} 
                                alt={activeLightbox.event.title} 
                                className="lightbox-active-img"
                            />

                            {/* Carousel Navigation */}
                            {activeLightbox.event.gallery.length > 1 && (
                                <>
                                    <button 
                                        className="lightbox-nav-btn prev"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveLightbox(prev => ({
                                                ...prev,
                                                photoIndex: (prev.photoIndex - 1 + prev.event.gallery.length) % prev.event.gallery.length
                                            }));
                                        }}
                                    >
                                        ‹
                                    </button>
                                    <button 
                                        className="lightbox-nav-btn next"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveLightbox(prev => ({
                                                ...prev,
                                                photoIndex: (prev.photoIndex + 1) % prev.event.gallery.length
                                            }));
                                        }}
                                    >
                                        ›
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Lightbox Caption & Thumbnails */}
                        <div className="lightbox-caption-bar">
                            <div>
                                <h3>{activeLightbox.event.title}</h3>
                                <p>{activeLightbox.event.venue} • {activeLightbox.event.date}</p>
                            </div>

                            {activeLightbox.event.gallery.length > 1 && (
                                <div className="lightbox-thumbs">
                                    {activeLightbox.event.gallery.map((thumb, idx) => (
                                        <img 
                                            key={idx}
                                            src={thumb}
                                            alt=""
                                            className={`thumb-preview ${activeLightbox.photoIndex === idx ? 'active' : ''}`}
                                            onClick={() => setActiveLightbox(prev => ({ ...prev, photoIndex: idx }))}
                                        />
                                    ))}
                                </div>
                            )}

                            <button 
                                className="btn btn-secondary btn-sm"
                                onClick={() => alert("Downloading original high-resolution memory photograph...")}
                            >
                                💾 Download High-Res
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Memory Modal */}
            {showUploadModal && (
                <div className="upload-modal-backdrop" onClick={() => setShowUploadModal(false)}>
                    <form className="upload-memory-card fade-in" onClick={(e) => e.stopPropagation()} onSubmit={handleUploadSubmit}>
                        <div className="upload-modal-header">
                            <h2>📸 Submit Hostel Photo / Memory</h2>
                            <button type="button" className="close-btn" onClick={() => setShowUploadModal(false)}>✕</button>
                        </div>
                        <p className="upload-sub">Share festival photos, block cricket tournament moments, or mess celebrations with your fellow hostel residents.</p>

                        <div className="form-group">
                            <label>Event or Memory Title *</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Block I Badminton Night League 2026"
                                value={uploadTitle}
                                onChange={(e) => setUploadTitle(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Event Category</label>
                                <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)}>
                                    <option value="Cultural Fest">Cultural Fest</option>
                                    <option value="Sports Tournament">Sports Tournament</option>
                                    <option value="Mess & Dining">Mess &amp; Dining</option>
                                    <option value="Tech & Innovation">Tech &amp; Innovation</option>
                                    <option value="Festival & Celebrations">Festival &amp; Celebrations</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Your Hostel Block</label>
                                <select value={uploadBlock} onChange={(e) => setUploadBlock(e.target.value)}>
                                    <option value="I-Block">I-Block (International &amp; Senior)</option>
                                    <option value="G-Block">G-Block (Engineering Deluxe)</option>
                                    <option value="H-Block">H-Block (Postgraduate)</option>
                                    <option value="C-Block">C-Block (Executive)</option>
                                    <option value="A-Block">A-Block (Standard)</option>
                                    <option value="B-Block">B-Block (Deluxe)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description &amp; Highlights</label>
                            <textarea 
                                rows="3"
                                placeholder="Brief note about the tournament, winning team, or memorable moment..."
                                value={uploadDesc}
                                onChange={(e) => setUploadDesc(e.target.value)}
                            />
                        </div>

                        <div className="photo-upload-placeholder">
                            <span>📷 Select photo file from your device (JPG, PNG, WebP up to 15 MB)</span>
                            <small>Simulation: Default verified campus fest photo will be attached.</small>
                        </div>

                        <div className="upload-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-emerald">
                                Submit for Gallery Moderation →
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
