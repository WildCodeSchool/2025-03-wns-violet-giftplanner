import { Link } from "react-router";

type AuthFooterProps = {
  children?: React.ReactNode;
  link: string;
  to: string;
};

export default function AuthFooter({ children, link, to }: AuthFooterProps) {
  return (
    <div className="flex-shrink-0 mt-2 md:mt-0">
      <p className="text-base text-dark font-inter font-normal md:text-xl">
        {children}
        <Link to={to} className="text-dark no-underline font-semibold text-base md:text-xl">
          {link}
        </Link>
      </p>
    </div>
  );
}
