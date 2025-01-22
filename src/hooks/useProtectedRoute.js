"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";

const useProtectedRoute = (requiredRole) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRole = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          router.push("/login");
          return;
        }

        const idTokenResult = await user.getIdTokenResult();
        const userRole = idTokenResult.claims.isAdmin ? "admin" : "regular";

        if (requiredRole === "admin" && userRole !== "admin") {
          router.push("/userdashboard");
          return;
        }

        if (requiredRole === "regular" && userRole !== "regular") {
          router.push("/admindashboard");
          return;
        }

        setIsLoading(false);
      });

      return () => unsubscribe();
    };

    fetchRole();
  }, [requiredRole, router]);

  return isLoading;
};

export default useProtectedRoute;
