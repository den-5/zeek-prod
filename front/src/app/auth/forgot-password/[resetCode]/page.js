"use client";

import React, { useState } from "react";

export default function ForgotPasswordPage({ params }) {
  const { resetCode } = params;
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);
  const [passwordVerification, setPasswordVerification] = useState(null);

  const handleResetPasswordClick = async () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters long and contain at least one letter and one number"
      );
      return;
    } else if (password !== passwordVerification) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: resetCode, newPassword: password }),
        }
      );
      if (response.ok) {
        alert("Successfully reset password");
      }
    } catch (error) {
    }
  };
  return (
    <div>
      <div>
        <h1>New password</h1>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value.toLowerCase())}
          type="text"
          placeholder="email"
          className="text-black"
        />
      </div>
      <div>
        <h1>New password one more time</h1>
        <input
          value={passwordVerification}
          onChange={(e) =>
            setPasswordVerification(e.target.value.toLowerCase())
          }
          type="text"
          placeholder="email"
          className="text-black"
        />
      </div>
      <button onClick={handleResetPasswordClick}>Reset Password</button>
    </div>
  );
}
