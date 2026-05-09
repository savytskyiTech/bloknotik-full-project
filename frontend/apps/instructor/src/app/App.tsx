import { useEffect, useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { InstructorApp } from "./components/InstructorApp";
import { api } from "../lib/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (api.restoreSession()) {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  return <InstructorApp />;
}
