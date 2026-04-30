import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

function getCurrentRoute() {
  const hash = window.location.hash;
  if (hash === "#/login") return "login";
  if (hash === "#/profile") return "profile";
  return "home";
}

export default function App() {
  const [route, setRoute] = useState(getCurrentRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getCurrentRoute());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (route === "login") return <LoginPage />;
  if (route === "profile") return <ProfilePage />;
  return <HomePage />;
}
