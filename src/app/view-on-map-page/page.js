"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig"; 
import ViewOnMap from "@/components/ViewOnMap";

const ViewOnMapPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        
        const token = await user.getIdTokenResult();
        setIsAdmin(!!token.claims.admin); 
      }
    };

    fetchUserRole();
  }, []);

  return (
    <main>
      <ViewOnMap isAdmin={isAdmin} />
    </main>
  );
};

export default ViewOnMapPage;
