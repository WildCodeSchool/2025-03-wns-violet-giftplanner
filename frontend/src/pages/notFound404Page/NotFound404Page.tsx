import { Link } from "react-router";
import style from "./NotFound404Page.module.css";

const NotFound404Page = () => {
  return (
    <div className={style.notfoundContainer}>
      <h1 className={style.notfoundTitle}>404</h1>
      <p className={style.notfoundSubtitle}>Oups... Cette page n’existe pas.</p>
      <p className={style.notfoundText}>La ressource que vous cherchez est introuvable ou a été déplacée.</p>
      <Link to="/dashboard" className={style.notfoundButton}>
        ⬅️ Retour à l’accueil
      </Link>

      {/* Bulles décoratives */}
      <div className={style.bubble}></div>
      <div className={style.bubble}></div>
      <div className={style.bubble}></div>
    </div>
  );
};

export default NotFound404Page;
