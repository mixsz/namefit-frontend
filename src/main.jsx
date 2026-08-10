import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Login from "./pages/Login.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Layout from "./components/Layout.jsx";
import Exercicios from "./pages/Exercicios.jsx";
import Historico from "./pages/Historico.jsx";
import Treinos from "./pages/Treinos.jsx";
import TreinoDetalhe from "./pages/TreinoDetalhe.jsx";
import Perfil from "./pages/Perfil.jsx";
import Execucao from "./pages/Execucao.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        element: <PublicRoute />,
        children: [
          {
            path: "cadastro",
            element: <Cadastro />,
          },
          {
            path: "login",
            element: <Login />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: [
              {
                path: "home",
                element: <Home />,
              },
              {
                path: "exercicios",
                element: <Exercicios />,
              },
              {
                path: "historico",
                element: <Historico />,
              },
              {
                path: "treinos",
                element: <Treinos />,
              },
              {
                path: "treinos/:id",
                element: <TreinoDetalhe />,
              },
              {
                path: "execucao/:id",
                element: <Execucao />,
              },
              {
                path: "perfil",
                element: <Perfil />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
