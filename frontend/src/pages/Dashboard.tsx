import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";

export default function Dashboard() {
  return (
    <div className="h-[100vh] min-aspect-[900/600] flex flex-row p-[2vw] m-auto overflow-hidden">
      <Navigation />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
