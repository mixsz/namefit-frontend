import Header from "./Header.jsx";
import { Outlet } from "react-router-dom";
import { ActiveWorkoutProvider } from "../context/ActiveWorkout.jsx";

function Layout() {
  return (
    <ActiveWorkoutProvider>
      <div>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </ActiveWorkoutProvider>
  );
}

export default Layout;