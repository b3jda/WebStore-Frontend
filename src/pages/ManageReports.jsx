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
      setError(null); // Reset error state
      const token = getToken();
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch report.");
      }
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching report:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const API_VERSION = "v1";

  // Function to format date as YYYY-MM-DD (without time)
  const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // Extracts only the date part
  };

  const handleDailyReport = () => {
    const date = formatDate(new Date()); // Get only the date part
    const endpoint = `http://localhost:5300/api/${API_VERSION}/report/daily?date=${date}`;
    fetchReport(endpoint);
  };

  
  const handleMonthlyReport = (month, year) => {
    const endpoint = `http://localhost:5300/api/${API_VERSION}/report/monthly?month=${month}&year=${year}`;
    fetchReport(endpoint);
  };

  const handleTopSellingReport = (count) => {
    const endpoint = `http://localhost:5300/api/${API_VERSION}/report/top-selling?count=${count}`;
    fetchReport(endpoint);
  };

  if (!hasRole("Admin") && !hasRole("AdvancedUser")) {
    return <div className="p-4 text-red-500">You do not have permission to view this page.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Reports</h2>

      {/* Buttons to Generate Reports */}
      <div className="mb-8 space-y-4">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={handleDailyReport}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Daily Report"}
        </button>

        <button
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => handleMonthlyReport(2, 2025)} 
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Monthly Report (Feb 2025)"}
        </button>

        <button
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => handleTopSellingReport(2)}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Top Selling Products Report (Top 2)"}
        </button>
      </div>

      {/* Display Report Data */}
      <div className="mt-8">
        {error && <p className="text-red-500 text-sm mb-4">Error: {error}</p>}
        {reportData ? (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Report Data</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-gray-700">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500">No report data available. Generate a report to view data.</p>
        )}
      </div>
    </div>
  );
}

export default ManageReports;