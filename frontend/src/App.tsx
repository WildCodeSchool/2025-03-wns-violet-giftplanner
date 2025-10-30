import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router";
import Wishlist from "./components/Wishlist";
import { useGetMeProfileQuery } from "./generated/graphql-types";
import Conversations from "./pages/Conversations";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LoadingHomePage from "./pages/loadingHomePage/LoadingHomePage";
import NotFound404Page from "./pages/notFound404Page/NotFound404Page";
import RegisterPage from "./pages/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage";
import { useMyProfileStore } from "./zustand/myProfileStore";

const App = () => {
  const { data, loading } = useGetMeProfileQuery();
  const { setUserProfile } = useMyProfileStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.getMeProfile) {
      setUserProfile(data.getMeProfile);
      // si on était sur une page que on est pas censé étre une foie connecté on redirige vers la page principale
      if (["/", "/connexion", "/inscription"].includes(window.location.pathname)) {
        navigate("/dashboard");
      }
    } else if (!loading) {
      setUserProfile(null);
      // si on est pas connecté on redirige forcement vers la page de connexion ou d'inscription
      if (!["/connexion", "/inscription", "/"].includes(window.location.pathname)) {
        navigate("/");
      }
    }
  }, [data, loading, setUserProfile]);

  if (loading) return <LoadingHomePage />;

  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route index element={<HomePage />} />
        <Route path="connexion" element={<LoginPage />} />
        <Route path="inscription" element={<RegisterPage />} />

        {/* Dashboard with nested routes */}
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="conversations" replace />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="profile" element={<UserProfilePage />} />
        </Route>

        <Route path="*" element={<NotFound404Page />} />
      </Route>
    </Routes>
  );
};

export default App;
