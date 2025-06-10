import React, { useEffect, useState } from "react";
import { getPoducts } from "../api/Products";
import { getCategories } from "../api/Categories";
import SecondaryNavBar from "../components/SecondaryNavBar";
import { useAuth } from '../auth/AuthContext';

export default function PriceOptimization() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const authContext = useAuth();
  const token = authContext.token || sessionStorage.getItem("access_token") || "";

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (category = "", search = "") => {
    try {
      // const token = sessionStorage.getItem("access_token");
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      const response = await getPoducts(token, params);
      setProducts(response.data);
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
            }
          } else{
            console.error("Error fetching products:", error);
          }
        }
  };

  const fetchCategories = async () => {
  try {
    // const token = sessionStorage.getItem("access_token");
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


  return (
    <div className="container-fluid px-0">
      {/* Secondary Sub Nav */}
      <SecondaryNavBar
        title="Price Optimizer"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        onSearch={fetchProducts}
        showAddProduct={false}
        showDemandForecast={false}
      />

      {/* Product Table */}
      <div className="container mt-4">
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                {/* <th>Id</th> */}
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Optimized Price</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    {/* <td>{product.id}</td> */}
                    <td>{product.name}</td>
                    <td>{product.category_detail.name}</td>
                    <td>{product.description}</td>
                    <td>{product.cost_price}</td>
                    <td>{product.selling_price}</td>
                    <td>{product.optimized_price}</td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
