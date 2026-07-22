import axios from "@/lib/axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listCategory } from "@/lib/inventory-api/Category";
import { listProduct, searchFilters } from "@/lib/inventory-api/Product";
import { listDepartment } from "@/lib/inventory-api/Department";
import _ from "lodash";

const ecomStore = (set, get) => ({
  user: null,
  token: null,
  categories: [],
  department: [],
  products: [],
  carts: [],
  logout: () => {
    set({
      user: null,
      token: null,
      categories: [],
      department: [],
      products: [],
      carts: [],
    });
  },
  actionLogin: async (form) => {
    const res = await axios.post("/api/login/", form);
    console.log(res.data.token);
    set({
      user: res.data.payload,
      token: res.data.token,
    });
    return res;
  },
  getCategory: async () => {
    try {
      const res = await listCategory();
      set({ categories: res.data });
    } catch (error) {
      console.log(error);
    }
  },
  getDepartment: async () => {
    try {
      const res = await listDepartment();
      set({ department: res.data });
    } catch (error) {
      console.log(error);
    }
  },
  getProduct: async (count) => {
    try {
      const res = await listProduct(count);
      set({ products: res.data });
    } catch (error) {
      console.log(error);
    }
  },
  actionSearchFilters: async (arg) => {
    try {
      const res = await searchFilters(arg);
      set({ products: res.data });
    } catch (error) {
      console.log(error);
    }
  },
  actionAddToCart: (product) => {
    const carts = get().carts;
    const updateCart = [...carts, { ...product, count: 1 }];

    // step uniqe
    const uniqe = _.unionWith(updateCart, _.isEqual);

    set({ carts: uniqe });
    console.log("Click add in zuztand", carts);
  },
  actionUpdateQuantity: (productId, newQuantity) => {
    console.log("Update Click");
    set((state) => ({
      carts: state.carts.map((item) =>
        item.id === productId
          ? { ...item, count: Math.max(1, newQuantity) }
          : item,
      ),
    }));
  },
  actionRemoveProduct: (productId) => {
    console.log("remove");
    set((state) => ({
      carts: state.carts.filter((item) => item.id !== productId),
    }));
  },
  getTotalCount: () => {
    return get().carts.reduce((total, item) => {
      return total + item.count;
    }, 0);
  },
  clearCart: () => {
    set({ carts: [] });
  },
});

const usePersist = {
  name: "ecom-store",
  storage: createJSONStorage(() => localStorage),
};

const useEcomStore = create(persist(ecomStore, usePersist));

export default useEcomStore;
