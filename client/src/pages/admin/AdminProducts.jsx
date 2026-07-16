import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import * as marketplaceService from "../../services/marketplaceService";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await marketplaceService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await marketplaceService.deleteProduct(id);

      setProducts(products.filter((item) => item._id !== id));

      alert("Product deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Unable to delete product.");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Product Management
          </h1>

          <p className="text-gray-500">
            Manage all marketplace products
          </p>
        </div>

        <Link
          to="/admin/add-product"
          className="bg-green-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="bg-white p-5 rounded-xl shadow mb-5">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        {loading ? (
          <div className="text-center p-10">
            Loading Products...
          </div>
        ) : (
          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Image</th>

                <th className="p-4 text-left">Name</th>

                <th className="p-4 text-left">Category</th>

                <th className="p-4 text-left">Price</th>

                <th className="p-4 text-left">Stock</th>

                <th className="p-4 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredProducts.map((product) => (

                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4">
                    <img
                      src={
                        product.image ||
                        "https://via.placeholder.com/80"
                      }
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </td>

                  <td className="font-semibold">
                    {product.name}
                  </td>

                  <td>{product.category}</td>

                  <td>₹{product.price}</td>

                  <td>{product.stock}</td>

                  <td>

                    <div className="flex justify-center gap-4">

                      <Link
                        to={`/admin/edit-product/${product._id}`}
                      >
                        <Pencil
                          size={20}
                          className="text-blue-600 hover:text-blue-800"
                        />
                      </Link>

                      <button
                        onClick={() => deleteProduct(product._id)}
                      >
                        <Trash2
                          size={20}
                          className="text-red-600 hover:text-red-800"
                        />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminProducts;