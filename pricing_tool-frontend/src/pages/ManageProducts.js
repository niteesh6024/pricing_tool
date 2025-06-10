import React, { useEffect, useState } from "react";
import { getPoducts, deleteProduct } from "../api/Products";
import { getCategories } from "../api/Categories";
import SecondaryNavBar from "../components/SecondaryNavBar";
import { useAuth } from '../auth/AuthContext';
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import CreateProductModal from "../components/CreateProductModal";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [toggleValue, setToggleValue] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  // const user_id = sessionStorage.getItem("userid") || "";
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const authContext = useAuth();
  const role = authContext.role || 'buyer';
  const user_id = authContext.userid || "";

  const isSelected = (product) =>
    selectedRows.some((row) => row.id === product.id);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (category = "", search = "") => {
    try {
      // const token = sessionStorage.getItem("access_token");
      const token = authContext.token || sessionStorage.getItem("access_token");
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      const response = await getPoducts(token, params);
      setProducts(response.data);
      setSelectedRows([])
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired, refreshing...");
        const newToken = await authContext.refreshAccessToken();
        if (newToken) {
          const params = {};
          if (category) params.category = category;
          if (search) params.search = search;
          const retryResponse = await getPoducts(newToken, params);
          setProducts(retryResponse.data);
          setSelectedRows([])
        }
      } else{
        console.error("Error fetching products:", error);
      }
    }
  };

  const removeProduct = async (productId) => {
    try {
      // const token = sessionStorage.getItem("access_token");
      const token = authContext.token || sessionStorage.getItem("access_token");
      await deleteProduct(token, productId);
      setSelectedRows([])
      fetchProducts();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await authContext.refreshAccessToken();
        if (newToken) {
          await deleteProduct(newToken, productId);
          setSelectedRows([]);
          fetchProducts();
        }
      } else {
      console.error("Error fetching categories:", error);
      }
    }
  };


  const fetchCategories = async () => {
    try {
      // const token = sessionStorage.getItem("access_token");
      const token = authContext.token || sessionStorage.getItem("access_token");
      const response = await getCategories(token);
      setCategories(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired, refreshing...");
        const newToken = await authContext.refreshAccessToken();
        if (newToken) {
          const retryResponse = await getCategories(newToken);
          setCategories(retryResponse.data);
        }
      } else {
        console.error("Error fetching categories:", error);
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
