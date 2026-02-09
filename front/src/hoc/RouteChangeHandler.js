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
    
    const publicPaths = ["/", "/auth/login", "/auth/signup", "/auth/forgot-password"];
    
    

    const checkAuth = async () => {
      const token = localStorage.getItem("token"); 

      
      if (!token) {
        
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
           
           localStorage.removeItem("token"); 
           if (pathname.includes("/games") || pathname.includes("/user")) {
               router.push("/");
           }
        }
      } catch (error) {
         
         
         
         console.error("Auth check failed", error);
      }
    };

    checkAuth();
  }, [pathname]);

  return null;
}
