import { createContext, useState, useEffect, useContext} from "react";
import { authenticateUser, refreshToken } from "../api/User";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();
export const useAuth =() => useContext(AuthContext)

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [userid, setUserid] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    const storedUsername = localStorage.getItem("username");
    const storedToken = localStorage.getItem("access_token");
    const storedrole = localStorage.getItem("role");
    const storedUserid = localStorage.getItem("userid");
    setIsAuthenticated(storedAuth || false)
    setUsername(storedUsername || "");
    setToken(storedToken || "");
    setRole(storedrole || "");
    setUserid(storedUserid || "");
    setLoading(false);
  }, []);

  async function login(username, password, role){
    try {
      const res = await authenticateUser(username, password);
      if(res.status===200){
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", username);

        const decoded = jwtDecode(res.data.access);
        const userRole = decoded.role || role;
        const userId = decoded.user_id;
        localStorage.setItem("role", userRole);
        localStorage.setItem("userid", userId);

        setIsAuthenticated(true);
        setUsername(username);
        setRole(userRole);
        setToken(res.data.access);
        setUserid(userId);

      }
      else{
        await logout();
        return false
      }
    } 
    catch (err) {
      alert("Login failed! Please check your credentials.");
      await logout();
      return false; 
    }
    return true;
  }

  async function refreshAccessToken() {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) {
      await logout();
      return null;
    }
    try {
      const res = await refreshToken(refresh_token);
      if (res.status === 200 && res.data.access) {
        localStorage.setItem("access_token", res.data.access);
        setToken(res.data.access);
        return res.data.access;
      } else {
        await logout();
        return null;
      }
    } catch (err) {
      await logout();
      return null;
    }
  }

  async function logout(){
    setIsAuthenticated(false);
    setUsername("");
    setRole('');
    setUserid("");
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, username, role, userid, login, logout, refreshAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
