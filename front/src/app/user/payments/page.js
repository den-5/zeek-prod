"use client";

import React, { useState } from "react";
import Image from "next/image";
import currencyIcons from "./currencyIcons";
import QRCodeGenerator from "@/app/_tools/QRCodeGenerator.js";

const PaymentPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [wallet, setWallet] = useState("");
  const handleCurrencyChange = async (e) => {
    try {
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/get-user-wallet`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currency: e }),
        }
      );

      
      if (!response.ok) {
        throw new Error("An error occurred");
      }

      const data = await response.json();

      setIsPopupOpen(true);
      setSelectedCurrency(e);
      setWallet(data.wallet);
    } catch (error) {
      
    }
  };

  const handleClosePopup = (e) => {
    if (e.target === e.currentTarget) {
      setIsPopupOpen(false);
    }
  };

  return (
    <div>
      <div className="text-center m-10 text-3xl italic">
        Choose your payment method
      </div>
      {}
      <div className="text-center text-yellow-400 mb-6 p-4 bg-yellow-900/20 rounded mx-8">
        ⚠️ Crypto payments are temporarily disabled. New users receive $20 starting balance.
      </div>
      {}
      {}
    </div>
  );
};

export default PaymentPage;
