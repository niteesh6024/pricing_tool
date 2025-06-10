// src/components/CreateProductModal.jsx
import React, { use, useState } from "react";
import { createProduct, putProduct } from "../api/Products";
import { useEffect } from "react";
import { useAuth } from '../auth/AuthContext';

const CreateProductModal = ({ show, onClose, categories, onProductCreated, mode, product }) => {
  // const userid = sessionStorage.getItem("userid") || "";
  const authContext = useAuth();
  const userid = useAuth().userid || "";
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost_price: "",
    selling_price: "",
    category: "",
    stock_available: "",
    units_sold: "",
    customer_rating: "",
    seller: userid,
  });

  useEffect(() => {
    if (product && (mode === "update" || mode === "view")) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        cost_price: product.cost_price || "",
        selling_price: product.selling_price || "",
        category: product.category || "",
        stock_available: product.stock_available || "",
        units_sold: product.units_sold || "",
        customer_rating: product.customer_rating || "",
        seller: product.seller || userid,
      });
    }
  }, [mode, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFormData = () => {
    setFormData({
      name: "",
      description: "",
      cost_price: "",
      selling_price: "",
      category: "",
      stock_available: "",
      units_sold: "",
      customer_rating: "",
      seller: userid,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const token = sessionStorage.getItem("access_token");
      const token = authContext.token || "";
      if (mode === "create") {
        await createProduct(token, formData);}
      else if (mode === "update") {
        await putProduct(token, product.id, formData);
      }
      onProductCreated();
      resetFormData();
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired, refreshing...");
        const newToken = await authContext.refreshAccessToken();
        if (newToken) {
          if (mode === "create") {
            await createProduct(newToken, formData);
          } else if (mode === "update") {
            await putProduct(newToken, product.id, formData);
          }
          onProductCreated();
          resetFormData();
          onClose();
        }
      } else {
        console.error("Failed to create product:", error);
        alert("Failed to create product. Check the form.");
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
              <h5 className="modal-title">{mode} product</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <input type="text" name="name" placeholder="Name" className="form-control" value={formData.name} onChange={handleChange} required readOnly={mode === "view"}/>
                </div>
                <div className="col-md-6">
                  <input type="text" name="description" placeholder="Description" className="form-control" value={formData.description} onChange={handleChange} required readOnly={mode === "view"}/>
                </div>
                <div className="col-md-4">
                  <input type="number" name="cost_price" placeholder="Cost Price" className="form-control" value={formData.cost_price} onChange={handleChange} required readOnly={mode === "view"}/>
                </div>
                <div className="col-md-4">
                  <input type="number" name="selling_price" placeholder="Selling Price" className="form-control" value={formData.selling_price} onChange={handleChange} required readOnly={mode === "view"}/>
                </div>
                <div className="col-md-4">
                  <select name="category" className="form-select" value={formData.category} onChange={handleChange} required disabled={mode === "view"}>
                    <option value="">
                      {mode === "update" || mode === "view"
                        ? product.category_detail.name || "Select Category"
                        : "Select Category"} 
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <input type="number" name="stock_available" placeholder="Stock Available" className="form-control" value={formData.stock_available} onChange={handleChange} required readOnly={mode === "view"}/>
                </div>
                <div className="col-md-4">
                  <input type="number" name="units_sold" placeholder="Units Sold" className="form-control" value={formData.units_sold} onChange={handleChange} required readOnly={mode === "view"}/>
                </div>
                <div className="col-md-4">
                  <input type="number" step="0.1" name="customer_rating" placeholder="Rating" className="form-control" value={formData.customer_rating} onChange={handleChange} required readOnly={mode === "view"}/>
                </div>
              </div>
            </div>
            <div className="modal-footer">
                {mode !== "view" && (
                  <button type="submit" className="btn btn-success">
                    {mode === "update" ? "Update" : "Create"}
                  </button>
                )}
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
