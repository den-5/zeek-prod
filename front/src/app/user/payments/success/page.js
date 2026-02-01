"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const SuccessfulPaymentPage = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/games");
    }, 3000);
  }, []);

  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Thank you for your payment!</p>
    </div>
  );
};

export default SuccessfulPaymentPage;
