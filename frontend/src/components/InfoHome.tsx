import { Link } from "react-router";
import HomeBackground from "./HomeBackground";

const InfoHome = () => {
  return (
    <div className="relative h-full w-full overflow-hidden z-0">
      <HomeBackground />
      <Link to={"/"} className="relative z-10">
        <p className="font-poppins-extra-bold text-white text-4xl">GiftChat.</p>
      </Link>
      <div className="relative z-10 flex flex-col items-center h-full justify-center ">
        <h1 className="flex items-center justify-center text-5xl font-inter font-normal text-white leading-[70px] mt-0">
          Faites plaisir à vos proches en leur offrant le cadeau de leurs rêves.
        </h1>
      </div>
    </div>
  );
};

export default InfoHome;

{
  /* <img className="absolute -z-10 w-[600px] top-[10px] left-[-96px]" src="/images/serpentin-jaune.png" alt="Serpentin Jaune" />
      <img className="absolute -z-10 w-[200px] top-[200px] right-5" src="/images/carre-vert.png" alt="Carré vert" />
      <img className="absolute -z-10 w-[300px] top-[800px]" src="/images/etoile-rose.png" alt="Etoile rose" />
      <img className="absolute -z-10 w-[600px] top-[700px] right-[-100px]" src="/images/cotillon-rouge.png" alt="Cotillon rouge" /> */
}
