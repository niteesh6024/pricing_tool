import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import CreateProduct from "./CreateProduct";
import DemandForecast from "./DemandForecast";
import CreateProductModal from "./CreateProductModal";

const SecondaryNavBar = ({
  title,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  onSearch,
  showAddProduct = false,
  showDemandForecast = false,
  showToggle = false,
  toggleValue,
  setToggleValue,
  selectedRows = [],
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showForcast, setShowForcast] = useState(false);

  return (
    <div className="navbar navbar-expand-lg navbar-light bg-light border-bottom px-4 py-2 d-flex justify-content-between align-items-center w-100">

        {/* Back Button */}
        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* Page Title */}
        <h5 className="mb-0 text-center flex-grow-1">{title}</h5>

        {showToggle && (
          <div className="form-check form-switch me-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="customToggle"
              checked={toggleValue}
              onChange={() => setToggleValue(!toggleValue)}
            />
            <label className="form-check-label ms-1" htmlFor="customToggle">
              demand forecast
            </label>
          </div>
        )}

        {/* Search Input */}
        <input
          type="text"
          className="form-control me-2"
          style={{ width: "200px" }}
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;
            setSearchQuery(value);
            onSearch(selectedCategory, value);
          }}
        />

        {/* Category Filter */}
        <div className="d-flex align-items-center me-2">
          <span className="me-2">Category:</span>
          <select
            className="form-select"
            style={{ width: "160px" }}
            value={selectedCategory}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCategory(value);
              onSearch(value, searchQuery);
            }}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Optional Buttons */}
        {showAddProduct && (
          <button
            className="btn btn-primary me-2"
            onClick={() => setShowModal(true)}
          >
            Add Product
          </button>
        )}
        {showDemandForecast && (
          <button
            className="btn btn-secondary"
            onClick={() => setShowForcast(true)}
            disabled={selectedRows.length === 0}
          >
            Demand Forecast
          </button>
        )}

       <CreateProductModal
        show={showModal}
        onClose={() => setShowModal(false)}
        categories={categories}
        onProductCreated={onSearch}
        mode="create"
      />

       <DemandForecast
        show={showForcast}
        onClose={() => setShowForcast(false)}
        products={selectedRows}
      />
    </div>
  );
};

export default SecondaryNavBar;
