import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
    { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
    { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
];

const containerStyle = {
    width: "100%",
    height: "100%"
};

const colomboCenter = {
    lat: 6.9271,
    lng: 79.8612
};

// Generate some mock real-time drivers representing the RTDB GPS stream
const generateMockDrivers = (count) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `driver-${i}`,
        lat: colomboCenter.lat + (Math.random() - 0.5) * 0.1,
        lng: colomboCenter.lng + (Math.random() - 0.5) * 0.1,
    }));
};

export default function LiveMap() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        // Uses Vite's environment variables
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
    });

    const [drivers, setDrivers] = useState(generateMockDrivers(15));

    // Simulate RTDB GPS Movement
    useEffect(() => {
        const interval = setInterval(() => {
            setDrivers(prev => prev.map(driver => ({
                ...driver,
                lat: driver.lat + (Math.random() - 0.5) * 0.002, // random short movement
                lng: driver.lng + (Math.random() - 0.5) * 0.002,
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    if (!isLoaded) {
        return (
            <div style={{ padding: 20, color: '#f97316', textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a' }}>
                <div>
                    <strong style={{ fontSize: 20 }}>Google Maps Loading...</strong><br /><br />
                    Ensure <code>VITE_GOOGLE_MAPS_API_KEY</code> is set in your .env file to enable the Operator RTDB Live Map.
                </div>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={colomboCenter}
            zoom={13}
            options={{
                styles: darkMapStyle,
                disableDefaultUI: true, // cleaner look for dashboards
            }}
        >
            {drivers.map(driver => (
                <MarkerF
                    key={driver.id}
                    position={{ lat: driver.lat, lng: driver.lng }}
                    icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        fillColor: "#ea580c", // Brand Orange
                        fillOpacity: 1,
                        strokeColor: "#ffffff",
                        strokeWeight: 2,
                        scale: 8
                    }}
                />
            ))}

            {/* Adding a few static markers for active "Rides" (Green) just for aesthetic parity with old map */}
            <MarkerF
                position={{ lat: colomboCenter.lat + 0.02, lng: colomboCenter.lng - 0.01 }}
                icon={{ path: window.google.maps.SymbolPath.CIRCLE, fillColor: "#10b981", fillOpacity: 1, strokeColor: "#ffffff", strokeWeight: 2, scale: 6 }}
            />
            <MarkerF
                position={{ lat: colomboCenter.lat - 0.01, lng: colomboCenter.lng + 0.03 }}
                icon={{ path: window.google.maps.SymbolPath.CIRCLE, fillColor: "#10b981", fillOpacity: 1, strokeColor: "#ffffff", strokeWeight: 2, scale: 6 }}
            />
        </GoogleMap>
    );
}
