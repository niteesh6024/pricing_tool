import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import WelcomePage from './pages/WelcomePage';
import ManageProducts from './pages/ManageProducts';
import PriceOptimization from "./pages/PriceOptimization";
import HeaderComponent from "./components/HeaderComponent";
import AuthProvider, { useAuth } from "./auth/AuthContext";
import { Navigate } from "react-router-dom";

function AuthenticatedRoute({children}){
  const {isAuthenticated} = useAuth()

  if (isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}

function App() {
  return (
    <div className="pricing-tool-app">
      <AuthProvider>
        <Router>
          <HeaderComponent />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/welcome" element={
              <AuthenticatedRoute>
                <WelcomePage />
              </AuthenticatedRoute>
            }/>
            <Route path="/manage-products" element={
              <AuthenticatedRoute> 
                <ManageProducts />
              </AuthenticatedRoute>
            } />
            <Route path="/price-optimization" element={
              <AuthenticatedRoute> 
                <PriceOptimization />
              </AuthenticatedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
     </div>
  );
}

export default App;
