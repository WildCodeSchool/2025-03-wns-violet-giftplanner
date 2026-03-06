import { useNavigate } from "react-router-dom";

type RedirectProps = {
  link?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

export default function NavigationLink({ link, icon, onClick }: RedirectProps) {
  const navigate = useNavigate();
  return (
    <button
      data-testid={icon}
      type="button"
      onClick={
        link
          ? () => {
              navigate(`${link}`);
            }
          : onClick
      }
    >
      {icon}
    </button>
  );
}
