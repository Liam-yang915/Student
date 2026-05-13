import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import TeacherListPage from "./pages/TeacherListPage";
import TeacherSlotsPage from "./pages/TeacherSlotsPage";
import BookingsPage from "./pages/BookingsPage";
import CoursesPage from "./pages/CoursesPage";
import TextbookSelectionPage from "./pages/TextbookSelectionPage";
import LibraryTextbooksPage from "./pages/LibraryTextbooksPage";
import LibraryLessonsPage from "./pages/LibraryLessonsPage";
import LessonPreviewPage from "./pages/LessonPreviewPage";
import { authService } from "./services/api";

type RouteState =
  | { name: "home" }
  | { name: "login" }
  | { name: "profile" }
  | { name: "teachers" }
  | { name: "bookings" }
  | { name: "courses" }
  | { name: "library-textbooks" }
  | { name: "library-lessons"; textbookId: string }
  | { name: "lesson-preview"; lessonId: string }
  | { name: "teacher-slots"; teacherId: string }
  | { name: "teacher-textbooks"; teacherId: string };

function getCurrentRoute(): RouteState {
  const hash = window.location.hash || "#/";
  const teacherSlotsMatch = hash.match(/^#\/teachers\/(\d+)$/);
  const teacherTextbooksMatch = hash.match(/^#\/teachers\/(\d+)\/textbooks$/);
  const libraryLessonsMatch = hash.match(/^#\/library\/textbooks\/(\d+)$/);
  const lessonPreviewMatch = hash.match(/^#\/library\/lessons\/(\d+)$/);

  if (lessonPreviewMatch) {
    return { name: "lesson-preview", lessonId: lessonPreviewMatch[1] };
  }

  if (libraryLessonsMatch) {
    return { name: "library-lessons", textbookId: libraryLessonsMatch[1] };
  }

  if (teacherTextbooksMatch) {
    return { name: "teacher-textbooks", teacherId: teacherTextbooksMatch[1] };
  }

  if (teacherSlotsMatch) {
    return { name: "teacher-slots", teacherId: teacherSlotsMatch[1] };
  }

  if (hash === "#/login") return { name: "login" };
  if (hash === "#/profile") return { name: "profile" };
  if (hash === "#/teachers") return { name: "teachers" };
  if (hash === "#/bookings") return { name: "bookings" };
  if (hash === "#/courses") return { name: "courses" };
  if (hash === "#/library") return { name: "library-textbooks" };
  if (authService.isAuthenticated()) return { name: "profile" };
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
  if (route.name === "courses") return <CoursesPage />;
  if (route.name === "library-textbooks") return <LibraryTextbooksPage />;
  if (route.name === "library-lessons") return <LibraryLessonsPage textbookId={route.textbookId} />;
  if (route.name === "lesson-preview") return <LessonPreviewPage lessonId={route.lessonId} />;
  if (route.name === "teacher-slots") return <TeacherSlotsPage teacherId={route.teacherId} />;
  if (route.name === "teacher-textbooks") return <TextbookSelectionPage teacherId={route.teacherId} />;
  return <HomePage />;
}
