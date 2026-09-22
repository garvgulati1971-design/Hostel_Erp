import React, { useState, useEffect } from "react";
import { INITIAL_ITEM_REQUESTS, INITIAL_BLOCKS } from "../data/mockData";
import "./ItemRequestBox.css";

export default function ItemRequestBox({ student }) {
    const [requests, setRequests] = useState(INITIAL_ITEM_REQUESTS);
    const [blocksList] = useState(INITIAL_BLOCKS);
    const [selectedBlock, setSelectedBlock] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [showPostModal, setShowPostModal] = useState(false);
    const [activeOfferModal, setActiveOfferModal] = useState(null); // request object

    // Post request form state
    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState("Apparel & Grooming");
    const [targetBlock, setTargetBlock] = useState(student.hostelBlock?.includes("Block") ? student.hostelBlock.split(" ")[0] : "C-Block");
    const [roomNo, setRoomNo] = useState(student.roomNo || "402");
    const [urgency, setUrgency] = useState("Immediate (15-30 mins)");
    const [description, setDescription] = useState("");

    // Offer Help form state
    const [helperName, setHelperName] = useState(student.name || "Fellow Student");
    const [helperRoom, setHelperRoom] = useState(student.roomNo || "402");
    const [helperNote, setHelperNote] = useState("I have this item available in my room right now!");

    useEffect(() => {
        fetchItemRequests();
    }, [selectedBlock]);

    const fetchItemRequests = async () => {
        try {
            const b = selectedBlock === "All" ? "" : selectedBlock;
            const res = await fetch(`http://localhost:5000/api/item-requests?block=${b}`);
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                const mapped = data.data.map(r => ({
                    id: r.id,
                    studentName: r.student_name,
                    studentRoom: r.student_room,
                    hostelBlock: r.hostel_block,
                    itemName: r.item_name,
                    category: r.category,
                    description: r.description,
                    urgency: r.urgency,
                    status: r.status,
                    helperName: r.helper_name,
                    helperRoom: r.helper_room,
                    helperBlock: r.helper_block,
                    helperNote: r.helper_note,
                    createdAt: r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"
                }));
                setRequests(mapped);
            }
        } catch (e) {
            console.log("Using local item requests fallback");
        }
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        if (!itemName.trim() || !description.trim()) return;

        const payload = {
            studentId: student.id || "SRM20260402",
            studentName: student.name || "Garv",
            studentRoom: roomNo,
            hostelBlock: targetBlock,
            itemName,
            category,
            description,
            urgency
        };

        try {
            await fetch("http://localhost:5000/api/item-requests/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } catch (err) {}

        const newReq = {
            id: `REQ-${Date.now()}`,
            studentName: student.name || "Garv",
            studentRoom: roomNo,
            hostelBlock: targetBlock,
            itemName,
            category,
            description,
            urgency,
            status: "Open",
            helperName: null,
            helperRoom: null,
            helperBlock: null,
            helperNote: null,
            createdAt: "Just now"
        };

        setRequests([newReq, ...requests]);
        setShowPostModal(false);
        setItemName("");
        setDescription("");
        alert(`Your request for "${itemName}" has been posted to ${targetBlock} residents!`);
    };

    const handleConfirmOffer = async (e) => {
        e.preventDefault();
        if (!activeOfferModal) return;

        const payload = {
            requestId: activeOfferModal.id,
            helperName: helperName || student.name,
            helperRoom: helperRoom || student.roomNo,
            helperBlock: student.hostelBlock?.split(" ")[0] || "C-Block",
            helperNote
        };

        try {
            await fetch("http://localhost:5000/api/item-requests/offer-help", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } catch (err) {}

        setRequests(prev => prev.map(r => {
            if (r.id === activeOfferModal.id) {
                return {
                    ...r,
                    status: "Help Offered",
                    helperName: payload.helperName,
                    helperRoom: payload.helperRoom,
                    helperBlock: payload.helperBlock,
                    helperNote: payload.helperNote
                };
            }
            return r;
        }));

        setActiveOfferModal(null);
        alert(`Thank you! Notification sent to ${activeOfferModal.studentName} in Room ${activeOfferModal.studentRoom}.`);
    };

    const handleMarkFulfilled = async (requestId) => {
        try {
            await fetch("http://localhost:5000/api/item-requests/fulfill", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId })
            });
        } catch (e) {}

        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "Fulfilled" } : r));
        alert("Item marked as returned / fulfilled! Thank you for fostering a supportive hostel community.");
    };

    const blockOptions = ["All", "I-Block", "G-Block", "H-Block", "C-Block", "A-Block", "B-Block"];

    const filteredRequests = requests.filter(r => {
        const matchesBlock = selectedBlock === "All" || r.hostelBlock.includes(selectedBlock);
        const matchesStatus = selectedStatus === "All" || r.status === selectedStatus;
        return matchesBlock && matchesStatus;
    });

    // Active block info for directory preview
    const currentBlockInfo = blocksList.find(b => selectedBlock !== "All" && b.code === selectedBlock);

    return (
        <div className="sharehub-page fade-in">
            {/* Header */}
            <div className="sharehub-header">
                <div>
                    <div className="sharehub-tag">
                        <span>🤝 PEER-TO-PEER HOSTELLER AID NETWORK</span>
                        <span className="badge badge-emerald">HOSTEL SHAREHUB</span>
                    </div>
                    <h1>📦 Block-Based Item Request Box</h1>
                    <p>
                        In urgent need of an iron box, cycle air pump, scientific calculator, Ethernet cable, or emergency medicine? Request it from fellow students residing in your hostel block!
                    </p>
                </div>

                <button className="btn btn-primary" onClick={() => setShowPostModal(true)}>
                    + Request an Item in Block
                </button>
            </div>

            {/* Quick Common Items Carousel */}
            <div className="quick-request-suggestions">
                <span>Frequently Needed Items:</span>
                <button className="quick-item-pill" onClick={() => { setItemName("Steam Iron Box"); setCategory("Apparel & Grooming"); setShowPostModal(true); }}>
                    👔 Steam Iron
                </button>
                <button className="quick-item-pill" onClick={() => { setItemName("Cycle Air Pump"); setCategory("Sports & Fitness"); setShowPostModal(true); }}>
                    🚲 Cycle Air Pump
                </button>
                <button className="quick-item-pill" onClick={() => { setItemName("Scientific Calculator fx-991"); setCategory("Academic Supplies"); setShowPostModal(true); }}>
                    🧮 Casio Calculator
                </button>
                <button className="quick-item-pill" onClick={() => { setItemName("Ethernet LAN Cable"); setCategory("Electronics & Networking"); setShowPostModal(true); }}>
                    🔌 LAN Cable
                </button>
                <button className="quick-item-pill" onClick={() => { setItemName("Large Travel Umbrella"); setCategory("Daily Utility"); setShowPostModal(true); }}>
                    ☂️ Rain Umbrella
                </button>
                <button className="quick-item-pill" onClick={() => { setItemName("First Aid / Headache Balm"); setCategory("Medical & Emergency"); setShowPostModal(true); }}>
                    🩹 Emergency First Aid
                </button>
            </div>

            {/* Block Filter Tabs */}
            <div className="block-filter-bar">
                <div className="block-tabs-list">
                    {blockOptions.map(b => (
                        <button 
                            key={b}
                            className={`block-tab-btn ${selectedBlock === b ? 'active' : ''}`}
                            onClick={() => setSelectedBlock(b)}
                        >
                            {b === "All" ? "🏢 All Blocks" : `📍 ${b}`}
                        </button>
                    ))}
                </div>

                <div className="status-filter-select">
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="All">All Request Statuses</option>
                        <option value="Open">Open Requests Only</option>
                        <option value="Help Offered">Help Offered</option>
                        <option value="Fulfilled">Fulfilled / Returned</option>
                    </select>
                </div>
            </div>

            {/* Block Warden & Service Staff Preview Pill (When a block is selected) */}
            {currentBlockInfo && (
                <div className="block-staff-banner fade-in">
                    <div className="staff-info-col">
                        <small>🏢 Selected Wing:</small>
                        <strong>{currentBlockInfo.name}</strong>
                    </div>
                    <div className="staff-info-col">
                        <small>👨‍💼 Block Warden on Duty:</small>
                        <strong>{currentBlockInfo.wardenName}</strong>
                        <span>📞 {currentBlockInfo.wardenPhone} ({currentBlockInfo.wardenOffice})</span>
                    </div>
                    <div className="staff-info-col">
                        <small>🛠️ Assigned Service Tech:</small>
                        <strong>{currentBlockInfo.serviceTechName} ({currentBlockInfo.serviceTechRole})</strong>
                        <span>📞 {currentBlockInfo.serviceTechPhone}</span>
                    </div>
                </div>
            )}

            {/* Requests Grid */}
            <div className="requests-grid">
                {filteredRequests.length === 0 ? (
                    <div className="empty-requests-box">
                        <div className="empty-icon">📭</div>
                        <h3>No active item requests in this block</h3>
                        <p>Need something urgently? Click "+ Request an Item in Block" above to ask your hostel neighbors.</p>
                    </div>
                ) : (
                    filteredRequests.map((req) => (
                        <div key={req.id} className={`request-card ${req.status.toLowerCase().replace(' ', '-')}`}>
                            <div className="req-card-top">
                                <div className="req-meta-left">
                                    <span className="req-block-tag">🏢 {req.hostelBlock} • Room {req.studentRoom}</span>
                                    <span className="req-category-tag">{req.category}</span>
                                </div>
                                <span className={`urgency-badge ${req.urgency.includes('Immediate') ? 'urgent' : ''}`}>
                                    ⚡ {req.urgency}
                                </span>
                            </div>

                            <h3 className="req-item-title">{req.itemName}</h3>
                            <p className="req-desc">{req.description}</p>

                            <div className="req-student-bar">
                                <span>Requested by: <strong>{req.studentName}</strong> (Room {req.studentRoom})</span>
                                <small>{req.createdAt}</small>
                            </div>

                            {/* Help Status Banner */}
                            {req.status === "Help Offered" && (
                                <div className="help-offered-banner">
                                    <div className="banner-top">
                                        <span>🤝 {req.helperName} offered help from Room {req.helperRoom}!</span>
                                        <span className="badge badge-emerald">Ready for Pickup</span>
                                    </div>
                                    <p className="helper-note-text">"{req.helperNote || 'Available now in my room'}"</p>
                                </div>
                            )}

                            {req.status === "Fulfilled" && (
                                <div className="fulfilled-banner">
                                    <span>✅ Item safely returned / Fulfilled</span>
                                </div>
                            )}

                            {/* Card Footer Actions */}
                            <div className="req-footer">
                                {req.status === "Open" && (
                                    <button 
                                        className="btn btn-emerald btn-sm"
                                        onClick={() => setActiveOfferModal(req)}
                                    >
                                        🤝 I Have This Item / Offer Help
                                    </button>
                                )}

                                {req.status === "Help Offered" && (
                                    <button 
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleMarkFulfilled(req.id)}
                                    >
                                        ✓ Mark as Borrowed &amp; Returned
                                    </button>
                                )}

                                {req.status === "Fulfilled" && (
                                    <span className="fulfilled-text">Peer Exchange Completed</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal: Post New Request */}
            {showPostModal && (
                <div className="request-modal-backdrop" onClick={() => setShowPostModal(false)}>
                    <form className="request-modal-card fade-in" onClick={(e) => e.stopPropagation()} onSubmit={handleCreateRequest}>
                        <div className="modal-header">
                            <div>
                                <h2>📦 Request an Item from Hostel Peers</h2>
                                <p className="modal-sub">Targeted by your hostel block</p>
                            </div>
                            <button type="button" className="close-btn" onClick={() => setShowPostModal(false)}>✕</button>
                        </div>

                        <div className="form-group">
                            <label>Item Name *</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Iron Box, Cycle Pump, Scientific Calculator, Lab Coat"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Item Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="Apparel & Grooming">Apparel &amp; Grooming (Iron, Hanger)</option>
                                    <option value="Academic Supplies">Academic Supplies (Calculator, Lab Coat, Drafter)</option>
                                    <option value="Sports & Fitness">Sports &amp; Fitness (Cycle Pump, Racket)</option>
                                    <option value="Electronics & Networking">Electronics &amp; Networking (LAN, Charger, Adapter)</option>
                                    <option value="Daily Utility">Daily Utility (Umbrella, Tools)</option>
                                    <option value="Medical & Emergency">Medical &amp; Emergency (First Aid, Balm)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Hostel Block to Broadcast</label>
                                <select value={targetBlock} onChange={(e) => setTargetBlock(e.target.value)}>
                                    <option value="I-Block">I-Block (International &amp; Senior)</option>
                                    <option value="G-Block">G-Block (Engineering Deluxe)</option>
                                    <option value="H-Block">H-Block (Postgraduate &amp; Research)</option>
                                    <option value="C-Block">C-Block (Boys Executive)</option>
                                    <option value="A-Block">A-Block (Standard)</option>
                                    <option value="B-Block">B-Block (Deluxe)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Your Room Number *</label>
                                <input 
                                    type="text" 
                                    value={roomNo}
                                    onChange={(e) => setRoomNo(e.target.value)}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>How Urgently Needed?</label>
                                <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                                    <option value="Immediate (15-30 mins)">Immediate (15-30 mins)</option>
                                    <option value="Within 2 Hours">Within 2 Hours</option>
                                    <option value="Today">Today</option>
                                    <option value="Flexible">Flexible</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description &amp; Return Promise *</label>
                            <textarea 
                                rows="3"
                                placeholder="e.g. Need steam iron for 20 mins to press placement shirt. Will return immediately in perfect shape!"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowPostModal(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Broadcast Request to Block →
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Modal: Offer Help to a Student */}
            {activeOfferModal && (
                <div className="request-modal-backdrop" onClick={() => setActiveOfferModal(null)}>
                    <form className="request-modal-card fade-in" onClick={(e) => e.stopPropagation()} onSubmit={handleConfirmOffer}>
                        <div className="modal-header">
                            <div>
                                <h2>🤝 Offer Item to {activeOfferModal.studentName}</h2>
                                <p className="modal-sub">Room {activeOfferModal.studentRoom} ({activeOfferModal.hostelBlock})</p>
                            </div>
                            <button type="button" className="close-btn" onClick={() => setActiveOfferModal(null)}>✕</button>
                        </div>

                        <div className="offer-preview-box">
                            <strong>Requested: {activeOfferModal.itemName}</strong>
                            <p>"{activeOfferModal.description}"</p>
                            <small>⚡ Urgency: {activeOfferModal.urgency}</small>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Your Name</label>
                                <input 
                                    type="text" 
                                    value={helperName}
                                    onChange={(e) => setHelperName(e.target.value)}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Your Room Number</label>
                                <input 
                                    type="text" 
                                    value={helperRoom}
                                    onChange={(e) => setHelperRoom(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Pickup Instructions / Note for Requester</label>
                            <input 
                                type="text" 
                                placeholder="e.g. I am in room right now, knock on door or call!"
                                value={helperNote}
                                onChange={(e) => setHelperNote(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setActiveOfferModal(null)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-emerald">
                                Confirm &amp; Send Offer →
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
