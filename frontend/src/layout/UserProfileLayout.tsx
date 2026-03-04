import LoadingHomePage from "../pages/loadingHomePage/LoadingHomePage";
import UserProfilePage from "../pages/UserProfilePage";
import { useMyProfileStore } from "../zustand/myProfileStore";

const UserProfileLayout = () => {
  const { userProfile } = useMyProfileStore();

  return userProfile?.id ? <UserProfilePage /> : <LoadingHomePage />;
};

export default UserProfileLayout;
