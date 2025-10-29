type TitleProps = {
  text: string;
  className?: string;
};

export default function Title({ text, className }: TitleProps) {
  return <h2 className={`text-white font-poppins-extre-bold ${className}`}>{text}</h2>;
}
