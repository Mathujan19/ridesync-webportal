import { useEffect, useMemo, useState } from "react";
import { subscribeToDrivers } from "../services/drivers";
import { subscribeToBuses, subscribeToConductors } from "../services/registry";
import { isFirebaseConfigured } from "../services/firebase";
import "./FleetRegistryPage.css";

const fallbackBuses = [
  {
    id: "BUS-101",
    plateNumber: "WP CAB-4521",
    route: "Colombo - Kandy",
    depot: "Maradana Depot",
    capacity: 42,
    status: "Active",
    lastInspection: "Apr 28, 2026",
    assignedDriver: "DR-001 • Kasun Perera",
    assignedConductor: "CT-001 • Nuwan Silva",
  },
  {
    id: "BUS-204",
    plateNumber: "WP BUS-1189",
    route: "Gampaha - Colombo",
    depot: "Kadawatha Depot",
    capacity: 36,
    status: "On Route",
    lastInspection: "May 03, 2026",
    assignedDriver: "DR-002 • Tharindu Madushanka",
    assignedConductor: "CT-002 • Chamara Fernando",
  },
  {
    id: "BUS-319",
    plateNumber: "WP TRN-7784",
    route: "Galle - Matara",
    depot: "Galle Depot",
    capacity: 48,
    status: "Standby",
    lastInspection: "Apr 21, 2026",
    assignedDriver: "DR-003 • Ruwan Jayasinghe",
    assignedConductor: "CT-003 • Dilshan Kumara",
  },
];

const fallbackDrivers = [
  {
    id: "DR-001",
    name: "Kasun Perera",
    licenseNumber: "B-458921",
    phone: "+94 71 555 0142",
    busId: "BUS-101",
    experience: "7 years",
    status: "Verified",
  },
  {
    id: "DR-002",
    name: "Tharindu Madushanka",
    licenseNumber: "B-458923",
    phone: "+94 77 555 1109",
    busId: "BUS-204",
    experience: "4 years",
    status: "Verified",
  },
  {
    id: "DR-003",
    name: "Ruwan Jayasinghe",
    licenseNumber: "B-458928",
    phone: "+94 76 555 2281",
    busId: "BUS-319",
    experience: "9 years",
    status: "On Duty",
  },
];

const fallbackConductors = [
  {
    id: "CT-001",
    name: "Nuwan Silva",
    employeeId: "EMP-221",
    phone: "+94 70 555 8801",
    busId: "BUS-101",
    shift: "Morning",
    status: "Checked In",
  },
  {
    id: "CT-002",
    name: "Chamara Fernando",
    employeeId: "EMP-228",
    phone: "+94 70 555 1102",
    busId: "BUS-204",
    shift: "Afternoon",
    status: "Checked In",
  },
  {
    id: "CT-003",
    name: "Dilshan Kumara",
    employeeId: "EMP-239",
    phone: "+94 70 555 3393",
    busId: "BUS-319",
    shift: "Night",
    status: "Pending Check-in",
  },
];

const emptySelection = { type: "bus", id: fallbackBuses[0].id };

function registryItemLabel(type, item) {
  if (type === "bus") return `${item.id} • ${item.plateNumber || item.route || "Bus"}`;
  if (type === "driver") return `${item.id} • ${item.name || "Driver"}`;
  return `${item.id} • ${item.name || "Conductor"}`;
}

