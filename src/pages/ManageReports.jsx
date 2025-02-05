import React, { useState } from "react";
import useAuth from "../hooks/useAuth";

function ManageReports() {
  const { hasRole, getToken } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async (endpoint) => {
    try {
      setIsLoading(true);
      setError(null);
      setReportData(null); // Clear previous data before fetching

      const token = getToken();
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch report.");
      }

      const data = await response.json();
      console.log("Fetched Data:", data); // Debugging output

      if (Array.isArray(data)) {
        // Convert API response to expected structure
        const formattedProducts = data.map((item, index) => ({
          productId: index + 1, // Mock ID since the API does not provide it
          productName: item.mostSellingProductName,
          totalSales: item.mostSellingProductQuantity,
          totalRevenue: item.totalEarnings,
        }));

        setReportData({ products: formattedProducts });
      } else if (typeof data === "object" && Object.keys(data).length > 0) {
        // Remove unwanted fields and set report data
        const { mostSellingProductQuantity, ...filteredData } = data;
        setReportData(filteredData);
      } else {
        setReportData({ message: "No report data available." });
      }
    } catch (err) {
      console.error("Error fetching report:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const API_VERSION = "v1";
  const formatDate = (date) => date.toISOString().split("T")[0];

  const handleDailyReport = () => {
    const date = formatDate(new Date());
    fetchReport(`http://localhost:5300/api/${API_VERSION}/report/daily?date=${date}`);
  };

  const handleMonthlyReport = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    fetchReport(`http://localhost:5300/api/${API_VERSION}/report/monthly?month=${month}&year=${year}`);
  };

  const handleTopSellingReport = () => {
    fetchReport(`http://localhost:5300/api/${API_VERSION}/report/top-selling?count=5`);
  };

  const formatValue = (key, value) => {
    if (typeof value === "number") {
      if (key.toLowerCase().includes("price") || key.toLowerCase().includes("revenue")) {
        return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  if (!hasRole("Admin") && !hasRole("AdvancedUser")) {
    return <div className="p-4 text-red-500">You do not have permission to view this page.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📈 Sales Reports Dashboard</h2>

      {/* Report Controls */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 flex-1"
          onClick={handleDailyReport}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "📅 Daily Report"}
        </button>

        <button
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 flex-1"
          onClick={handleMonthlyReport}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "📆 Monthly Report"}
        </button>

        <button
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 flex-1"
          onClick={handleTopSellingReport}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "🏆 Top Sellers (Top 5)"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <span className="text-red-700 font-medium">Error: {error}</span>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Generating report...</p>
        </div>
      )}

      {/* Report Display */}
      {reportData && !isLoading && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">Report Details</h3>
          </div>

          <div className="p-6">
            {reportData.products ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportData.products.map((product, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800">
                      #{index + 1} {product.productName || "Unknown Product"}
                    </h4>
                    <p className="text-lg font-bold text-purple-600">
                      Sold: {product.totalSales?.toLocaleString() || 0}</p>
                  </div>
                ))}
              </div>
            ) : reportData.message ? (
              <p className="text-gray-600">{reportData.message}</p>
            ) : (
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(reportData).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {formatValue(key, value)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageReports;