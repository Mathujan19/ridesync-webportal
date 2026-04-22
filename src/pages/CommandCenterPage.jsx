import React, { useState, useEffect, useRef } from "react";
import LiveMap from "../components/LiveMap";
import "./CommandCenterPage.css";
import { subscribeToDispatchQueue, updateDispatchRequest, subscribeToSosChat, sendSosMessage } from "../services/dispatch";
import { isFirebaseConfigured } from "../services/firebase";

// Local Fallback Mocks
const fallbackDispatchQueue = [
    { id: "req-1", type: "VIP Passenger Pickup", from: "Galle Face Hotel", to: "BIA Airport", status: "Pending" },
    { id: "req-2", type: "Premium Sedan", from: "One Galle Face", to: "Mount Lavinia", status: "Pending" }
];
const fallbackChatMsgs = [
    { id: "msg-1", sender: "driver", text: "Help, the passenger is acting extremely aggressive and refusing to leave the vehicle." },
    { id: "msg-2", sender: "admin", text: "Received. Stay calm. Are you in a safe location to pull over?" },
    { id: "msg-3", sender: "driver", text: "I have pulled over at Bambalapitiya junction. Doors are locked." }
];

export default function CommandCenterPage() {
    const [dispatchQueue, setDispatchQueue] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [toastMsg, setToastMsg] = useState("");
    const chatBottomRef = useRef(null);

    const activeTripId = "T-102"; // Hardcoded active SOS trip for the mock operations board

    useEffect(() => {
        if (!isFirebaseConfigured) {
            setDispatchQueue(fallbackDispatchQueue);
            setChatMessages(fallbackChatMsgs);
            return;
        }

        const unsubQueue = subscribeToDispatchQueue((data) => {
            // Keep only pending requests
            setDispatchQueue(data.filter(req => req.status === "Pending"));
        });

        const unsubChat = subscribeToSosChat(activeTripId, (data) => {
            setChatMessages(data);
        });

        return () => {
            unsubQueue();
            unsubChat();
        };
    }, []);

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (chatBottomRef.current) {
            chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages]);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(""), 3000);
    };

    const handleDispatchAction = async (reqId, actionStr) => {
        if (!isFirebaseConfigured) {
            setDispatchQueue(prev => prev.filter(r => r.id !== reqId));
            showToast(`Local Mode: Request ${actionStr}`);
            return;
        }

        try {
            await updateDispatchRequest(reqId, actionStr);
            showToast(`Request ${actionStr} successfully.`);
        } catch (error) {
            alert("Failed to update dispatch queue in Firebase.");
        }
    };

    const handleSendChat = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const messageText = chatInput;
        setChatInput("");

        if (!isFirebaseConfigured) {
            setChatMessages(prev => [...prev, { id: `msg-${Date.now()}`, sender: "admin", text: messageText }]);
            return;
        }

        try {
            await sendSosMessage(activeTripId, messageText);
        } catch (error) {
            alert("Failed to send message.");
            setChatInput(messageText); // Restore input on failure
        }
    };

    return (
        <div className="cmd-center">
            {/* Transient Toast Notification */}
            {toastMsg && (
                <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "var(--brand-orange)", color: "#fff", padding: "10px 20px", borderRadius: 8, zIndex: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.5)", fontWeight: "bold" }}>
                    {toastMsg}
                </div>
            )}

            {/* Light Panel: Operations */}
            <div className="cmd-operations">
                <div className="cmd-panel-heading">Operations Control</div>

                <div className="cmd-section">
                    <h3>Manual Dispatch Queue</h3>
                    
                    {dispatchQueue.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: 13, fontStyle: "italic" }}>No pending requests.</p>
                    ) : (
                        dispatchQueue.map(req => (
                            <div className="cmd-queue-item" key={req.id}>
                                <p>Req: {req.type}</p>
                                <p className="dest">From: {req.from}<br />To: {req.to}</p>
                                <div className="btn-group">
                                    <button className="cmd-btn primary" onClick={() => handleDispatchAction(req.id, "Assigned")}>Assign Driver</button>
                                    <button className="cmd-btn" onClick={() => handleDispatchAction(req.id, "Rejected")}>Reject</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cmd-section">
                    <h3>Fare & Zone Management</h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                        Active Geofence: <strong style={{color:"var(--text-main)"}}>Colombo 1-15</strong><br />
                        Surge Status: <strong style={{color:"var(--brand-orange)"}}>1.5x Multiplier</strong>
                    </p>
                    <button className="cmd-btn" style={{ width: "100%" }} onClick={() => showToast("Geofence Editor Locked (WIP)")}>Edit Geofence Regions</button>
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
                    LIVE SOS: TRIP {activeTripId}
                </div>

                <div className="sos-details">
                    <p>Passenger: <strong>Sunil Perera</strong></p>
                    <p>Driver: <strong>Sanjaya Silva (S-045)</strong></p>
                    <p>Vehicle: <strong>Toyota Prius - WP CAB-4521</strong></p>
                    <p>Triggered: <strong>Active Right Now</strong></p>
                </div>

                <div className="sos-gps-trace">
                    <div className="gps-line"></div>
                    <div className="gps-car"></div>
                    <span style={{ position: "absolute", top: 12, right: 12, fontSize: 11, color: "var(--text-disabled)", fontWeight:"bold" }}>LOCAL GPS TRACE</span>
                </div>

                <div className="sos-chat">
                    <div className="sos-chat-msgs">
                        {chatMessages.map(msg => (
                            <div key={msg.id} className={`msg ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={chatBottomRef} />
                    </div>
                    <form className="sos-chat-input" onSubmit={handleSendChat}>
                        <input 
                            type="text" 
                            placeholder="Admin response to driver..." 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
