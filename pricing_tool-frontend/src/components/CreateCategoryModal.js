import React, { useState } from "react";
import { createCategory } from "../api/Categories";
import { useAuth } from '../auth/AuthContext';

const CreateCategoryModal = ({ show, onClose, onCategoryCreated }) => {
  const authContext = useAuth();
  const [name, setName] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = authContext.token || "";
      await createCategory(token, { name: name });
      console.log("Category created successfully");
      onCategoryCreated();
      setName("");
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired, refreshing...");
        const newToken = await authContext.refreshAccessToken();
        if (newToken) {
          await createCategory(newToken, { name :  name });
          onCategoryCreated();
          setName("");
          onClose();
        }
      } else {
        console.error("Failed to create category:", error);
        alert("Failed to create category. Check the form.");
      }
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Category</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <input type="text" name="name" placeholder="Name" className="form-control" value={name} onChange={handleChange} required />
                </div>
              </div>
            </div>
            <div className="modal-footer">
                <button type="submit" className="btn btn-success">
                  create
                </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
