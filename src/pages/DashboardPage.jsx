import React from "react";
import LiveMap from "../components/LiveMap";
import "./DashboardPage.css";

export default function DashboardPage() {
  return (
    <div className="mission-control">
      <LiveMap />

      <div className="mc-kpi-panel">
        <div className="mc-kpi-card">
          <h3>Total Active Rides</h3>
          <p className="value">1,492</p>
          <div className="trend">▲ 12% vs last hour</div>
        </div>
        <div className="mc-kpi-card">
          <h3>Gross Revenue (Today)</h3>
          <p className="value">Rs. 845k</p>
          <div className="trend">▲ 5.4% vs yesterday</div>
        </div>
        <div className="mc-kpi-card">
          <h3>New Driver Signups</h3>
          <p className="value">34</p>
          <div className="trend" style={{ color: "#9ca3af" }}>— Steady</div>
        </div>
      </div>

      <div className="mc-sos-ticker">
        <div className="indicator"></div>
        <span>SYSTEM NORMAL: 0 Emergency Alerts</span>
        {/* If there was an emergency, it would say "LIVE SOS: TRIP T-102" */}
      </div>
    </div>
  );
}