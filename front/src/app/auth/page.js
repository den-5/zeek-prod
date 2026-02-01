"use client";
import Link from "next/link";

const AuthPage = () => {
  return (
    <div>
      <h1>Welcome to the Auth Page</h1>
      <p>Please choose an option:</p>
      <Link href="/auth/signup">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 lg:mb-8 mt-8">
          Sign Up
        </button>
      </Link>
      <br />
      <Link href="/auth/login">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 lg:mb-8">
          Login
        </button>
      </Link>
    </div>
  );
};

export default AuthPage;
