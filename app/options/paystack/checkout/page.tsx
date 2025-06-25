import React, { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-4 text-center">Loading payment form…</p>}>
      <CheckoutClient />
    </Suspense>
  );
}
