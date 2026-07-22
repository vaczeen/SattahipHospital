"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LoadingToRedirect = () => {
  const [count, setCount] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (count === 0) {
      router.push("/inventory");
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, router]);

  return <div>No permission, Redirect in {count}</div>;
};

export default LoadingToRedirect;