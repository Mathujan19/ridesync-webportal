import React from "react";

// Procedurally generate some random dots to simulate Colombo traffic
const generateDots = (count, type) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `${type}-${i}`,
        x: 20 + Math.random() * 60, // Keep them mostly in the center
        y: 10 + Math.random() * 80,
        type,
    }));
};

const drivers = generateDots(15, "driver");
const rides = generateDots(25, "ride");
const requests = generateDots(10, "request");

export default function LiveMap() {
    const allDots = [...drivers, ...rides, ...requests];

    return (
        <div className="mc-map-container">
            {/* City schematic overlay could go here. For now, we use a grid background in CSS */}
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
                <path d="M 300 100 Q 400 300 600 500 T 900 800" stroke="#fff" strokeWidth="4" fill="none" />
                <path d="M 500 0 Q 300 400 500 900" stroke="#fff" strokeWidth="2" fill="none" />
                <path d="M 0 500 Q 400 400 1000 600" stroke="#3b82f6" strokeWidth="3" fill="none" />
            </svg>

            {allDots.map((dot) => (
                <div
                    key={dot.id}
                    className={`mc-map-dot ${dot.type}`}
                    style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                />
            ))}
        </div>
    );
}
