import { Outlet } from "react-router-dom";
import Navigation from "../components/navigation/Navigation";
import BottomNavigation from "../components/navigation/BottomNavigation";
import { useIsMobile } from "../hooks/useIsMobile";

export default function Dashboard() {
  const isMobile = useIsMobile();

  return (
    <div className="h-[100vh] min-aspect-[900/600] flex flex-row p-[2vw] m-auto overflow-hidden max-md:p-0">
      {!isMobile && <Navigation />}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
      {isMobile && <BottomNavigation />}
    </div>
  );
}
