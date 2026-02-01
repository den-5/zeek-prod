"use client";

import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PaymentErrorPage = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/games");
    }, 3000);
  }, []);

  return (
    <div>
      <h1>Payment Error</h1>
      <p>Try again</p>
    </div>
  );
};

export default PaymentErrorPage;
