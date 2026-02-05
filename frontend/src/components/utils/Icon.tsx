import { FaArrowCircleRight, FaArrowLeft, FaRegUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { HiDotsVertical, HiOutlineCurrencyDollar } from "react-icons/hi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { ImCancelCircle } from "react-icons/im";
import { IoIosClose } from "react-icons/io";
import { IoChatboxEllipsesOutline, IoSearch } from "react-icons/io5";
import { LuCirclePlus, LuGift, LuHeart, LuPiggyBank } from "react-icons/lu";
import { RiImageCircleLine } from "react-icons/ri";

export type IconTypes =
  | "dots"
  | "plus"
  | "heart"
  | "dollar"
  | "piggyBank"
  | "arrow"
  | "arrowLeft"
  | "logout"
  | "user"
  | "gift"
  | "chat"
  | "close"
  | "doubleChat"
  | "image"
  | "delete"
  | "search";
export type IconProps = {
  icon: IconTypes;
  text?: string;
  className?: string;
};

const iconMap = {
  dots: HiDotsVertical,
  plus: LuCirclePlus,
  heart: LuHeart,
  dollar: HiOutlineCurrencyDollar,
  piggyBank: LuPiggyBank,
  arrow: FaArrowCircleRight,
  arrowLeft: FaArrowLeft,
  logout: FiLogOut,
  user: FaRegUser,
  gift: LuGift,
  chat: IoChatboxEllipsesOutline,
  doubleChat: HiOutlineChatBubbleLeftRight,
  close: ImCancelCircle,
  image: RiImageCircleLine,
  delete: IoIosClose,
  search: IoSearch,
};

export default function Icon({ icon, text, className }: IconProps) {
  const IconComponent = iconMap[icon];

  const isPiggyBank = icon === "piggyBank";
  const isClose = icon === "close";
  const iconSize = isPiggyBank ? "text-3xl" : "text-2xl";
  const iconStroke = isPiggyBank ? 2 : isClose ? undefined : 3;

  return (
    <div className={`flex items-center gap-2 ${text ? "" : className || ""}`}>
      <IconComponent
        className={`${iconSize} ${className || ""}`}
        style={iconStroke ? { strokeWidth: iconStroke } : undefined}
      />
      {text && <span>{text}</span>}
    </div>
  );
}
