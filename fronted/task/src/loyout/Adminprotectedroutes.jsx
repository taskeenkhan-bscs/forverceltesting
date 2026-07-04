import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function AdminProtectedRoutes({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function getRoles() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/isadmin`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success === true) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      setIsAdmin(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRoles();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return isAdmin ? children : <Navigate to="/login" />;
}

export default AdminProtectedRoutes;