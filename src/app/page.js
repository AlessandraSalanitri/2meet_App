"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router
import Header from "@/components/Header"; // Adjusted import for the Header component
import { auth } from "@/firebase/firebaseConfig"; // Firebase auth import
import "@/styles/HomePage.css"; // Import global styles (adjusted path)

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter(); // Next.js router

  useEffect(() => {
    // Check the authentication status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Set true if a user is logged in
    });
    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      router.push("/events"); // Redirect to events page if logged in
    } else {
      router.push("/login"); // Redirect to login page if not logged in
    }
  };

  return (
    <div
      className="page-container"
      style={{ backgroundImage: `url(/assets/1back.png)` }} // Public folder path
    >
      <Header />
      <main className="main-content">
        <div className="heading">Discover. Connect. Explore.</div> <br />

        <p className="sub-text">
          Meet like-minded souls, <br />
          explore new places, <br />
          and make <br />
          unforgettable memories.
        </p>

        <p className="description">
          Ready to meet, mingle, and make it <br />
          <span className="special-text">UNFORGETTABLE?</span> <br />
        </p>

        <div className="description">
          <button onClick={handleButtonClick} className="link">
            Let’s get social.
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
