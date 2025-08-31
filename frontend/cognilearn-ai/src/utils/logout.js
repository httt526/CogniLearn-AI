import axiosInstance from "./axiosInsantce";

export const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found. Already logged out?");
      window.location.href = "/login";
      return;
    }

    await axiosInstance.post("/logout", { access_token: token });

    // Xoá dữ liệu trên client
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    // Chuyển về login
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed:", err);
    alert("Logout failed, please try again.");
  }
};