import { createContext, useContext, useState } from "react";

// Create a Context for authentication-related data
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// AuthProvider component provides authentication state and functions to its children components.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => localStorage.getItem("user"));

   // Login function
  const login = (username) => {
    localStorage.setItem("user", username);
    setUser(username);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
