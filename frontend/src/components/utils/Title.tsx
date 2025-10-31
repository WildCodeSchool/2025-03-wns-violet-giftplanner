type TitleProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function Title({ className, children }: TitleProps) {
  return <h2 className={`text-white font-poppins-extra-bold ${className}`}>{children}</h2>;
}
