import React from "react";
import "./ReceiptModal.css";

export default function ReceiptModal({ paymentData, student, onClose }) {
    if (!paymentData) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="modal-backdrop">
            <div className="receipt-modal fade-in">
                <div className="receipt-header">
                    <div className="receipt-brand">
                        <div className="srm-logo">SRM</div>
                        <div>
                            <h2>SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</h2>
                            <p>Kattankulathur Campus, Chengalpattu District, TN - 603203</p>
                            <small className="receipt-subtitle">OFFICIAL HOSTEL FEE PAYMENT RECEIPT</small>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="receipt-meta">
                    <div className="meta-col">
                        <span>Receipt No:</span>
                        <strong>{paymentData.receiptNo || "SRM-REC-2026-9941"}</strong>
                    </div>
                    <div className="meta-col">
                        <span>Payment Date:</span>
                        <strong>{paymentData.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong>
                    </div>
                    <div className="meta-col">
                        <span>Payment Status:</span>
                        <span className="badge badge-emerald">CONFIRMED & PAID</span>
                    </div>
                </div>

                <div className="receipt-body">
                    <div className="student-info-grid">
                        <div>
                            <small>Student Name</small>
                            <p>{student.name}</p>
                        </div>
                        <div>
                            <small>Register Number</small>
                            <p>{student.rollNo}</p>
                        </div>
                        <div>
                            <small>Hostel & Room</small>
                            <p>{student.hostelBlock} - Room {student.roomNo}</p>
                        </div>
                        <div>
                            <small>Academic Program</small>
                            <p>{student.course}</p>
                        </div>
                    </div>

                    <table className="receipt-table">
                        <thead>
                            <tr>
                                <th>Item Description</th>
                                <th>Category</th>
                                <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentData.items ? paymentData.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.name}</td>
                                    <td>Academic / Facilities</td>
                                    <td style={{ textAlign: 'right' }}>₹{item.amount.toLocaleString('en-IN')}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td>{paymentData.itemName || "Semester Gym & Sports Facility Fee"}</td>
                                    <td>Sports & Wellness</td>
                                    <td style={{ textAlign: 'right' }}>₹{(paymentData.amount || 30000).toLocaleString('en-IN')}</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2"><strong>Total Amount Received</strong></td>
                                <td style={{ textAlign: 'right' }} className="total-cell">
                                    <strong>₹{(paymentData.totalPaid || 30000).toLocaleString('en-IN')}</strong>
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="receipt-footer-notes">
                        <div className="txn-ref">
                            <p><strong>Transaction Ref:</strong> TXN_UPI_9938472918847291</p>
                            <p><strong>Payment Mode:</strong> Razorpay Online Gateway (UPI / HDFC NetBanking)</p>
                        </div>
                        <div className="seal-box">
                            <div className="stamp">SRM HOSTEL ACCOUNTS SEAL</div>
                            <p>Digitally Signed & Verified</p>
                        </div>
                    </div>
                </div>

                <div className="receipt-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Close Window</button>
                    <button className="btn btn-emerald" onClick={handlePrint}>🖨️ Print / Download PDF Receipt</button>
                </div>
            </div>
        </div>
    );
}
