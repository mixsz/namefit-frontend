import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import ToastContainer from "./components/ToastContainer.jsx";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
          <Outlet />
        <ToastContainer />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
