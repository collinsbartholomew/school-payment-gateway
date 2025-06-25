"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Script from "next/script";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "../../../components/Button";
import Header from "../../../components/Header";
import Slash from "../../../components/Slash";

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailParam = searchParams.get("email");
  const amountParam = searchParams.get("amount");

  const [status, setStatus] =
    useState<"idle" | "pending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!emailParam || !amountParam) {
      router.replace("/");
    }
  }, [emailParam, amountParam, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("pending");
    setMessage("");

    try {
      const res = await fetch("/api/paystack/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailParam,
          amount: Number(amountParam),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Payment initialization failed");
      }

      const data = await res.json();
      if (!(window as any).PaystackPop) {
        throw new Error("Paystack script not loaded");
      }

      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: emailParam!,
        amount: Number(amountParam)! * 100,
        currency: "NGN",
        reference: data.reference,
        onSuccess: async (response: any) => {
          const verifyRes = await fetch("/api/paystack/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: response.reference }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.status === "success") {
            setStatus("success");
            setMessage("Payment successful! Reference: " + response.reference);
          } else {
            setStatus("error");
            setMessage("Payment verification failed.");
          }
        },
        onClose: () => {
          setStatus("idle");
          setMessage("Payment canceled.");
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen relative bg-gray-900 flex items-center justify-center overflow-hidden">
      <Header />
      <Slash />
      <Script
        src="https://js.paystack.co/v2/inline.js"
        strategy="afterInteractive"
      />
      <div className="flex items-center justify-center px-4 z-10">
        <div className="relative flex flex-col items-center justify-evenly h-100 w-full md:w-150 mx-5 px-5 py-5 mt-10 -mx-auto rounded-xl border border-gray-200 text-center backdrop-blur-3xl">
          <h2 className="text-xl font-bold mb-4 text-blue-200">
            Checkout – One‐Time Payment
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={emailParam || ""}
                className="input cursor-not-allowed mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                readOnly
                disabled
              />
            </div>
            <div>
              <p className="text-sm text-gray-200">
                Amount: <strong>₦{amountParam}</strong>
              </p>
            </div>
            <Button
              type="submit"
              disabled={status === "pending"}
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 px-10 py-1 rounded-md text-white"
            >
              {status === "pending" ? "Processing..." : `Pay ₦${amountParam}`}
            </Button>
          </form>

          {status !== "idle" && (
            <p
              className={`mt-4 text-center ${
                status === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
