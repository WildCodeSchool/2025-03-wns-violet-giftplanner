import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../../generated/graphql-types";
import consoleErrorDev from "../../hook/erreurMod";
import { useMyProfileStore } from "../../zustand/myProfileStore";
import Icon from "../utils/Icon";
import Redirect from "./Redirect";
import "./navigation.css";

export default function Navigation() {
  const { userProfile, clearUserProfile } = useMyProfileStore();
  const [logoutMutation] = useLogoutMutation();
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);

  const handleLogout = async () => {
    try {
      const res = await logoutMutation();
      if (res.data?.logout) {
        clearUserProfile();
        navigate("/");
      } else {
        toast.error("La déconnexion a échoué");
      }
    } catch (err) {
      toast.error("Erreur lors de la déconnexion");
      consoleErrorDev("Erreur de déconnexion :", err);
    }
  };

  return (
    <div className="w-[12vw] max-w-[125px] bg-dark rounded-2xl flex flex-col justify-between gap-2 p-4">
      <div className="h-7/12 flex flex-col  justify-between ">
        <div className="w-full aspect-1/1">
          <img
            src={userProfile?.image_url || "/default-profile.png"}
            alt="Profile"
            className=" border-4 border-white aspect-1/1 rounded-full object-cover"
          />
          <div
            className="text-white h-auto"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "40px",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "40px",
              fontSize: "40px",
            }}
          >
            <Redirect
              link="/dashboard/conversations"
              icon={
                <Icon
                  icon="chat"
                  className={`cursor-pointer transition-bnt-nav ${currentLocation === "/dashboard/conversations" && "chat-icon"}`}
                />
              }
            />
            <Redirect
              link="/dashboard/wishlist"
              icon={
                <Icon
                  icon="gift"
                  className={`cursor-pointer transition-bnt-nav ${currentLocation === "/dashboard/wishlist" && "wishlist-icon"}`}
                />
              }
            />
            <Redirect
              link="/dashboard/profile"
              icon={
                <Icon
                  icon="user"
                  className={`"cursor-pointer transition-bnt-nav ${currentLocation === "/dashboard/profile" && "profile-icon"}`}
                />
              }
            />
          </div>
        </div>
      </div>
      <div
        className="text-white h-2/12"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Redirect onClick={handleLogout} icon={<Icon icon="logout" className="text-4xl cursor-pointer" />} />
        <p className="font-poppins-extra-bold text-xl">GiftChat.</p>
      </div>
    </div>
  );
}
