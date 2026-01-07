import { Link } from "react-router";

const InfoHome = () => {
  return (
    <div className="infohome-background">
      <Link to={"/"}>
        <img className="infohome-logo" src="/images/logo-clair.png" alt="Logo" />
      </Link>
      <img className="infohome-serpentin" src="/images/serpentin-jaune.png" alt="Serpentin Jaune" />
      <img className="infohome-carre" src="/images/carre-vert.png" alt="Carré vert" />
      <img className="infohome-etoile" src="/images/etoile-rose.png" alt="Etoile rose" />
      <img className="infohome-cotillon" src="/images/cotillon-rouge.png" alt="Cotillon rouge" />
      <div className="infohome-content">
        <h1 className="infohome-content-text">
          Faites plaisir à vos proches en leur offrant le cadeau de leurs rêves.
        </h1>
      </div>
    </div>
  );
};

export default InfoHome;