function FleetRegistryPage() {
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [conductors, setConductors] = useState([]);
  const [selected, setSelected] = useState(emptySelection);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setBuses(fallbackBuses);
      setDrivers(fallbackDrivers);
      setConductors(fallbackConductors);
      setSelected({ type: "bus", id: fallbackBuses[0].id });
      setLoading(false);
      return;
    }

    const unsubBuses = subscribeToBuses((items) => {
      setBuses(items);
      setLoading(false);
    });

    const unsubDrivers = subscribeToDrivers((items) => {
      setDrivers(items);
      setLoading(false);
    });

    const unsubConductors = subscribeToConductors((items) => {
      setConductors(items);
      setLoading(false);
    });

    return () => {
      unsubBuses();
      unsubDrivers();
      unsubConductors();
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredBuses = useMemo(() => {
    if (!normalizedQuery) return buses;
    return buses.filter((bus) => {
      const haystack = [bus.id, bus.plateNumber, bus.route, bus.depot, bus.status, bus.assignedDriver, bus.assignedConductor]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [buses, normalizedQuery]);

  const filteredDrivers = useMemo(() => {
    if (!normalizedQuery) return drivers;
    return drivers.filter((driver) => {
      const haystack = [driver.id, driver.name, driver.licenseNumber, driver.phone, driver.busId, driver.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [drivers, normalizedQuery]);

  const filteredConductors = useMemo(() => {
    if (!normalizedQuery) return conductors;
    return conductors.filter((conductor) => {
      const haystack = [conductor.id, conductor.name, conductor.employeeId, conductor.phone, conductor.busId, conductor.shift, conductor.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [conductors, normalizedQuery]);

  const selectedItem = useMemo(() => {
    const registryMap = {
      bus: buses,
      driver: drivers,
      conductor: conductors,
    };

    return registryMap[selected.type]?.find((item) => item.id === selected.id) || null;
  }, [buses, conductors, drivers, selected]);

  useEffect(() => {
    if (selectedItem) return;

    if (filteredBuses.length > 0) {
      setSelected({ type: "bus", id: filteredBuses[0].id });
      return;
    }

    if (filteredDrivers.length > 0) {
      setSelected({ type: "driver", id: filteredDrivers[0].id });
      return;
    }

    if (filteredConductors.length > 0) {
      setSelected({ type: "conductor", id: filteredConductors[0].id });
    }
  }, [filteredBuses, filteredConductors, filteredDrivers, selectedItem]);

  const counts = [
    { label: "Registered buses", value: buses.length, tone: "orange" },
    { label: "Drivers on file", value: drivers.length, tone: "blue" },
    { label: "Conductors on file", value: conductors.length, tone: "green" },
  ];

  const renderList = (type, title, items) => (
    <section className="registry-section">
      <div className="registry-section-header">
        <div>
          <p className="registry-kicker">{title}</p>
          <h3>{items.length} records</h3>
        </div>
      </div>

      <div className="registry-list">
        {items.length === 0 ? (
          <div className="registry-empty">No {title.toLowerCase()} match your search.</div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`registry-row ${selected.type === type && selected.id === item.id ? "active" : ""}`}
              onClick={() => setSelected({ type, id: item.id })}
            >
              <span className="registry-row-title">{registryItemLabel(type, item)}</span>
              <span className="registry-row-meta">{type === "bus" ? item.route : type === "driver" ? item.busId : item.shift}</span>
            </button>
          ))
        )}
      </div>
    </section>
  );

  return (
    <div className="registry-portal">
      <header className="registry-hero">
        <div>
          <p className="registry-eyebrow">Operations registry</p>
          <h1>Registered buses, drivers, and conductors</h1>
          <p className="registry-subtitle">
            One place to review the active transport fleet and the staff assigned to each vehicle.
          </p>
        </div>

        <label className="registry-search">
          <span>Search registry</span>
          <input
            type="search"
            placeholder="Bus ID, route, driver, conductor..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </header>

      <div className="registry-stats">
        {counts.map((stat) => (
          <article key={stat.label} className={`registry-stat ${stat.tone}`}>
            <span className="registry-stat-label">{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="registry-status">
        <span className={`registry-dot ${isFirebaseConfigured ? "online" : "offline"}`} />
        <p>
          {isFirebaseConfigured
            ? "Live registry is connected to Firestore collections for buses, drivers, and conductors."
            : "Local demo data is active. Add Firebase env vars and Firestore collections to switch this page to live data."}
        </p>
      </div>

      {loading ? (
        <div className="registry-loading">Loading registry data...</div>
      ) : (
        <div className="registry-body">
          <div className="registry-columns">
            {renderList("bus", "Registered buses", filteredBuses)}
            {renderList("driver", "Driver details", filteredDrivers)}
            {renderList("conductor", "Conductor details", filteredConductors)}
          </div>

          <aside className="registry-detail-panel">
            {selectedItem ? (
              <>
                <div className="registry-detail-header">
                  <p className="registry-kicker">Selected record</p>
                  <h2>{selectedItem.name || selectedItem.plateNumber || selectedItem.route || selectedItem.id}</h2>
                  <span className="registry-detail-subtitle">{selected.type.toUpperCase()}</span>
                </div>

                <dl className="registry-detail-grid">
                  {selected.type === "bus" && (
                    <>
                      <div><dt>Bus ID</dt><dd>{selectedItem.id}</dd></div>
                      <div><dt>Plate number</dt><dd>{selectedItem.plateNumber || "N/A"}</dd></div>
                      <div><dt>Route</dt><dd>{selectedItem.route || "N/A"}</dd></div>
                      <div><dt>Depot</dt><dd>{selectedItem.depot || "N/A"}</dd></div>
                      <div><dt>Capacity</dt><dd>{selectedItem.capacity || "N/A"}</dd></div>
                      <div><dt>Status</dt><dd>{selectedItem.status || "N/A"}</dd></div>
                      <div><dt>Last inspection</dt><dd>{selectedItem.lastInspection || "N/A"}</dd></div>
                      <div><dt>Assigned crew</dt><dd>{`${selectedItem.assignedDriver || "N/A"} / ${selectedItem.assignedConductor || "N/A"}`}</dd></div>
                    </>
                  )}

                  {selected.type === "driver" && (
                    <>
                      <div><dt>Driver ID</dt><dd>{selectedItem.id}</dd></div>
                      <div><dt>Name</dt><dd>{selectedItem.name || "N/A"}</dd></div>
                      <div><dt>License number</dt><dd>{selectedItem.licenseNumber || "N/A"}</dd></div>
                      <div><dt>Phone</dt><dd>{selectedItem.phone || "N/A"}</dd></div>
                      <div><dt>Assigned bus</dt><dd>{selectedItem.busId || "N/A"}</dd></div>
                      <div><dt>Experience</dt><dd>{selectedItem.experience || "N/A"}</dd></div>
                      <div><dt>Status</dt><dd>{selectedItem.status || "N/A"}</dd></div>
                    </>
                  )}

                  {selected.type === "conductor" && (
                    <>
                      <div><dt>Conductor ID</dt><dd>{selectedItem.id}</dd></div>
                      <div><dt>Name</dt><dd>{selectedItem.name || "N/A"}</dd></div>
                      <div><dt>Employee ID</dt><dd>{selectedItem.employeeId || "N/A"}</dd></div>
                      <div><dt>Phone</dt><dd>{selectedItem.phone || "N/A"}</dd></div>
                      <div><dt>Assigned bus</dt><dd>{selectedItem.busId || "N/A"}</dd></div>
                      <div><dt>Shift</dt><dd>{selectedItem.shift || "N/A"}</dd></div>
                      <div><dt>Status</dt><dd>{selectedItem.status || "N/A"}</dd></div>
                    </>
                  )}
                </dl>
              </>
            ) : (
              <div className="registry-empty-detail">Select a record to view the full details.</div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default FleetRegistryPage;