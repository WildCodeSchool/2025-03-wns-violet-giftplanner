import { FaArrowCircleRight, FaRegUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { HiDotsVertical, HiOutlineCurrencyDollar } from "react-icons/hi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { ImCancelCircle } from "react-icons/im";
import { IoIosClose } from "react-icons/io";
import { IoChatboxEllipsesOutline, IoSearch } from "react-icons/io5";
import { LuCirclePlus, LuGift, LuHeart } from "react-icons/lu";
import { RiImageCircleLine } from "react-icons/ri";

export type IconTypes =
  | "dots"
  | "plus"
  | "heart"
  | "dollar"
  | "arrow"
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
  arrow: FaArrowCircleRight,
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

  return (
    <div className={`flex items-center gap-1 ${text ? "" : className || ""}`}>
      <IconComponent className={className || ""} />
      {text && <span>{text}</span>}
    </div>
  );
}
