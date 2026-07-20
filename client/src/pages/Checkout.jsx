import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { getCart } from "../services/cartService";
import { placeOrder } from "../services/orderService";
import {
  PackageCheck,
  MapPin,
  CreditCard,
} from "lucide-react";

const HudStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

    .hud-root{
      font-family:'Inter',sans-serif;
    }

    .hud-display{
      font-family:'Space Grotesk',sans-serif;
    }

    .hud-panel{
      background:rgba(12,23,19,.75);
      border:1px solid #1C2B24;
      backdrop-filter:blur(8px);
    }

    .hud-input{
      background:#0D1713;
      border:1px solid #1C2B24;
      color:white;
      padding:12px;
      border-radius:12px;
      width:100%;
      outline:none;
    }

    .hud-input:focus{
      border-color:#6BFFB8;
    }
  `}</style>
);

const Checkout = () => {

  const navigate = useNavigate();

  const [cart,setCart]=useState([]);

  const [loading,setLoading]=useState(true);

  const [shippingAddress,setShippingAddress]=useState("");

  const [paymentMethod,setPaymentMethod]=useState("Cash On Delivery");

  const loadCart=async()=>{

    try{

      const response=await getCart();

      if(response.success){

        setCart(response.cart);

      }

    }catch(error){

      console.log(error);

    }finally{

      setLoading(false);

    }

  };

  useEffect(()=>{

    loadCart();

  },[]);

  const total=cart.reduce((sum,item)=>{

    return sum+item.product.price*item.quantity;

  },0);

  const handlePlaceOrder=async()=>{

    if(!shippingAddress){

      alert("Please enter shipping address");

      return;

    }

    try{

      const response=await placeOrder({

        shippingAddress,

        paymentMethod,

      });

      if(response.success){

        alert("Order placed successfully");

        navigate("/orders");

      }

    }catch(error){

      alert(
        error.response?.data?.message ||
        "Order failed"
      );

    }

  };

  if(loading){

    return(
      <DashboardLayout>
        <div
          className="flex justify-center items-center h-screen text-white"
          style={{background:"#05100C"}}
        >
          Loading...
        </div>
      </DashboardLayout>
    );

  }

  return(

    <DashboardLayout>

      <div
        className="hud-root min-h-screen -m-8 p-8"
        style={{background:"#05100C"}}
      >

        <HudStyles/>

        <h1 className="hud-display text-4xl text-white mb-8 flex items-center gap-3">

          <PackageCheck className="text-[#6BFFB8]"/>

          Checkout

        </h1>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left */}

          <div className="hud-panel rounded-3xl p-8">

            <h2 className="text-white text-2xl mb-6 flex items-center gap-2">

              <MapPin className="text-[#6BFFB8]"/>

              Shipping Address

            </h2>

            <textarea

              rows="6"

              className="hud-input"

              placeholder="Enter complete delivery address..."

              value={shippingAddress}

              onChange={(e)=>setShippingAddress(e.target.value)}

            />

            <h2 className="text-white text-2xl mt-10 mb-5 flex items-center gap-2">

              <CreditCard className="text-[#4FD1FF]"/>

              Payment Method

            </h2>

            <div className="space-y-4">

              <label className="flex gap-3 text-white">

                <input

                  type="radio"

                  checked={paymentMethod==="Cash On Delivery"}

                  onChange={()=>setPaymentMethod("Cash On Delivery")}

                />

                Cash On Delivery

              </label>

              <label className="flex gap-3 text-white">

                <input

                  type="radio"

                  checked={paymentMethod==="UPI"}

                  onChange={()=>setPaymentMethod("UPI")}

                />

                UPI

              </label>

              <label className="flex gap-3 text-white">

                <input

                  type="radio"

                  checked={paymentMethod==="Card"}

                  onChange={()=>setPaymentMethod("Card")}

                />

                Credit / Debit Card

              </label>

            </div>

          </div>
                    {/* Right */}

          <div className="hud-panel rounded-3xl p-8">

            <h2 className="text-2xl text-white mb-6">

              Order Summary

            </h2>

            <div className="space-y-5">

              {cart.map((item)=>(

                <div
                  key={item._id}
                  className="flex justify-between items-center border-b border-[#1C2B24] pb-4"
                >

                  <div>

                    <h3 className="text-white font-semibold">

                      {item.product.name}

                    </h3>

                    <p className="text-gray-400">

                      ₹{item.product.price} × {item.quantity}

                    </p>

                  </div>

                  <h3 className="text-[#6BFFB8] font-bold text-xl">

                    ₹{item.product.price * item.quantity}

                  </h3>

                </div>

              ))}

            </div>

            <div className="border-t border-[#1C2B24] mt-8 pt-6 space-y-3">

              <div className="flex justify-between text-gray-300">

                <span>Subtotal</span>

                <span>₹{total}</span>

              </div>

              <div className="flex justify-between text-gray-300">

                <span>Delivery</span>

                <span className="text-[#6BFFB8]">
                  FREE
                </span>

              </div>

              <div className="flex justify-between text-gray-300">

                <span>GST</span>

                <span>Included</span>

              </div>

              <div className="flex justify-between text-3xl text-white font-bold mt-5">

                <span>Total</span>

                <span className="text-[#4FD1FF]">

                  ₹{total}

                </span>

              </div>

            </div>

            <button

              onClick={handlePlaceOrder}

              className="w-full mt-10 bg-[#6BFFB8] hover:bg-[#58f2a5] text-black font-bold py-4 rounded-xl transition"

            >

              Place Order

            </button>

            <button

              onClick={()=>navigate("/cart")}

              className="w-full mt-4 border border-[#1C2B24] text-white py-4 rounded-xl hover:bg-[#0D1713]"

            >

              Back To Cart

            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );

};

export default Checkout;