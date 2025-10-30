import { FaArrowCircleRight, FaRegHeart, FaRegUser } from "react-icons/fa";
import { FiLogOut, FiPlusCircle } from "react-icons/fi";
import { HiDotsVertical, HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoChatboxEllipsesOutline, IoGiftOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

export type IconProps = {
  icon: "dots" | "plus" | "heart" | "dollar" | "arrow" | "logout" | "user" | "gift" | "chat" | "close";
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
  chat: IoChatboxEllipsesOutline,
  close: IoMdClose,
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
