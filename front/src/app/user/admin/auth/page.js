"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmailState] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      if (response.ok) {
        setError(null);
        const { token } = await response.json();
        localStorage.setItem("admintoken", token);
        router.push("/user/admin/panel");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        value={email}
        onChange={(e) => setEmailState(e.target.value)}
        placeholder="email"
        className="text-black"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="text-black"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
