"use client";

import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);

  const handleResetPasswordClick = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/send-forgot-password-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (response.ok) {
        alert("Reset password email sent");
      }
    } catch (error) {
    }
  };
  return (
    <div>
      <div>
        <h1>Forgot Password</h1>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          type="text"
          placeholder="email"
          className="text-black"
        />
        <button onClick={handleResetPasswordClick}>Reset Password</button>
      </div>
    </div>
  );
}
