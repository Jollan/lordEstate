import axios from "axios";
import toast from "react-hot-toast";

interface AxiosXHRConfigPlus<T = any> extends Axios.AxiosXHRConfig<T> {
  metadata?: {
    loadingTimeout?: NodeJS.Timeout;
    showLoadingMessage?: boolean;
  };
}

const Axios = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true,
});

Axios.interceptors.request.use((config: AxiosXHRConfigPlus) => {
  const delay = 30 * 1000;

  config.metadata = {};
  config.metadata.loadingTimeout = setTimeout(() => {
    config.metadata!.showLoadingMessage = true;
    toast.loading(
      "The response is taking longer than expected. Please wait...",
      { id: "984jkfgkwri9tgn" }
    );
  }, delay);

  return config;
});

Axios.interceptors.response.use(
  (response) => {
    const config = response.config as AxiosXHRConfigPlus;

    if (config.metadata?.loadingTimeout) {
      clearTimeout(config.metadata.loadingTimeout);
      toast.dismiss("984jkfgkwri9tgn");
    }

    if (config.metadata?.showLoadingMessage) {
      toast("Thank you for your patience!");
    }

    return response;
  },
  (error) => {
    const config = error.config as AxiosXHRConfigPlus;

    if (config?.metadata?.loadingTimeout) {
      clearTimeout(config.metadata.loadingTimeout);
      toast.dismiss("984jkfgkwri9tgn");
    }

    if (config?.metadata?.showLoadingMessage) {
      toast("An error occurred after some delay.");
    }

    return Promise.reject(error);
  }
);

export default Axios;
