"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import {
  setUsername,
  setIsLoggedIn,
  setBalance,
} from "../redux/slices/userSlice";

export default function RouteChangeHandler() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [balanceUpdated, setBalanceUpdated] = useState(false);

  useEffect(() => {
    // List of public paths that don't need auth checks
    const publicPaths = ["/", "/auth/login", "/auth/signup", "/auth/forgot-password"];
    // If we are on a public path (exact match or similar logic), we can still check auth
    // but we shouldn't error out if no token.

    const checkAuth = async () => {
      const token = localStorage.getItem("token"); 

      // If no token and trying to access protected route (games/user), redirect to home
      if (!token) {
        // Allow admin routes without standard user token
        if (pathname.includes("/user/admin")) return;

        if (pathname.includes("/games") || pathname.includes("/user")) {
             dispatch(setIsLoggedIn(false));
             router.push("/");
        }
        return; 
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/checkAuth`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const { username, balance } = await response.json();

          dispatch(setUsername(username));
          dispatch(setIsLoggedIn(true));
          dispatch(setBalance(balance));
          setBalanceUpdated(true);
        } else {
           // Token invalid, only remove and redirect if on protected route
           localStorage.removeItem("token"); 
           if (pathname.includes("/games") || pathname.includes("/user")) {
               router.push("/");
           }
        }
      } catch (error) {
         // Network error or other issue
         // Don't force logout immediately unless critical? 
         // For now, safe default:
         console.error("Auth check failed", error);
      }
    };

    checkAuth();
  }, [pathname]);

  return null;
}
