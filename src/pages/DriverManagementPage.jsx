import React, { useState, useEffect } from "react";
import "./DriverManagementPage.css";
import { subscribeToDrivers, updateDriverStatus } from "../services/drivers";
import { isFirebaseConfigured } from "../services/firebase";

// Fallback Mock data for when Firebase is not connected locally
const fallbackMockDrivers = [
    { id: "S-001", name: "Kamal Perera (Local Mock)", status: "Pending Verification", rating: 4.8, vehicles: 1, joined: "Oct 12, 2025" },
    { id: "S-002", name: "Nimal Silva (Local Mock)", status: "Under Review", rating: 4.5, vehicles: 1, joined: "Oct 14, 2025" },
    { id: "S-003", name: "Sunil Silva (Local Mock)", status: "Documents Rejected", rating: 3.9, vehicles: 2, joined: "Oct 15, 2025" },
];

export default function DriverManagementPage() {
    const [drivers, setDrivers] = useState([]);
    const [activeDriverId, setActiveDriverId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize Firebase listener
    useEffect(() => {
        if (!isFirebaseConfigured) {
            // Local dev mode fallback
            setDrivers(fallbackMockDrivers);
            setActiveDriverId(fallbackMockDrivers[0].id);
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToDrivers((data) => {
            setDrivers(data);
            setLoading(false);
            
            // Auto-select the first driver if none is selected yet
            if (data.length > 0) {
                setActiveDriverId((prevId) => {
                    // Try to preserve selection if possible, otherwise snap to first
                    const stillExists = data.some(d => d.id === prevId);
                    return stillExists ? prevId : data[0].id;
                });
            } else {
                setActiveDriverId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const activeDriver = drivers.find((d) => d.id === activeDriverId);

    const handleAction = async (newStatus) => {
        if (!activeDriver) return;

        if (!isFirebaseConfigured) {
            // Update local state so testing works without Firebase
            setDrivers(prev => prev.map(d => d.id === activeDriver.id ? { ...d, status: newStatus } : d));
            alert(`Test Mode ✅ Driver KYC Status updated locally to: ${newStatus}`);
            return;
        }
        
        try {
            await updateDriverStatus(activeDriver.id, newStatus);
            alert(`✅ Driver KYC Status updated to: ${newStatus}`);
        } catch (err) {
            alert("Warning: Failed to update driver KYC state in Firestore.");
        }
    };

    if (loading) {
        return (
            <div className="kyc-vault" style={{ alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                Initializing KYC Verification Secure Vault...
            </div>
        );
    }

    if (!activeDriver) {
        return (
            <div className="kyc-vault" style={{ alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                {!isFirebaseConfigured ? "Setup Firebase to see live operators." : "No drivers currently existing in the database."}
            </div>
        );
    }

    return (
        <div className="kyc-vault">
            {/* LEFT: Driver Queue */}
            <div className="kyc-queue">
                <div className="kyc-queue-header">Driver Verification Queue</div>
                <div className="kyc-queue-list">
                    {drivers.map((driver) => (
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
                    <button className="kyc-btn suspend" onClick={() => handleAction("Suspended")}>Suspend Account</button>
                    <button className="kyc-btn reject" onClick={() => handleAction("Documents Rejected")}>Reject Documents</button>
                    <button className="kyc-btn approve" onClick={() => handleAction("Approved / Active")}>Approve Driver</button>
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
                                <span className="val" style={{ color: "#f59e0b" }}>★ {activeDriver.rating || "N/A"}</span>
                            </div>
                            <div className="metric">
                                <span className="label">Registered Vehicles</span>
                                <span className="val">{activeDriver.vehicles || "N/A"}</span>
                            </div>
                            <div className="metric">
                                <span className="label">Join Date</span>
                                <span className="val">{activeDriver.joined || "N/A"}</span>
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
