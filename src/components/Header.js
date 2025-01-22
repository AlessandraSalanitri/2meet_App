"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router
import Link from "next/link"; // Next.js Link component
import Image from "next/image"; // Next.js Image component for optimized images
import { auth, db } from "@/firebase/firebaseConfig"; // Firebase import path
import { doc, getDoc } from "firebase/firestore";
import "@/styles/Header.css"; 

const Header = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(""); // Track user role
  const router = useRouter(); // Use Next.js router for navigation

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Fetch Firestore user document by UID
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User Document Data:", userData);
            setUserRole(userData.isAdmin ? "admin" : "regular");
          } else {
            console.warn(`No document found for UID: ${currentUser.uid}`);
            setUserRole("regular"); // Default role
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUserRole(""); // Reset role on logout
      }
    });

    return () => unsubscribe();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login"); // Redirect to login after logout
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <header className="header">
      {/* Logo Section */}
      <div className="logo-container">
        <Link href="/"> {/* Link to the homepage */}
          <Image
            src="/assets/Logo.png" // Public folder path for the logo
            alt="Logo"
            className="logo"
            width={185} 
            height={110} 
          />
        </Link>
      </div>

      <nav>
        {user ? (
          <div className="user-actions">
            {/* Redirect to the correct dashboard based on role */}
            {userRole === "admin" ? (
              <Link href="/admindashboard">Admin Dashboard</Link>
            ) : (
              <Link href="/userdashboard">My Account</Link>
            )}
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link href="/signup">Signup</Link>
            <Link href="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
