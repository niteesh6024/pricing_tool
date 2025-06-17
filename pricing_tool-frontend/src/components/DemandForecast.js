import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title,
} from "chart.js";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../api/useAxiosPrivate";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip, Title);

const DemandForecast = ({ show, onClose, products }) => {

  const [summary, setSummary] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchSummary = async () => {
      if (show && products.length > 0) {
        const context = products
          .map(
            (p) =>
              `${p.name} costs ₹${p.cost_price}, sells at ₹${p.selling_price}, sold ${p.units_sold} units, forecast demand is ${p.demand_forecast}.`
          )
          .join(" ");
        try {
          const response = await axiosPrivate.post('/api/summarize/', { context });
          setSummary(response.data.summary);
          console.log("Summary fetched:", response.data.summary);
        } catch (error) {
            if (error.response && error.response.status === 401) {
              navigate('/login', { state: { from: location }, replace: true });
            } else {
              console.error("Failed to get summary:", error);
            }
        }
      }
    };
    setSummary("");
    fetchSummary();
  }, [show, products]);

  if (!show) return null;

  const labels = products.map((product) => product.name);
  const demandData = products.map((product) => product.demand_forecast);
  const priceData = products.map((product) => product.selling_price);


  const data = {
    labels,
    datasets: [
      {
        label: "Demand Forecast",
        data: demandData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
      {
        label: "Selling Price",
        data: priceData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Forecasted Demand vs Selling Price",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
      x: {
        title: {
          display: true,
          text: "Product",
        },
      },
    },
  };


  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content p-4">
          <h5 className="mb-3">Forecast Chart</h5>

          <Line data={data} options={options} />

          <div className="alert alert-info p-3 mb-4">
            <h6>Summary</h6>
            <p>{summary || "Loading summary..."}</p>
          </div>

          <div className="container mt-4">
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Cost Price</th>
                    <th>Selling Price</th>
                    <th>Units Sold</th>
                    <th>Demand Forecast</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.category_detail.name}</td>
                        <td>{product.cost_price}</td>
                        <td>{product.selling_price}</td>
                        <td>{product.units_sold}</td>
                        <td>{product.demand_forecast}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandForecast;
