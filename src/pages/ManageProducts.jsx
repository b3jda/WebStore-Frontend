import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

function ManageProducts() {
  const { hasRole } = useAuth(); 
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    categoryName: "",
    brandName: "",
    sizeName: "",
    genderName: "",
    colorName: "",
  });
  const [discount, setDiscount] = useState({ productId: "", percentage: 0 });
  const [removeDiscount, setRemoveDiscount] = useState({ productId: "" }); 

  const API_VERSION = "v1";
  const API_BASE_URL = `http://localhost:5300/api/${API_VERSION}`; 
  
  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/product`); 
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  
  // Add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${API_BASE_URL}/product`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(newProduct),
      });
  
      if (response.ok) {
        alert("Product added successfully!");
        fetchProducts(); 
        setNewProduct({
          name: "",
          description: "",
          price: 0,
          quantity: 0,
          categoryName: "",
          brandName: "",
          sizeName: "",
          genderName: "",
          colorName: "",
        });
      } else {
        throw new Error("Failed to add product.");
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(
        `${API_BASE_URL}/product/apply-discount/${discount.productId}`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify(discount.percentage), 
        }
      );
  
      if (response.ok) {
        alert("Discount applied successfully!");
        fetchProducts(); 
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to apply discount.");
      }
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };
  
  // Remove a discount from a product
  const handleRemoveDiscount = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(
        `${API_BASE_URL}/product/remove-discount/${removeDiscount.productId}`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
      if (response.ok) {
        alert("Discount removed successfully!");
        fetchProducts(); 
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to remove discount.");
      }
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);

  
  if (!hasRole("Admin") && !hasRole("AdvancedUser")) {
    return <p className="text-red-500 font-bold">You do not have permission to view this page.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Manage Products</h2>

      {/* Add Product Form */}
      {(hasRole("Admin") || hasRole("AdvancedUser")) && (
        <form onSubmit={handleAddProduct} className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Add New Product</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 h-32"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                <input
                  type="number"
                  min="0"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={newProduct.categoryName}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  value={newProduct.brandName}
                  onChange={(e) => setNewProduct({ ...newProduct, brandName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <input
                  type="text"
                  value={newProduct.sizeName}
                  onChange={(e) => setNewProduct({ ...newProduct, sizeName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <input
                  type="text"
                  value={newProduct.genderName}
                  onChange={(e) => setNewProduct({ ...newProduct, genderName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="text"
                value={newProduct.colorName}
                onChange={(e) => setNewProduct({ ...newProduct, colorName: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Add Product
            </button>
          </div>
        </form>
      )}

      {/* Apply Discount Form */}
      {hasRole("Admin") && (
        <form onSubmit={handleApplyDiscount} className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Apply Discount</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product ID *</label>
              <input
                type="text"
                value={discount.productId}
                onChange={(e) => setDiscount({ ...discount, productId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage (%) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={discount.percentage}
                onChange={(e) => setDiscount({ ...discount, percentage: parseFloat(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Apply Discount
            </button>
          </div>
        </form>
      )}

      {/* Remove Discount Form */}
      {hasRole("Admin") && (
        <form onSubmit={handleRemoveDiscount} className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Remove Discount</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product ID *</label>
              <input
                type="text"
                value={removeDiscount.productId}
                onChange={(e) => setRemoveDiscount({ ...removeDiscount, productId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Remove Discount
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ManageProducts;
