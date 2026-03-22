import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { logout } from "../services/auth";
import { db, isFirebaseConfigured, missingFirebaseEnv } from "../services/firebase";

function DashboardPage() {
  const [reports, setReports] = useState([]);
  const [operators, setOperators] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [weather, setWeather] = useState(null);
  const [alertForm, setAlertForm] = useState({ title: "", details: "", region: "Metro" });
  const [broadcastForm, setBroadcastForm] = useState({ message: "", region: "Metro" });

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      return;
    }

    const unsubscribeReports = onSnapshot(
      query(collection(db, "reports"), orderBy("createdAt", "desc")),
      (snapshot) => {
        setReports(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
      }
    );

    const unsubscribeOperators = onSnapshot(collection(db, "operators"), (snapshot) => {
      setOperators(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
    });

    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
    });

    const unsubscribeLogs = onSnapshot(
      query(collection(db, "logs"), orderBy("createdAt", "desc")),
      (snapshot) => {
        setLogs(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
      }
    );

    return () => {
      unsubscribeReports();
      unsubscribeOperators();
      unsubscribeUsers();
      unsubscribeLogs();
    };
  }, []);

  useEffect(() => {
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!key) {
      return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Manila&units=metric&appid=${key}`)
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch(() => setWeather(null));
  }, []);

  const reportCountByType = useMemo(() => {
    return reports.reduce(
      (acc, report) => {
        const key = report.type || "road";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      { road: 0, weather: 0, accident: 0 }
    );
  }, [reports]);

  const submitRoadAlert = async (event) => {
    event.preventDefault();
    if (!isFirebaseConfigured || !db) {
      return;
    }

    await addDoc(collection(db, "road_alerts"), {
      ...alertForm,
      status: "active",
      createdAt: serverTimestamp(),
      source: "admin-web",
    });

    await addDoc(collection(db, "logs"), {
      action: "create_road_alert",
      details: `Created alert: ${alertForm.title}`,
      createdAt: serverTimestamp(),
    });

    setAlertForm({ title: "", details: "", region: "Metro" });
  };

  const sendBroadcast = async (event) => {
    event.preventDefault();
    if (!isFirebaseConfigured || !db) {
      return;
    }

    await addDoc(collection(db, "broadcasts"), {
      ...broadcastForm,
      createdAt: serverTimestamp(),
      targetRole: "Operator",
    });

    await addDoc(collection(db, "logs"), {
      action: "broadcast_message",
      details: `Broadcast sent to ${broadcastForm.region}`,
      createdAt: serverTimestamp(),
    });

    setBroadcastForm({ message: "", region: "Metro" });
  };

  const toggleOperatorStatus = async (id, currentStatus) => {
    if (!isFirebaseConfigured || !db) {
      return;
    }

    const nextStatus = currentStatus === "active" ? "break" : "active";
    await updateDoc(doc(db, "operators", id), { status: nextStatus, updatedAt: serverTimestamp() });
  };

  const freezeUser = async (id, frozen) => {
    if (!isFirebaseConfigured || !db) {
      return;
    }

    await updateDoc(doc(db, "users", id), {
      frozen: !frozen,
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <h1>RideSync Control Center</h1>
          <p>Admin portal for operators, alerts, reports, and weather.</p>
          {!isFirebaseConfigured && (
            <p className="error-text">
              Firebase setup missing: {missingFirebaseEnv.join(", ")}. Add them to .env.
            </p>
          )}
        </div>
        <button onClick={logout} disabled={!isFirebaseConfigured}>Sign out</button>
      </header>

      <section className="stats-grid">
        <article className="card">
          <h3>Road Reports</h3>
          <p>{reportCountByType.road}</p>
        </article>
        <article className="card">
          <h3>Weather Alerts</h3>
          <p>{reportCountByType.weather}</p>
        </article>
        <article className="card">
          <h3>Accidents</h3>
          <p>{reportCountByType.accident}</p>
        </article>
        <article className="card">
          <h3>Operators Online</h3>
          <p>{operators.filter((operator) => operator.status === "active").length}</p>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <h2>Live Issue Map</h2>
          <p>Use your preferred provider (Mapbox/Google Maps) to plot report coordinates.</p>
          <a
            className="map-link"
            href="https://www.google.com/maps/search/road+issues"
            target="_blank"
            rel="noreferrer"
          >
            Open Live Map View
          </a>
          <ul>
            {reports.slice(0, 5).map((report) => (
              <li key={report.id}>
                <strong>{report.title || "Untitled report"}</strong> - {report.region || "Unknown region"}
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Weather Intelligence</h2>
          {!import.meta.env.VITE_OPENWEATHER_API_KEY && (
            <p>Add VITE_OPENWEATHER_API_KEY in .env to enable weather feed.</p>
          )}
          {weather?.main && (
            <>
              <p>Current: {weather.weather?.[0]?.description}</p>
              <p>Temperature: {weather.main.temp} C</p>
              <p>Humidity: {weather.main.humidity}%</p>
            </>
          )}
        </article>
      </section>

      <section className="grid three">
        <article className="card">
          <h2>Issue Reporting</h2>
          <form className="stack" onSubmit={submitRoadAlert}>
            <input
              value={alertForm.title}
              onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
              placeholder="Issue title"
              required
            />
            <textarea
              value={alertForm.details}
              onChange={(e) => setAlertForm({ ...alertForm, details: e.target.value })}
              placeholder="Issue details"
              required
            />
            <input
              value={alertForm.region}
              onChange={(e) => setAlertForm({ ...alertForm, region: e.target.value })}
              placeholder="Region"
              required
            />
            <button type="submit">Post Road Alert</button>
          </form>
        </article>

        <article className="card">
          <h2>Broadcast Messenger</h2>
          <form className="stack" onSubmit={sendBroadcast}>
            <textarea
              value={broadcastForm.message}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
              placeholder="Message to operators"
              required
            />
            <input
              value={broadcastForm.region}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, region: e.target.value })}
              placeholder="Target region"
              required
            />
            <button type="submit">Send Broadcast</button>
          </form>
        </article>

        <article className="card">
          <h2>Operator Status Toggle</h2>
          <ul className="status-list">
            {operators.map((operator) => (
              <li key={operator.id}>
                <span>{operator.name || operator.id}</span>
                <span className={`pill ${operator.status || "idle"}`}>{operator.status || "idle"}</span>
                <button onClick={() => toggleOperatorStatus(operator.id, operator.status || "idle")}>Toggle</button>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <h2>User Freeze Controls</h2>
          <ul className="status-list">
            {users.map((user) => (
              <li key={user.id}>
                <span>{user.displayName || user.email || user.id}</span>
                <span className={`pill ${user.frozen ? "break" : "active"}`}>
                  {user.frozen ? "Frozen" : "Active"}
                </span>
                <button onClick={() => freezeUser(user.id, !!user.frozen)}>
                  {user.frozen ? "Unfreeze" : "Freeze"}
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Admin Action Logs</h2>
          <ul>
            {logs.slice(0, 12).map((log) => (
              <li key={log.id}>
                <strong>{log.action}</strong>: {log.details}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

export default DashboardPage;