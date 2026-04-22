import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { watchAuthState, logout } from "../services/auth";
import "./AdminLayout.css";

function AdminLayout() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsub = watchAuthState((fetchedUser) => {
            setUser(fetchedUser);
        });
        return () => unsub();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
    };

    return (
        <div className="admin-layout">
            <nav className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <img src="/ridesync-logo.svg" alt="Logo" style={{ width: 32 }} />
                    <h2>RideSync Ops</h2>
                </div>
                <div className="admin-nav">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}
                    >
                        Mission Control
                    </NavLink>
                    <NavLink
                        to="/admin/kyc"
                        className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}
                    >
                        Driver KYC Vault
                    </NavLink>
                    <NavLink
                        to="/admin/dispatch"
                        className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}
                    >
                        Command Center
                    </NavLink>
                </div>
                
                {/* Admin Profile & Logout Pane */}
                <div className="admin-profile-pane">
                    <div className="profile-details">
                        <div className="profile-avatar">
                            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div className="profile-text">
                            <strong>{user?.displayName || "Administrator"}</strong>
                            <span>{user?.email || "admin@ridesync.com"}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>
            <main className="admin-main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
