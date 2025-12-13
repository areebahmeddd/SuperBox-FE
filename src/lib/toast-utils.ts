import toast from "react-hot-toast";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      id: `success-${message}`,
    });
  },

  error: (message: string) => {
    toast.error(message, {
      id: `error-${message}`,
    });
  },

  info: (message: string) => {
    toast(message, {
      id: `info-${message}`,
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      id: `loading-${message}`,
    });
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};
