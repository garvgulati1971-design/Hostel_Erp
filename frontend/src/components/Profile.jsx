import React from "react";
import "./Profile.css";

export default function Profile({ student, setPage }) {
    return (
        <div className="profile-page fade-in">
            <div className="page-header">
                <div>
                    <h1>👤 Student Residence Profile</h1>
                    <p>Official SRM academic registration and hostel room assignment details</p>
                </div>
                <button className="btn btn-secondary" onClick={() => setPage("dashboard")}>
                    ← Back to Dashboard
                </button>
            </div>

            <div className="profile-grid">
                {/* Left Overview Card */}
                <div className="p-card avatar-overview-card">
                    <div className="big-avatar">
                        <span>{student.name.charAt(0)}</span>
                    </div>

                    <h2>{student.name}</h2>
                    <p className="p-roll">{student.rollNo}</p>
                    <span className="badge badge-emerald">STUDENT RESIDENT ACTIVE</span>

                    <div className="p-quick-meta">
                        <div>
                            <small>Hostel Room</small>
                            <strong>Block C - {student.roomNo}</strong>
                        </div>
                        <div>
                            <small>Bed Unit</small>
                            <strong>Bed {student.bedNo}</strong>
                        </div>
                        <div>
                            <small>Attendance</small>
                            <strong>{student.attendanceRate}%</strong>
                        </div>
                    </div>
                </div>

                {/* Right Detailed Information */}
                <div className="p-card-column">
                    {/* Academic & Personal Details */}
                    <div className="p-card">
                        <h2>🎓 Academic Program & Registration</h2>
                        <div className="details-two-col">
                            <div>
                                <small>Degree Program</small>
                                <p>{student.course}</p>
                            </div>
                            <div>
                                <small>Current Academic Year</small>
                                <p>{student.year}</p>
                            </div>
                            <div>
                                <small>SRM Email Address</small>
                                <p>{student.email}</p>
                            </div>
                            <div>
                                <small>Student Phone Number</small>
                                <p>{student.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Roommate & Warden Details */}
                    <div className="p-card">
                        <h2>🏠 Hostel Residence & Contacts</h2>
                        <div className="details-two-col">
                            <div>
                                <small>Assigned Room Type</small>
                                <p>{student.roomType}</p>
                            </div>
                            <div>
                                <small>Roommate Details</small>
                                <p><strong>{student.roommate.name}</strong> ({student.roommate.dept})</p>
                            </div>
                            <div>
                                <small>Hostel Warden In-Charge</small>
                                <p><strong>{student.warden.name}</strong> ({student.warden.phone})</p>
                            </div>
                            <div>
                                <small>Parent / Guardian Emergency Contact</small>
                                <p><strong>{student.guardian.name}</strong> ({student.guardian.relation} - {student.guardian.phone})</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
