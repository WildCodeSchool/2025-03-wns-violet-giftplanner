import style from "./LoadingHomePage.module.css";

const LoadingHomePage = () => {
  return (
    <div className={style.loadingScreen}>
      <p className={style.loadingText}>
        Chargement
        <span className={style.dots}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
      <div className={style.spinnerContainer}>
        <span className={style.spinner}></span>
      </div>
    </div>
  );
};

export default LoadingHomePage;
