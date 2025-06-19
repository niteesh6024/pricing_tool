import React from 'react';
import { useLinkClickHandler } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../auth/AuthContext';
import { FaArrowRight } from 'react-icons/fa';

export default function WelcomePage() {

  const authContext = useAuth();
  const role = authContext.role || 'buyer';

  const handleManageClick = useLinkClickHandler('/manage-products');
  const handleOptimizeClick = useLinkClickHandler('/price-optimization');

  return (
    <div className="container text-center mt-5">
  <h1 className="mb-4">Hi, {authContext.username} </h1>
  <h2 className="mb-4">Welcome to the Price Optimization Tool</h2>

  <div className="row justify-content-center align-items-stretch">
    <div className="col-md-4 mb-3 d-flex">
      <div className="card shadow-sm h-100 w-100" style={{ cursor: 'pointer' }} onClick={handleManageClick}>
        <div className="card-body d-flex flex-column justify-content-center">
          <h5 className="card-title">Create and Manage Products</h5>
          <p className="card-text">Add new products, and update product information.</p>
            <div className="text-end mt-auto">
              <FaArrowRight size={24} color="#333" />
            </div>
        </div>
      </div>
    </div>

    {role !== 'buyer' && 
      <div className="col-md-4 mb-3 d-flex">
        <div className="card shadow-sm h-100 w-100" style={{ cursor: 'pointer' }} onClick={handleOptimizeClick}>
          <div className="card-body d-flex flex-column justify-content-center">
            <h5 className="card-title">Price Optimization</h5>
            <p className="card-text">Analyze data to suggest optimized prices for your products.</p>
            <div className="text-end mt-auto">
              <FaArrowRight size={24} color="#333" />
            </div>
          </div>
        </div>
      </div>
    }
  </div>
</div>

  );
}

