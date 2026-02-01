"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react"; // Correct import statement
import currencyIcons from "../user/payments/currencyIcons";

export default function QRCodeGenerator({ value, currency }) {
  return (
    <div className="flex justify-center items-center">
      <QRCodeSVG
        value={value}
        size={256}
        imageSettings={{ src: currencyIcons[currency], height: 64, width: 64 }}
      />
    </div>
  );
}
