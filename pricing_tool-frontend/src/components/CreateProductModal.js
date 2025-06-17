import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from '../auth/AuthContext';
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../api/useAxiosPrivate";

const CreateProductModal = ({ show, onClose, categories, onProductCreated, mode, product }) => {

  const authContext = useAuth();
  const userid = authContext.userid || "";
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
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
      if (mode === "create") {
        await axiosPrivate.post('/api/products/', formData);
      }
      else if (mode === "update") {
        await axiosPrivate.put(`/api/products/${product.id}/`, formData);
      }
      onProductCreated();
      resetFormData();
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login', { state: { from: location }, replace: true });
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
