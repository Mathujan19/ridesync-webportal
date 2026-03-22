import React, { useState } from "react";
import "./DriverManagementPage.css";

// Mock data for the driver queue
const mockDrivers = [
    { id: "S-001", name: "Kamal Perera", status: "Pending Verification", rating: 4.8, vehicles: 1, joined: "Oct 12, 2025" },
    { id: "S-002", name: "Nimal Silva", status: "Under Review", rating: 4.5, vehicles: 1, joined: "Oct 14, 2025" },
    { id: "S-003", name: "Sunil Silva", status: "Documents Rejected", rating: 3.9, vehicles: 2, joined: "Oct 15, 2025" },
    { id: "S-004", name: "Anura Kumara", status: "Pending Verification", rating: 4.9, vehicles: 1, joined: "Oct 16, 2025" },
];

export default function DriverManagementPage() {
    const [activeDriverId, setActiveDriverId] = useState("S-004");

    const activeDriver = mockDrivers.find((d) => d.id === activeDriverId);

    return (
        <div className="kyc-vault">
            {/* LEFT: Driver Queue */}
            <div className="kyc-queue">
                <div className="kyc-queue-header">Driver Verification Queue</div>
                <div className="kyc-queue-list">
                    {mockDrivers.map((driver) => (
                        <div
                            key={driver.id}
                            className={`kyc-queue-item ${activeDriverId === driver.id ? "active" : ""}`}
                            onClick={() => setActiveDriverId(driver.id)}
                        >
                            <h4>{driver.name}</h4>
                            <p>ID: {driver.id} • {driver.status}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT WORKSPACE */}
            <div className="kyc-workspace">
                {/* Top Docked Buttons */}
                <div className="kyc-actions-bar">
                    <button className="kyc-btn suspend">Suspend Account</button>
                    <button className="kyc-btn reject">Reject Documents</button>
                    <button className="kyc-btn approve">Approve Driver</button>
                </div>

                {/* Content Area: Profile + Documents split */}
                <div className="kyc-content">
                    {/* Profile Sidebar */}
                    <div className="kyc-profile">
                        <div className="kyc-avatar"></div>
                        <h2>{activeDriver.name}</h2>
                        <p className="status">{activeDriver.status}</p>

                        <div className="kyc-metrics">
                            <div className="metric">
                                <span className="label">Driver S-ID</span>
                                <span className="val">{activeDriver.id}</span>
                            </div>
                            <div className="metric">
                                <span className="label">Customer Rating</span>
                                <span className="val" style={{ color: "#f59e0b" }}>★ {activeDriver.rating}</span>
                            </div>
                            <div className="metric">
                                <span className="label">Registered Vehicles</span>
                                <span className="val">{activeDriver.vehicles}</span>
                            </div>
                            <div className="metric">
                                <span className="label">Join Date</span>
                                <span className="val">{activeDriver.joined}</span>
                            </div>
                        </div>

                        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: "1.5" }}>
                            Background check completed.<br />
                            No criminal records found.<br />
                            Police clearance expires in 6 months.
                        </p>
                    </div>

                    {/* Core KYC Workflow: Document Viewer */}
                    <div className="kyc-documents">
                        <h3>KYC Document Review</h3>
                        <div className="kyc-doc-grid">

                            <div className="kyc-doc-card">
                                <h4>National Identity Card / Driver's License</h4>
                                <div className="kyc-doc-image">
                                    [ Scanned ID Image Placeholder ]
                                </div>
                            </div>

                            <div className="kyc-doc-card">
                                <h4>Vehicle Registration (CR)</h4>
                                <div className="kyc-doc-image">
                                    [ Registration Document Placeholder ]
                                </div>
                            </div>

                            <div className="kyc-doc-card">
                                <h4>Comprehensive Insurance Cover</h4>
                                <div className="kyc-doc-image">
                                    [ Insurance Policy Placeholder ]
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
