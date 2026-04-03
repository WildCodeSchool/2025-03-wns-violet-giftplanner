type SubtitleProps = {
  className?: string;
  children?: React.ReactNode;
  dark?: boolean;
};

export default function Subtitle({ dark = false, className, children }: SubtitleProps) {
  const fontColour = dark ? "text-dark" : "text-white";

  return (
    <h3
      className={`${fontColour} ${!className?.includes("font-") ? "font-poppins-extra-bold" : ""} ${className}`}
    >
      {children}
    </h3>
  );
}
