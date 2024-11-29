import { useContext } from "react";
import { LoaderContext } from "../context/Loader.context";
import { savePost } from "../services/user";
import toast from "react-hot-toast";
import { SessionExpiredModalContext } from "../context/Modal.context";

export const useSavePost = (callback: () => void) => {
  const { setLoading } = useContext(LoaderContext);
  const modal = useSessionExpiredModal();

  return async (postId: string) => {
    setLoading(true);
    try {
      const res = await savePost(postId);
      toast.success(res.data.message);
      callback();
    } catch (error: any) {
      modal(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
};

export const useSessionExpiredModal = () => {
  const { setIsSessionExpired } = useContext(SessionExpiredModalContext);

  return (error: any) => {
    if (error?.response?.status === 401) {
      setIsSessionExpired(true);
    }
  };
};
