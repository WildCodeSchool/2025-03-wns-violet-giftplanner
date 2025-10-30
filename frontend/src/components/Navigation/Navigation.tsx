import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../../generated/graphql-types";
import consoleErrorDev from "../../hooks/erreurMod";
import { useMyProfileStore } from "../../zustand/myProfileStore";
import Icon from "../utils/Icon";
import Redirect from "./Redirect";

export default function Navigation() {
  const [logoutMutation] = useLogoutMutation();
  const { clearUserProfile } = useMyProfileStore();
  const navigate = useNavigate();

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
            src={`/images/avatar2.jpg`}
            alt="Profile"
            className=" border-4 border-white aspect-1/1 rounded-full object-cover"
          />
        </div>

        <div className="text-white text-4xl h-auto flex flex-col flex-grow justify-around items-center">
          <Redirect link="/dashboard/conversations" icon={<Icon icon="chat" />} />
          <Redirect link="/dashboard/wishlist" icon={<Icon icon="gift" />} />
          <Redirect link="/dashboard/profile" icon={<Icon icon="user" />} />
        </div>
      </div>
      <div className="text-white h-2/12 flex flex-col justify-between items-center content-center">
        <Redirect onClick={handleLogout} icon={<Icon icon="logout" className="text-4xl" />} />
        <p className="font-poppins-extra-bold text-xl">GiftChat.</p>
      </div>
    </div>
  );
}
