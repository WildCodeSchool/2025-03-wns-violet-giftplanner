import { useEffect } from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router";
import { useGetMeProfileQuery } from "./generated/graphql-types";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LoadingHomePage from "./pages/loadingHomePage/LoadingHomePage";
import NotFound404Page from "./pages/notFound404Page/NotFound404Page";
import ProvisoirPage from "./pages/ProvisoirPage";
import RegisterPage from "./pages/RegisterPage";
import WishListPage from "./pages/WishListPage";
import { useMyProfilStore } from "./zustand/myProfilStore";

const App = () => {
  const { data, loading } = useGetMeProfileQuery();
  const { setUserProfil } = useMyProfilStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.getMeProfile) {
      setUserProfil(data.getMeProfile);
      // si on était sur une page que on est pas censé étre une foie connecté on redirige vers la page principale
      if (["/", "/connexion", "/inscription"].includes(window.location.pathname)) {
        navigate("/provisoir");
      }
    } else if (!loading) {
      setUserProfil(null);
      // si on est pas connecté on redirige forcement vers la page de connexion ou d'inscription
      if (!["/connexion", "/inscription", "/"].includes(window.location.pathname)) {
        navigate("/");
      }
    }
  }, [data, loading, setUserProfil]);

  if (loading) return <LoadingHomePage />;

  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route index element={<HomePage />} />
        <Route path="connexion" element={<LoginPage />} />
        <Route path="inscription" element={<RegisterPage />} />
        <Route path="provisoir" element={<ProvisoirPage />} />
        <Route path="wishlist" element={<WishListPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound404Page />} />
      </Route>
    </Routes>
  );
};

export default App;
