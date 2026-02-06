import { dateOrStringToDate, isSameDate } from "../../../utils/dateCalculator";

type TimeLigneProps = {
  date: Date | string;
};

function getJourWeek(date: Date): string {
  const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return jours[date.getDay()];
}

function getMois(date: Date): string {
  const mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  return mois[date.getMonth()];
}

const TimeLigne = ({ date }: TimeLigneProps) => {
  const dateObj = dateOrStringToDate(date);

  function dateText(date: Date): string {
    const today = new Date();
    // si c'est haujourd'hui, on affiche "Aujourd'hui"
    if (isSameDate(date, today)) {
      return "Aujourd'hui";
    }
    // si c'est hier, on affiche "Hier"
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (isSameDate(date, yesterday)) {
      return "Hier";
    }

    // si c'est dans la même semaine, on affiche le jour de la semaine
    const weekMax = new Date(today);
    weekMax.setDate(today.getDate() - 7);

    if (date.getTime() > weekMax.getTime()) {
      return getJourWeek(date);
    }

    // si c'est dans la même année, on affiche le jour et le mois
    if (date.getFullYear() === today.getFullYear()) {
      return `${getJourWeek(date)} ${date.getDate()} ${getMois(date)}`;
    }

    // sion on affiche le jour, le mois et l'année
    return `${getJourWeek(date)} ${date.getDate()} ${getMois(date)} ${date.getFullYear()}`;
  }
  return (
    <div className="flex items-center justify-center my-[8px]">
      <p className="">{dateText(dateObj)}</p>
    </div>
  );
};

export default TimeLigne;
