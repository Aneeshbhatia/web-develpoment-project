import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import * as marketplaceService from "../../services/marketplaceService";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState({
    name: "",
    category: "Seeds",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const response = await marketplaceService.getProduct(id);

      if (response.success) {
        setProduct(response.product);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to load product.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await marketplaceService.updateProduct(id, product);

      if (response.success) {
        alert("Product Updated Successfully");
        navigate("/admin/products");
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to update product.");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <h2 className="text-2xl font-semibold">
            Loading Product...
          </h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          Edit Product
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
              className="w-full mt-2 border rounded-lg p-3"
              required
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
              className="w-full mt-2 border rounded-lg p-3"
            >
              <option value="Seeds">Seeds</option>
              <option value="Fertilizer">Fertilizer</option>
              <option value="Pesticide">Pesticide</option>
              <option value="Equipment">Equipment</option>
              <option value="Tools">Tools</option>
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
              className="w-full mt-2 border rounded-lg p-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">

            <div>
              <label className="font-semibold">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full mt-2 border rounded-lg p-3"
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
                className="w-full mt-2 border rounded-lg p-3"
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
              className="w-full mt-2 border rounded-lg p-3"
            />
          </div>

          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-60 h-60 rounded-lg object-cover border"
            />
          )}

          <div className="flex gap-4">

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
            >
              Update Product
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </AdminLayout>
  );
};

export default EditProduct;