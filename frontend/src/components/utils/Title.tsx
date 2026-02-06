type SubtitleProps = {
  className?: string;
  children?: React.ReactNode;
  dark: boolean;
};

export default function Subtitle({ dark = false, className, children }: SubtitleProps) {
  const fontColour = dark ? "text-dark" : "text-white";

  return <h2 className={`${fontColour} text-3xl font-inter-extra-bold ${className}`}>{children}</h2>;
}
