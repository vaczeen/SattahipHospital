"use client";

import React, { useState, useEffect } from "react";
import useEcomStore from "@/store/ecom-store";
import { currentAdmin } from "@/lib/inventory-api/auth";
import LoadingToRedirect from "./LoadingToRedirect";

const ProtectRouteAdmin = ({ children }) => {
  const [ok, setOk] = useState(false);
  const user = useEcomStore((state) => state.user);
  const token = useEcomStore((state) => state.token);
  useEffect(() => {
    if (user && token) {
      currentAdmin(token)
        .then((res) => setOk(true))
        .catch((res) => setOk(false));
    }
  }, [user, token]);

  return ok ? children : <LoadingToRedirect />;
};

export default ProtectRouteAdmin;

