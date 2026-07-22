"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import useEcomStore from '@/store/ecom-store';

export default function InventoryLayout({ children }) {
  const logout = useEcomStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          router.push('/inventory/login');
        }
        return Promise.reject(error);
      }
    );

    // cleanup เมื่อ unmount
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  return <>{children}</>;
}