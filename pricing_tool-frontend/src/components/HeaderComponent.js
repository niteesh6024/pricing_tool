import { Link } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from '../auth/AuthContext';
import "../css/Login.css";

export default function HeaderComponent() {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const username = localStorage.getItem("username");

    const authContext =useAuth()
    console.log("authContext", authContext)

    async function logout(){
        await authContext.logout()
    }

    return (
        <header className="mb-0">
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4 py-2">
                <div className="container-fluid">
                    <Link className="navbar-brand fw-bold fs-3" to="/welcome">
                        Price Optimization Tool
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarContent"
                        aria-controls="navbarContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-between" id="navbarContent">
                        
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            {isAuthenticated ? (
                                <>
                                    <li className="nav-item nav-link fs-6 text-secondary">
                                        Hello, <strong>{username}</strong>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-outline-danger ms-3" onClick={logout}>
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn btn-primary" to="/register">Register</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
