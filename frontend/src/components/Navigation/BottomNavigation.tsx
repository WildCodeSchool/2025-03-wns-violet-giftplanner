import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMyProfileStore } from "../../zustand/myProfileStore";
import { LuUserRound, LuHeart, LuMessageCircleMore, LuShield } from "react-icons/lu";
import "./bottom-navigation.css";

export default function BottomNavigation() {
  const { userProfile } = useMyProfileStore();
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);

  return (
    <div className="bottom-navigation">
      <button
        type="button"
        onClick={() => navigate("/dashboard/conversations")}
        className={`bottom-nav-item ${currentLocation === "/dashboard/conversations" ? "active" : ""}`}
      >
        <LuMessageCircleMore className="bottom-nav-icon" />
        <span className="bottom-nav-label">Messages</span>
      </button>

      <button
        type="button"
        onClick={() => navigate("/dashboard/wishlist")}
        className={`bottom-nav-item ${currentLocation === "/dashboard/wishlist" ? "active" : ""}`}
      >
        <LuHeart className="bottom-nav-icon" />
        <span className="bottom-nav-label">Wishlist</span>
      </button>

      <button
        type="button"
        onClick={() => navigate("/dashboard/profile")}
        className={`bottom-nav-item ${currentLocation === "/dashboard/profile" ? "active" : ""}`}
      >
        <LuUserRound className="bottom-nav-icon" />
        <span className="bottom-nav-label">Profil</span>
      </button>

      {userProfile?.isAdmin && (
        <button
          type="button"
          onClick={() => navigate("/dashboard/admin")}
          className={`bottom-nav-item ${currentLocation === "/dashboard/admin" ? "active" : ""}`}
        >
          <LuShield className="bottom-nav-icon" />
          <span className="bottom-nav-label">Admin</span>
        </button>
      )}
    </div>
  );
}
