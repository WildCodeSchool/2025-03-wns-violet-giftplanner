import { FiPlusCircle, FiLogOut  } from "react-icons/fi";
import { FaArrowCircleRight, FaRegHeart, FaRegUser } from "react-icons/fa";
import { HiDotsVertical, HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoGiftOutline } from "react-icons/io5";
import { IoChatboxEllipsesOutline } from "react-icons/io5";




export type IconProps = {
  icon: "dots" | "plus" | "heart" | "dollar" | "arrow" | "logout" | "user" | "gift" | "chat";
  text?: string;
  className?: string;
};

const iconMap = {
  dots: HiDotsVertical,
  plus: FiPlusCircle,
  heart: FaRegHeart,
  dollar: HiOutlineCurrencyDollar,
  arrow: FaArrowCircleRight,
  logout: FiLogOut,
  user: FaRegUser,
  gift: IoGiftOutline,
  chat: IoChatboxEllipsesOutline
};

export default function Icon({ icon, text, className }: IconProps) {
  const IconComponent = iconMap[icon];

  return (
    <div className={`flex items-center gap-1 ${className || ""}`}>
      <IconComponent className="" />
      {text && <span>{text}</span>}
    </div>
  );
}
