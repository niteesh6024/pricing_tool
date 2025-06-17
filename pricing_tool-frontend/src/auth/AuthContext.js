import { createContext, useState, useContext} from "react";
import { jwtDecode } from "jwt-decode";
import { apiClient } from "../api/ApiClient";

export const AuthContext = createContext();
export const useAuth =() => useContext(AuthContext)

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [userid, setUserid] = useState("");

  async function login(username, password, role){
    try {
      const res = await apiClient.post('/api/login/', {
        username: username,
        password: password,}, {
          withCredentials: true
        });
      if(res.status===200){

        const decoded = jwtDecode(res.data.access);
        const userRole = decoded.role || role;
        const userId = decoded.user_id;

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

  const refreshAccessToken = async () => {
    try {
        const res = await apiClient.post('/api/token/refresh/', {}, {
          withCredentials: true
        });
        if (res.status === 200 && res.data.access) {
          setToken(res.data.access);
          return res.data.access;
        } else {
          await logout();
          return null;
        }
      } 
    catch (err) {
        await logout();
        return null;
      }
    }

  async function logout(){
    setIsAuthenticated(false);
    setUsername("");
    setRole('');
    setUserid("");
    setToken("");
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, username, role, userid, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
