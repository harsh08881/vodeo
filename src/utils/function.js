 export const clearToken = (redirect = true) => {
    localStorage.removeItem("token"); // Remove token from local storage
    console.log("🔴 Token cleared from local storage");
  
    if (redirect) {
      window.location.href = "/login"; // Redirect to login page (optional)
    }
  };


  
  