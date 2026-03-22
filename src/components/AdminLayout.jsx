import { NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
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
            </nav>
            <main className="admin-main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
