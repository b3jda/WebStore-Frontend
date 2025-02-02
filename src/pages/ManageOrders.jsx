import React, { useState, useEffect } from "react";

function ManageOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState({ orderId: "", status: "" });

  const API_VERSION = "v1"; // Define API version

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5205/api/${API_VERSION}/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders.");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleChangeOrderStatus = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5205/api/${API_VERSION}/order/${orderStatus.orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(parseInt(orderStatus.status)),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status.");
      }

      console.log("Order status updated successfully.");
      fetchOrders(); // Refresh the orders after updating status
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (user?.roles.includes("Admin")) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-2 px-4 border-b">{order.id}</td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">${order.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <form onSubmit={handleChangeOrderStatus} className="mt-4">
          <input
            type="text"
            placeholder="Order ID"
            value={orderStatus.orderId}
            onChange={(e) => setOrderStatus({ ...orderStatus, orderId: e.target.value })}
            className="border p-2 rounded mb-2"
            required
          />
          <select
            value={orderStatus.status}
            onChange={(e) => setOrderStatus({ ...orderStatus, status: e.target.value })}
            className="border p-2 rounded mb-2"
            required
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="0">Pending</option>
            <option value="1">Processing</option>
            <option value="2">Shipped</option>
            <option value="3">Delivered</option>
            <option value="4">Cancelled</option>
            <option value="5">Completed</option>
          </select>
          <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700">
            Update Status
          </button>
        </form>
      </div>
    );
  } else if (user?.roles.includes("AdvancedUser")) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">View Orders</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-2 px-4 border-b">{order.id}</td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">${order.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    return <div className="p-4">You do not have permission to view this page.</div>;
  }
}

export default ManageOrders;