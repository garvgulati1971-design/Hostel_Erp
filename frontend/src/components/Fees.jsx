import React, { useState } from "react";
import confetti from "canvas-confetti";
import ReceiptModal from "./ReceiptModal";
import { FEE_ITEMS } from "../data/mockData";
import "./Fees.css";

export default function Fees({ student, setPage }) {
    const [feesList, setFeesList] = useState(FEE_ITEMS);
    const [activeReceipt, setActiveReceipt] = useState(null);

    const pendingTotal = feesList
        .filter((f) => f.status === "Pending")
        .reduce((sum, f) => sum + f.amount, 0);

    const paidTotal = feesList
        .filter((f) => f.status === "Paid")
        .reduce((sum, f) => sum + f.amount, 0);

    const handlePayNow = (item) => {
        // Trigger celebratory confetti effect
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 }
        });

        // Update item status
        const updated = feesList.map((f) =>
            f.id === item.id ? { ...f, status: "Paid" } : f
        );
        setFeesList(updated);

        // Open digital receipt
        setActiveReceipt({
            receiptNo: `SRM-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            itemName: item.name,
            amount: item.amount,
            totalPaid: item.amount,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        });
    };

    const handleViewOverallReceipt = () => {
        setActiveReceipt({
            receiptNo: "SRM-REC-2026-8812",
            items: feesList.filter(f => f.status === "Paid"),
            totalPaid: paidTotal,
            date: "Aug 15, 2026"
        });
    };

    return (
        <div className="fees-page fade-in">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>💳 Fees & Payment Center</h1>
                    <p>Official SRM Hostel fee accounts, itemized receipts, and online payment portal</p>
                </div>
                <button className="btn btn-secondary" onClick={handleViewOverallReceipt}>
                    📜 View Official Paid Receipts
                </button>
            </div>

            {/* Summary Stat Cards */}
            <div className="fee-summary-grid">
                <div className="f-card">
                    <span className="f-icon">📊</span>
                    <div>
                        <small>Total Annual Fee</small>
                        <h2>₹{(paidTotal + pendingTotal).toLocaleString('en-IN')}</h2>
                        <p>Academic Year 2026-2027</p>
                    </div>
                </div>

                <div className="f-card success">
                    <span className="f-icon">✅</span>
                    <div>
                        <small>Total Paid Amount</small>
                        <h2 className="text-emerald">₹{paidTotal.toLocaleString('en-IN')}</h2>
                        <span className="badge badge-emerald">Cleared via Razorpay</span>
                    </div>
                </div>

                <div className="f-card warning">
                    <span className="f-icon">⌛</span>
                    <div>
                        <small>Pending Balance</small>
                        <h2 className="text-amber">₹{pendingTotal.toLocaleString('en-IN')}</h2>
                        <span className="badge badge-amber">Due Sept 15, 2026</span>
                    </div>
                </div>
            </div>

            {/* Itemized Fee Structure Table */}
            <div className="fee-table-card">
                <div className="table-header-row">
                    <h2>Itemized Hostel Fee Structure</h2>
                    <span className="badge badge-indigo">SRM Finance Division</span>
                </div>

                <table className="fee-table">
                    <thead>
                        <tr>
                            <th>Fee Head / Item Description</th>
                            <th>Due Date</th>
                            <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Receipt / Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feesList.map((item) => (
                            <tr key={item.id}>
                                <td><strong>{item.name}</strong></td>
                                <td>{item.dueDate}</td>
                                <td style={{ textAlign: 'right' }}><strong>₹{item.amount.toLocaleString('en-IN')}</strong></td>
                                <td>
                                    <span className={`badge ${item.status === 'Paid' ? 'badge-emerald' : 'badge-amber'}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {item.status === 'Paid' ? (
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setActiveReceipt({
                                                receiptNo: `SRM-REC-2026-${item.id}`,
                                                itemName: item.name,
                                                amount: item.amount,
                                                totalPaid: item.amount,
                                                date: item.dueDate
                                            })}
                                        >
                                            📜 Digital Receipt
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-emerald btn-sm"
                                            onClick={() => handlePayNow(item)}
                                        >
                                            💳 Pay Online Now
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2"><strong>Total Fees Calculated</strong></td>
                            <td style={{ textAlign: 'right' }} className="text-emerald">
                                <strong>₹{(paidTotal + pendingTotal).toLocaleString('en-IN')}</strong>
                            </td>
                            <td colSpan="2"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Receipt Modal Popup */}
            {activeReceipt && (
                <ReceiptModal
                    paymentData={activeReceipt}
                    student={student}
                    onClose={() => setActiveReceipt(null)}
                />
            )}
        </div>
    );
}
