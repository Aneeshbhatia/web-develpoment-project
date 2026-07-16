import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getProducts,
} from "../services/marketplaceService";
import {
  addToCart,
} from "../services/cartService";

import {
  ShoppingCart,
  Search,
  Package,
  CheckCircle,
  Radio,
} from "lucide-react";

const HudStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
    .hud-root { font-family: 'Inter', sans-serif; }
    .hud-display { font-family: 'Space Grotesk', sans-serif; }
    .hud-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.02em; }

    .hud-panel {
      background: rgba(12,23,19,0.75);
      border: 1px solid #1C2B24;
      backdrop-filter: blur(6px);
    }
    .hud-panel:hover {
      border-color: rgba(107,255,184,0.35);
      box-shadow: 0 0 0 1px rgba(107,255,184,0.08), 0 12px 32px -12px rgba(0,0,0,0.6);
    }

    .hud-input {
      background: #0C1713;
      border: 1px solid #1C2B24;
      color: #EAF5EE;
    }
    .hud-input::placeholder { color: #5B6B63; }
    .hud-input:focus {
      outline: none;
      box-shadow: 0 0 0 1px rgba(107,255,184,0.4);
      border-color: rgba(107,255,184,0.4);
    }

    @keyframes hud-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.25; }
    }
    .hud-blink { animation: hud-blink 1.8s ease-in-out infinite; }
  `}</style>
);

const Marketplace = () => {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =============================
  // Load Products
  // =============================

  const loadProducts = async () => {

    try {

      const response = await getProducts();

      if (response.success) {
        setProducts(response.products);
      }

    } catch (error) {

      console.log(error);

      alert("Failed to load products");

    } finally {

      setLoading(false);

    }

  };

  // =============================
  // Add To Cart
  // =============================

  const handleAddToCart = async (productId) => {

    try {

      const response = await addToCart({
        productId,
        quantity: 1,
      });

      alert(response.message);

    } catch (error) {

      console.log(error);

      alert("Failed to add product");

    }

  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Derived, not stored in state — avoids an extra render per keystroke
  const filteredProducts = useMemo(() => {
    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, products]);

  if (loading) {

    return (

      <DashboardLayout>

        <div
          className="hud-root flex flex-col justify-center items-center h-[80vh] gap-3"
          style={{ backgroundColor: "#05100C" }}
        >
          <HudStyles />
          <Radio size={22} className="text-[#6BFFB8] hud-blink" />
          <h2 className="hud-mono text-lg text-[#6BFFB8] tracking-widest uppercase">
            Loading Products...
          </h2>
        </div>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      <div className="hud-root -m-8 p-8 min-h-screen" style={{ backgroundColor: "#05100C" }}>
        <HudStyles />

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="hud-display text-4xl font-semibold text-[#EAF5EE] flex items-center gap-3">
              <ShoppingCart className="text-[#6BFFB8]" />
              Marketplace
            </h1>
            <p className="text-[#6E877B] mt-2 hud-mono text-sm">
              Seeds, fertilizers and farming equipment.
            </p>
          </div>

        </div>

        {/* Search */}

        <div className="relative mb-8">
          <Search
            size={20}
            className="absolute left-4 top-4 text-[#5B6B63]"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="hud-input w-full rounded-xl p-4 pl-12 transition"
          />
        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Total Products</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#6BFFB8] mt-2">
              {products.length}
            </h2>
          </div>

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Categories</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#4FD1FF] mt-2">
              {new Set(products.map((item) => item.category)).size}
            </h2>
          </div>

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Available Products</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#FFC163] mt-2">
              {products.filter((item) => item.stock > 0).length}
            </h2>
          </div>

        </div>

        {/* Products */}

        {filteredProducts.length === 0 ? (

          <div className="hud-panel rounded-3xl p-12 text-center">
            <ShoppingCart size={56} className="mx-auto text-[#6BFFB8]/60 mb-4" />
            <h2 className="hud-display text-3xl font-semibold text-[#EAF5EE]">
              No Products Found
            </h2>
            <p className="text-[#6E877B] mt-3 hud-mono text-sm">
              Try another search keyword.
            </p>
          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {filteredProducts.map((product) => (

              <div
                key={product._id}
                className="hud-panel rounded-3xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
              >

                {/* Product Image */}

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />

                {/* Product Details */}

                <div className="p-6">

                  <div className="flex justify-between items-start">

                    <div>
                      <h2 className="hud-display text-2xl font-semibold text-[#EAF5EE]">
                        {product.name}
                      </h2>

                      <span className="inline-block mt-2 bg-[#6BFFB8]/10 text-[#6BFFB8] ring-1 ring-[#6BFFB8]/30 px-3 py-1 rounded-full text-xs hud-mono">
                        {product.category}
                      </span>
                    </div>

                    {product.stock > 0 ? (
                      <CheckCircle
                        size={24}
                        className="text-[#6BFFB8]"
                      />
                    ) : (
                      <span className="text-[#FF6B6B] font-semibold text-sm hud-mono">
                        OUT
                      </span>
                    )}

                  </div>

                  <p className="text-[#B7C7BE] mt-4 line-clamp-3 text-sm">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center mt-6">

                    <div>
                      <p className="hud-mono text-3xl font-semibold text-[#4FD1FF]">
                        ₹{product.price}
                      </p>

                      <p
                        className={`mt-2 text-sm hud-mono ${
                          product.stock > 0
                            ? "text-[#6BFFB8]"
                            : "text-[#FF6B6B]"
                        }`}
                      >
                        Stock: {product.stock}
                      </p>
                    </div>

                    <Package
                      size={38}
                      className="text-[#6BFFB8]/70"
                    />

                  </div>

                  {/* Add To Cart */}

                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0}
                    className={`w-full mt-6 py-3 rounded-xl flex justify-center items-center gap-2 transition hud-display font-medium ${
                      product.stock > 0
                        ? "bg-[#6BFFB8]/15 hover:bg-[#6BFFB8]/25 text-[#6BFFB8] ring-1 ring-[#6BFFB8]/40"
                        : "bg-white/5 text-[#5B6B63] cursor-not-allowed ring-1 ring-white/10"
                    }`}
                  >
                    <ShoppingCart size={18} />
                    {product.stock > 0 ? "Add To Cart" : "Out of Stock"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}
      </div>

    </DashboardLayout>

  );

};

export default Marketplace;