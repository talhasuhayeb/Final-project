import { toast } from "react-toastify";

// Global fetch wrapper to handle forced logout if user is blocked
export async function fetchWithBlockCheck(url, options = {}, navigate) {
  try {
    const response = await fetch(url, options);
    // Try to parse JSON, but fallback gracefully
    let data = null;
    try {
      data = await response.clone().json();
    } catch (e) {
      // Not JSON, ignore
    }
    // Only force logout if status is 401/403 AND message matches the actual block message
    const blockMsg =
      "Your account has been blocked. Please contact system administrator.";
    if (
      (response.status === 401 || response.status === 403) &&
      data &&
      typeof data.message === "string" &&
      data.message.trim() === blockMsg
    ) {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("token");
      toast.error(
        "Your account has been blocked. Please contact the administrator.",
        { position: "top-center" }
      );
      setTimeout(() => {
        if (navigate) navigate("/login");
        else window.location.href = "/login";
      }, 1200);
      // Return a dummy rejected promise to stop further processing
      return Promise.reject(new Error("Blocked"));
    }
    return response;
  } catch (err) {
    // Network or other error
    throw err;
  }
}

export const handleSuccess = (message) => {
  toast.success(message, {
    position: "top-center",
  });
};

export const handleError = (message) => {
  toast.error(message, {
    position: "top-center",
  });
};
