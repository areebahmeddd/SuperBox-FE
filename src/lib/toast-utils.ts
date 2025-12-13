import toast from "react-hot-toast";

/**
 * Toast utility to prevent duplicate toasts
 * Uses unique IDs to ensure only one instance of each toast message is displayed
 */

export const showToast = {
  success: (message: string, options?: { description?: string }) => {
    toast.success(message, {
      id: `success-${message}`,
      ...options,
    });
  },

  error: (message: string, options?: { description?: string }) => {
    toast.error(message, {
      id: `error-${message}`,
      ...options,
    });
  },

  info: (message: string, options?: { description?: string }) => {
    toast(message, {
      id: `info-${message}`,
      ...options,
    });
  },
};
