import getProfilePictureUrl from "../../../utils/pictureProfileManager";

type MessageProps = {
  text: string;
  imageUrl: string;
  align?: "left" | "right";
};

export default function Message({ text, imageUrl, align = "left" }: MessageProps) {
  const isLeft = align === "left";

  return (
    <div className={`flex items-end ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
      <div className={`flex  ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
        {/* Avatar */}
        <div
          className={`flex ${isLeft ? "justify-start" : "justify-end"} w-[70px] h-[70px] min-aspect[1/1] rounded-full `}
        >
          <img src={getProfilePictureUrl(imageUrl)} alt="Profile" className="rounded-full object-cover" />
        </div>

        {/* Message bubble TO DO: make it a component */}
        <div
          className={`max-w-xs px-4 wrap-anywhere py-2 mt-[3rem] rounded-2xl whitespace-pre-wrap ${isLeft ? "bg-grey rounded-tl-none" : "bg-light-grey rounded-tr-none"}`}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
