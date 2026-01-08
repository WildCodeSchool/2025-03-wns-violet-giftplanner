import { Link } from "react-router";
import HomeBackground from "./HomeBackground";

const InfoHome = () => {
  return (
    <div className="relative h-full w-full overflow-hidden z-0">
      <HomeBackground />
      <Link to={"/"} className="relative z-10 ">
        <p className="font-poppins-extra-bold text-white text-4xl pt-2 pl-2">GiftChat.</p>
      </Link>
      <div className="relative z-10 flex flex-col items-center h-full justify-center ">
        <h1 className="flex items-center justify-center text-6xl leading-16 font-inter font-normal text-white px-16">
          Faites plaisir à vos proches en leur offrant le cadeau de leurs rêves.
        </h1>
      </div>
    </div>
  );
};

export default InfoHome;
