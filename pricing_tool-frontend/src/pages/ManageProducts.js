import { useEffect, useState } from "react";
import SecondaryNavBar from "../components/SecondaryNavBar";
import { useAuth } from '../auth/AuthContext';
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import CreateProductModal from "../components/CreateProductModal";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../api/useAxiosPrivate";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [toggleValue, setToggleValue] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const authContext = useAuth();
  const role = authContext.role || 'buyer';
  const user_id = authContext.userid || "";
  const axiosPrivate = useAxiosPrivate();

  const isSelected = (product) =>
    selectedRows.some((row) => row.id === product.id);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (category = "", search = "") => {
    try {
        const params = {};
        if (category) params.category = category;
        if (search) params.search = search;

        const response = await axiosPrivate.get('/api/products/', { params });
        setProducts(response.data);
        setSelectedRows([]);
    } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login', { state: { from: location }, replace: true });
        } else {
          console.error("Failed to fetch product:", error);
          alert("Failed to fetch Products.");
        }
    }
  };

  const removeProduct = async (productId) => {
    try {
      await axiosPrivate.delete(`/api/products/${productId}/`);
      setSelectedRows([])
      fetchProducts();
    } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login', { state: { from: location }, replace: true });
        } else {
          console.error("Failed to remove product:", error);
          alert("Failed to remove Products.");
        }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosPrivate.get('/api/categories/');
      setCategories(response.data);
    } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login', { state: { from: location }, replace: true });
        } else {
          console.error("Failed to fetch Categories:", error);
          alert("Failed to fetch Categories.");
        }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const viewProduct = (product) => {
    setSelectedProduct(product);
    setModalMode("view");
    setShowModal(true);
  };

  const updateProduct = (product) => {
    setSelectedProduct(product);
    setModalMode("update");
    setShowModal(true);
  };


  return (
    <div className="container-fluid px-0">
      
      {/* Secondary Sub Nav */}
      <SecondaryNavBar
        title="Manage Products"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        onSearch={fetchProducts}
        categorysearch={fetchCategories}
        showAddCategory={role === 'admin'}
        showAddProduct={role === 'seller'}
        showDemandForecast={role !== 'buyer'}
        showToggle={role !== 'buyer'}
        toggleValue={toggleValue}
        setToggleValue={setToggleValue}
        selectedRows={selectedRows}
      />
            

      {/* Product Table */}
      <div className="container mt-4">
        <div className="table-responsive">
          <table className="table table-bordered table-striped w-100">
            <thead className="table-dark">
              <tr>
                { role !== 'buyer' && (
                <th>
                  {/* Master checkbox for select all */}
                  <input
                    type="checkbox"
                    checked={
                      products.length > 0 &&
                      selectedRows.length === products.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(products);
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                  />
                </th>)}
                {/* <th>Id</th> */}
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Stock</th>
                <th>Units Sold</th>
                <th>Rating</th>
                {toggleValue && <th>Demand Forecast</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product.id}
                    style={{
                      cursor: "pointer",
                      backgroundColor: isSelected(product) ? "#d1e7fd" : "inherit",
                    }}
                  >
                    { role !== 'buyer' && (
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected(product)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows([...selectedRows, product]);
                          } else {
                            setSelectedRows(
                              selectedRows.filter((row) => row.id !== product.id)
                            );
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td> )}
                    {/* <td>{product.id}</td> */}
                    <td>{product.name}</td>
                    <td>{product.category_detail.name}</td>
                    <td>{product.description}</td>
                    <td>{product.cost_price}</td>
                    <td>{product.selling_price}</td>
                    <td>{product.stock_available}</td>
                    <td>{product.units_sold}</td>
                    <td>{product.customer_rating}</td>
                    {toggleValue && <td>{product.demand_forecast}</td>}

                    <td>
                      <div className="d-flex align-items-center">
                          <button 
                            className="btn btn-sm me-2"
                            onClick={() => viewProduct(product)} >
                            <FaEye />
                          </button>
                        {(role === "admin" || user_id == product.seller) && (
                          <>
                            <button
                              className="btn btn-sm me-2"
                              title="Update"
                              onClick={() => updateProduct(product)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm "
                              title="Delete"
                              onClick={() => removeProduct(product.id)}
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={toggleValue ? 12 : 11} className="text-center">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <CreateProductModal
        show={showModal}
        onClose={handleCloseModal}
        categories={categories}
        mode={modalMode}
        product={selectedProduct}
        onProductCreated={fetchProducts}
      />
    </div>
  );
}
