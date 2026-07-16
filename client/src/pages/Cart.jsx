import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

import {
  getCart,
  updateCart,
  removeCartItem,
  clearCart,
} from "../services/cartService";

import { placeOrder } from "../services/orderService";

import {
  ShoppingCart,
  Package,
  Trash2,
  Plus,
  Minus,
  Radio,
} from "lucide-react";

const HudStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .hud-root{
      font-family:'Inter',sans-serif;
    }

    .hud-display{
      font-family:'Space Grotesk',sans-serif;
    }

    .hud-mono{
      font-family:'JetBrains Mono',monospace;
      letter-spacing:.02em;
    }

    .hud-panel{
      background:rgba(12,23,19,.75);
      border:1px solid #1C2B24;
      backdrop-filter:blur(8px);
    }

    .hud-panel:hover{
      border-color:rgba(107,255,184,.35);
      box-shadow:0 0 0 1px rgba(107,255,184,.08),
      0 12px 32px -12px rgba(0,0,0,.6);
    }

    @keyframes hud-blink{
      0%,100%{opacity:1;}
      50%{opacity:.3;}
    }

    .hud-blink{
      animation:hud-blink 1.8s infinite;
    }

  `}</style>
);

const Cart = () => {

  const navigate = useNavigate();

  const [cart,setCart]=useState([]);

  const [loading,setLoading]=useState(true);

  // ==========================
  // Load Cart
  // ==========================

  const loadCart=async()=>{

    try{

      const response=await getCart();

      if(response.success){

        setCart(response.cart);

      }

    }catch(error){

      console.log(error);

      alert("Failed to load cart");

    }finally{

      setLoading(false);

    }

  };

  useEffect(()=>{

    loadCart();

  },[]);

  // ==========================
  // Increase Quantity
  // ==========================

  const increaseQuantity=async(item)=>{

    try{

      await updateCart(
        item._id,
        item.quantity+1
      );

      loadCart();

    }catch(error){

      console.log(error);

    }

  };

  // ==========================
  // Decrease Quantity
  // ==========================

  const decreaseQuantity=async(item)=>{

    if(item.quantity===1)return;

    try{

      await updateCart(
        item._id,
        item.quantity-1
      );

      loadCart();

    }catch(error){

      console.log(error);

    }

  };

  // ==========================
  // Remove Item
  // ==========================

  const removeItem=async(id)=>{

    if(!window.confirm("Remove this item?"))
      return;

    try{

      await removeCartItem(id);

      loadCart();

    }catch(error){

      console.log(error);

    }

  };

  // ==========================
  // Clear Cart
  // ==========================

  const handleClearCart=async()=>{

    if(!window.confirm("Clear Cart?"))
      return;

    try{

      await clearCart();

      loadCart();

    }catch(error){

      console.log(error);

    }

  };

  // ==========================
  // Checkout
  // ==========================

  const handleCheckout=async()=>{

    if(cart.length===0){

      alert("Your cart is empty");

      return;

    }

    try{

      const response=await placeOrder({

        shippingAddress:"Nadaun, Himachal Pradesh",

        paymentMethod:"Cash On Delivery",

      });

      if(response.success){

        alert(response.message);

        await loadCart();

        navigate("/orders");

      }

    }catch(error){

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Order Failed"
      );

    }

  };

  const total=cart.reduce((sum,item)=>{

    return sum+
      item.product.price*
      item.quantity;

  },0);

  if(loading){

    return(

      <DashboardLayout>

        <div
          className="hud-root flex flex-col justify-center items-center h-[80vh] gap-3"
          style={{background:"#05100C"}}
        >

          <HudStyles/>

          <Radio
            size={22}
            className="text-[#6BFFB8] hud-blink"
          />

          <h2 className="hud-mono text-[#6BFFB8] uppercase">

            Loading Cart...

          </h2>

        </div>

      </DashboardLayout>

    );

  }

  return(

    <DashboardLayout>

      <div
        className="hud-root -m-8 p-8 min-h-screen"
        style={{background:"#05100C"}}
      >

        <HudStyles/>

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="hud-display text-4xl text-white flex items-center gap-3">

              <ShoppingCart
                className="text-[#6BFFB8]"
              />

              My Cart

            </h1>

            <p className="text-gray-400 mt-2">

              Manage your selected products

            </p>

          </div>

          <button
            onClick={handleClearCart}
            className="bg-red-500/10 text-red-400 px-5 py-3 rounded-xl hover:bg-red-500/20"
          >

            Clear Cart

          </button>

        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="hud-panel rounded-2xl p-6">

            <p className="text-gray-400">

              Total Items

            </p>

            <h2 className="text-4xl text-[#6BFFB8] font-bold">

              {cart.length}

            </h2>

          </div>

          <div className="hud-panel rounded-2xl p-6">

            <p className="text-gray-400">

              Total Amount

            </p>

            <h2 className="text-4xl text-[#4FD1FF] font-bold">

              ₹{total}

            </h2>

          </div>

        </div>
                {/* Cart Items */}

        {cart.length === 0 ? (

          <div className="hud-panel rounded-3xl p-12 text-center">

            <ShoppingCart
              size={60}
              className="mx-auto text-[#6BFFB8] mb-4"
            />

            <h2 className="hud-display text-3xl text-white">

              Your Cart is Empty

            </h2>

            <p className="text-gray-400 mt-3">

              Add products from Marketplace.

            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {cart.map((item) => (

              <div
                key={item._id}
                className="hud-panel rounded-3xl p-6 flex flex-col lg:flex-row justify-between items-center gap-6"
              >

                {/* Product */}

                <div className="flex items-center gap-5">

                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-28 h-28 rounded-xl object-cover border border-[#1C2B24]"
                  />

                  <div>

                    <h2 className="hud-display text-2xl text-white">

                      {item.product.name}

                    </h2>

                    <p className="text-gray-400 mt-2">

                      {item.product.category}

                    </p>

                    <p className="text-[#4FD1FF] text-xl font-bold mt-2">

                      ₹{item.product.price}

                    </p>

                  </div>

                </div>

                {/* Quantity */}

                <div className="flex items-center gap-3">

                  <button
                    onClick={() => decreaseQuantity(item)}
                    className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg"
                  >

                    <Minus size={18} />

                  </button>

                  <span className="text-2xl text-white font-bold w-10 text-center">

                    {item.quantity}

                  </span>

                  <button
                    onClick={() => increaseQuantity(item)}
                    className="bg-[#6BFFB8]/10 hover:bg-[#6BFFB8]/20 text-[#6BFFB8] p-2 rounded-lg"
                  >

                    <Plus size={18} />

                  </button>

                </div>

                {/* Total */}

                <div>

                  <h3 className="text-3xl text-[#6BFFB8] font-bold">

                    ₹{item.product.price * item.quantity}

                  </h3>

                </div>

                {/* Remove */}

                <button
                  onClick={() => removeItem(item._id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-3 rounded-xl"
                >

                  <Trash2 size={22} />

                </button>

              </div>

            ))}

            {/* Grand Total */}

            <div className="hud-panel rounded-3xl p-8 mt-10">

              <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                <div>

                  <h2 className="hud-display text-3xl text-white">

                    Grand Total

                  </h2>

                  <p className="text-gray-400 mt-2">

                    Review your order before checkout.

                  </p>

                </div>

                <div className="text-right">

                  <h2 className="text-5xl font-bold text-[#4FD1FF]">

                    ₹{total}

                  </h2>

                  <button
                    onClick={handleCheckout}
                    className="mt-5 bg-[#6BFFB8] hover:bg-[#58f2a5] text-black font-semibold px-8 py-3 rounded-xl flex items-center gap-2 transition"
                  >

                    <Package size={20} />

                    Checkout

                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>

  );

};

export default Cart;