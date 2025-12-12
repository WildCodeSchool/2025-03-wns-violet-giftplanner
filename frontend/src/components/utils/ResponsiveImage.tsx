interface ResponsiveImageProps {
  src: string;
  alt: string;
  maxWidth?: string; // Tailwind values like "w-40", "w-64", "w-full"
  rounded?: boolean;
}

export default function ResponsiveImage({
  src,
  alt = "",
  maxWidth = "w-40",
  rounded = false,
}: ResponsiveImageProps) {
  return (
    <div
      className={`
          shrink-0             
          ${maxWidth}          
        `}
    >
      <img
        src={src}
        alt={alt}
        className={`
            w-1/4 h-auto       
            border-2 border-black
            object-cover
            ${rounded ? "rounded-lg" : ""}
          `}
      />
    </div>
  );
}
