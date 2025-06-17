import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../api/useAxiosPrivate";

const CreateCategoryModal = ({ show, onClose, onCategoryCreated }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.post('/api/categories/', { name: name })
      console.log("Category created successfully");
      onCategoryCreated();
      setName("");
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
