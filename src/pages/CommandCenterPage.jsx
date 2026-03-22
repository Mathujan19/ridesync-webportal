import React from "react";
import LiveMap from "../components/LiveMap";
import "./CommandCenterPage.css";

export default function CommandCenterPage() {
    return (
        <div className="cmd-center">
            {/* Light Panel: Operations */}
            <div className="cmd-operations">
                <div className="cmd-panel-heading">Operations Control</div>

                <div className="cmd-section">
                    <h3>Manual Dispatch Queue</h3>

                    <div className="cmd-queue-item">
                        <p>Req: VIP Passenger Pickup</p>
                        <p className="dest">From: Galle Face Hotel<br />To: BIA Airport</p>
                        <div className="btn-group">
                            <button className="cmd-btn primary">Assign Driver</button>
                            <button className="cmd-btn">Reject</button>
                        </div>
                    </div>

                    <div className="cmd-queue-item">
                        <p>Req: Premium Sedan</p>
                        <p className="dest">From: One Galle Face<br />To: Mount Lavinia</p>
                        <div className="btn-group">
                            <button className="cmd-btn primary">Assign Driver</button>
                            <button className="cmd-btn">Reject</button>
                        </div>
                    </div>
                </div>

                <div className="cmd-section">
                    <h3>Fare & Zone Management</h3>
                    <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 12px 0", lineHeight: 1.5 }}>
                        Active Geofence: <strong>Colombo 1-15</strong><br />
                        Surge Status: <strong>1.5x Multiplier</strong>
                    </p>
                    <button className="cmd-btn" style={{ width: "100%" }}>Edit Geofence Regions</button>
                </div>
            </div>

            {/* Dark Map Area */}
            <div className="cmd-map-area">
                <LiveMap />
            </div>

            {/* Extreme Dark Panel: Safety / SOS Console */}
            <div className="cmd-safety">
                <div className="sos-alert-header">
                    <div className="icon"></div>
                    LIVE SOS: TRIP T-102
                </div>

                <div className="sos-details">
                    <p>Passenger: <strong>Sunil Perera</strong></p>
                    <p>Driver: <strong>Sanjaya Silva (S-045)</strong></p>
                    <p>Vehicle: <strong>Toyota Prius - WP CAB-4521</strong></p>
                    <p>Triggered: <strong>2 minutes ago</strong></p>
                </div>

                <div className="sos-gps-trace">
                    <div className="gps-line"></div>
                    <div className="gps-car"></div>
                    <span style={{ position: "absolute", top: 12, right: 12, fontSize: 11, color: "#94a3b8" }}>LIVE TRACKING ENGAGED</span>
                </div>

                <div className="sos-chat">
                    <div className="sos-chat-msgs">
                        <div className="msg driver">
                            Help, the passenger is acting extremely aggressive and refusing to leave the vehicle.
                        </div>
                        <div className="msg admin">
                            Received. Stay calm. Are you in a safe location to pull over?
                        </div>
                        <div className="msg driver">
                            I have pulled over at Bambalapitiya junction. Doors are locked.
                        </div>
                        <div className="msg admin">
                            Police patrol has been dispatched to your GPS location. ETA 2 minutes. Do not engage.
                        </div>
                    </div>
                    <div className="sos-chat-input">
                        <input type="text" placeholder="Admin response to driver..." />
                        <button>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
