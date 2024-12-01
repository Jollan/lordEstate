import { useContext } from "react";
import { LoaderContext } from "../context/Loader.context";
import { savePost } from "../services/user";
import toast, { ToastOptions } from "react-hot-toast";
import { SessionExpiredModalContext } from "../context/Modal.context";
import { AuthContext } from "../context/Auth.context";

export const useSavePost = (callback: () => void) => {
  const { setLoading } = useContext(LoaderContext);
  const errorToast = useErrorToast();

  return async (postId: string) => {
    setLoading(true);
    try {
      const res = await savePost(postId);
      toast.success(res.data.message);
      callback();
    } catch (error: any) {
      errorToast(error, error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
};

export const useErrorToast = () => {
  const { setIsSessionExpired } = useContext(SessionExpiredModalContext);
  const { currentUser } = useContext(AuthContext);

  return (error: any, message?: string, options?: ToastOptions) => {
    if (message) {
      toast.error(message, options);
    }
    if (error?.response?.status === 401 && currentUser) {
      setIsSessionExpired(true);
    }
  };
};
