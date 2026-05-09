import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LoginPage } from "./components/LoginPage";
import { api } from "../lib/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (api.restoreSession()) {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  return <RouterProvider router={router} />;
}
