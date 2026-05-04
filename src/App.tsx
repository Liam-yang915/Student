import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import TeacherListPage from "./pages/TeacherListPage";
import TeacherSlotsPage from "./pages/TeacherSlotsPage";
import BookingsPage from "./pages/BookingsPage";

type RouteState =
  | { name: "home" }
  | { name: "login" }
  | { name: "profile" }
  | { name: "teachers" }
  | { name: "bookings" }
  | { name: "teacher-slots"; teacherId: string };

function getCurrentRoute(): RouteState {
  const hash = window.location.hash || "#/";
  const teacherSlotsMatch = hash.match(/^#\/teachers\/(\d+)$/);

  if (teacherSlotsMatch) {
    return { name: "teacher-slots", teacherId: teacherSlotsMatch[1] };
  }

  if (hash === "#/login") return { name: "login" };
  if (hash === "#/profile") return { name: "profile" };
  if (hash === "#/teachers") return { name: "teachers" };
  if (hash === "#/bookings") return { name: "bookings" };
  return { name: "home" };
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(getCurrentRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getCurrentRoute());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (route.name === "login") return <LoginPage />;
  if (route.name === "profile") return <ProfilePage />;
  if (route.name === "teachers") return <TeacherListPage />;
  if (route.name === "bookings") return <BookingsPage />;
  if (route.name === "teacher-slots") return <TeacherSlotsPage teacherId={route.teacherId} />;
  return <HomePage />;
}
