import { Link } from "react-router";

const InfoHome = () => {
  return (
    <div className="relative h-full w-full overflow-hidden z-0 bg-blue infohome-background">
      <Link to={"/"} className="relative z-10 ">
        <p className="font-poppins-extra-bold text-white text-4xl pt-2 pl-2">GiftChat.</p>
      </Link>
      <img className="infohome-serpentin" src="/images/serpentin-jaune.png" alt="Serpentin Jaune" />
      <img className="infohome-carre" src="/images/carre-vert.png" alt="Carré vert" />
      <img className="infohome-etoile" src="/images/etoile-rose.png" alt="Etoile rose" />
      <img className="infohome-cotillon" src="/images/cotillon-rouge.png" alt="Cotillon rouge" />
      <div className="relative z-10 flex flex-col items-center h-full justify-center ">
        <h1 className="flex items-center justify-center lg:text-6xl lg:leading-14 md:text-5xl t md:leading-12 font-medium text-white px-16">
          Faites plaisir à vos proches en leur offrant le cadeau de leurs rêves.
        </h1>
      </div>
    </div>
  );
};

export default InfoHome;
