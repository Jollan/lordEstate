import { create } from "zustand";
import { getUnreadChatCount } from "../services/user";

interface NotificationStore {
  count: number;
  fetch: (cb: (error: any) => void) => void;
  decrease: () => void;
  increase: () => void;
  reset: () => void;
}

const useNotificationStore = create<NotificationStore>((set) => {
  return {
    count: 0,
    async fetch(cb) {
      try {
        const res = await getUnreadChatCount();
        set({ count: res.data });
      } catch (error) {
        cb(error);
      }
    },
    decrease() {
      set((prev) => ({ count: prev.count - 1 }));
    },
    increase() {
      set((prev) => ({ count: prev.count + 1 }));
    },
    reset() {
      set({ count: 0 });
    },
  };
});

export default useNotificationStore;
