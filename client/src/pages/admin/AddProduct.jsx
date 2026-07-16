import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import * as marketplaceService from "../../services/marketplaceService";

const AddProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "Seeds",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await marketplaceService.addProduct(product);

      alert("✅ Product Added Successfully");

      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto bg-white shadow rounded-xl p-8">

        <h1 className="text-3xl font-bold mb-8">
          Add New Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>
            <label className="font-semibold">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              Category
            </label>

            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
            >
              <option>Seeds</option>
              <option>Fertilizer</option>
              <option>Pesticide</option>
              <option>Equipment</option>
              <option>Tools</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={product.description}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="font-semibold">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

          </div>

          <div>
            <label className="font-semibold">
              Image URL
            </label>

            <input
              type="text"
              name="image"
              value={product.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          {product.image && (
            <div>
              <p className="mb-2 font-semibold">
                Preview
              </p>

              <img
                src={product.image}
                alt="Preview"
                className="w-56 h-56 rounded-lg object-cover border"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

        </form>

      </div>
    </AdminLayout>
  );
};

export default AddProduct;