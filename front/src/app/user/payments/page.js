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
      // Send a POST request to the server
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

      // Check if the response is ok
      if (!response.ok) {
        throw new Error("An error occurred");
      }

      const data = await response.json();

      setIsPopupOpen(true);
      setSelectedCurrency(e);
      setWallet(data.wallet);
    } catch (error) {
      // Error handling
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
      {/* DISABLED FOR LOCAL DEVELOPMENT: Crypto payments */}
      <div className="text-center text-yellow-400 mb-6 p-4 bg-yellow-900/20 rounded mx-8">
        ⚠️ Crypto payments are temporarily disabled. New users receive $20 starting balance.
      </div>
      {/* Commented out wallet functionality - uncomment when API credentials are ready */}
      {/*
      <div className="grid grid-cols-2 p-8 sm:grid-cols-3 gap-4 mb-4 xl:w-2/3 xl:h-2/3 m-auto sm:p-20">
        {Object.keys(currencyIcons).map((key) => (
          <div
            className="p-10 border border-gray-300 rounded cursor-pointer flex items-center justify-center "
            key={key}
            onClick={() => handleCurrencyChange(key)}
          >
            <Image
              src={currencyIcons[key]}
              alt={key}
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
      {isPopupOpen && (
        <div
          onClick={handleClosePopup}
          className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center text-black"
        >
          <div className="bg-white p-10 rounded">
            <div className="flex justify-between items-center mb-4 px-4">
              <h2 className="text-xl mr-4 ">
                Your{" "}
                <span className="italic text-2xl">
                  {selectedCurrency.replace(/_/g, " ")}
                </span>{" "}
                wallet
              </h2>
              <button
                className="select-none text-2xl border border-gray-300 rounded px-4 py-2"
                onClick={() => setIsPopupOpen(false)}
              >
                X
              </button>
            </div>

            <QRCodeGenerator value={wallet} currency={selectedCurrency} />
            <div className="text-sm sm:text-lg italic mt-8 px-4">{wallet}</div>
          </div>
        </div>
      )}
      */}
    </div>
  );
};

export default PaymentPage;
