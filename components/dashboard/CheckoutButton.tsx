"use client";

import React, { useState } from "react";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
  itemId: string;
  itemType: "course" | "program";
  price: number;
  title: string;
  couponId?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutButton({ itemId, itemType, price, title, couponId }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Create Order
      const orderRes = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, itemType, couponId }),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");
      const orderData = await orderRes.json();

      // 2. Load SDK
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // 3. Initialize Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "iSoftware Lab Academy",
        description: `Enrollment for ${title}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify Payment
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            router.push("/dashboard/my-courses?success=true");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "", // Will be filled by Razorpay if user is logged in
          email: "",
        },
        theme: {
          color: "#EBBB54",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-4 bg-[#EBBB54] text-black font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#EBBB54]/20 disabled:opacity-50 group"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          <CreditCard size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="text-xs uppercase tracking-[0.2em]">Enroll_Now_₹{price}</span>
          <ShieldCheck size={18} className="opacity-50" />
        </>
      )}
    </button>
  );
}
