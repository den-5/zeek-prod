"use client";

import { useEffect, useState } from "react";

export default function Page({ params }) {
  const { activation } = params;
  const [isActivated, setIsActivated] = useState(false);
  const [isActivationStarted, setIsActivationStarted] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setIsActivationStarted(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/verify/${activation}`
        );
        if (response.ok) {
          setIsActivated(true);
        }
      } catch (error) {
        setIsActivationStarted(false);
        setIsActivated(false);
      }
    };

    if (activation) {
      verifyEmail();
    }
  }, []);

  return (
    <div>
      {isActivationStarted ? (
        <>
          {isActivated ? (
            <div>Successfully activated</div>
          ) : (
            <div>Error during activation occurred</div>
          )}
        </>
      ) : (
        <div>activating...</div>
      )}
    </div>
  );
}
