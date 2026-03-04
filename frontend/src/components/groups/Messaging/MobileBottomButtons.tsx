import { LuHeart, LuMessageCircleMore, LuPiggyBank } from "react-icons/lu";

export type MobileView = "chat" | "wishlist" | "cagnotte";

type MobileBottomButtonsProps = {
  currentView: MobileView;
  onChatClick: () => void;
  onWishlistClick: () => void;
  onCagnotteClick: () => void;
};

export default function MobileBottomButtons({
  currentView,
  onChatClick,
  onWishlistClick,
  onCagnotteClick,
}: MobileBottomButtonsProps) {
  const renderLeftButton = () => {
    if (currentView === "wishlist") {
      return (
        <button
          type="button"
          onClick={onChatClick}
          className="flex-1 flex items-center justify-center gap-2 bg-blue text-white rounded-xl py-3 font-semibold text-base"
        >
          <LuMessageCircleMore className="text-2xl" />
          Discussion
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={onWishlistClick}
        className="flex-1 flex items-center justify-center gap-2 bg-orange text-white rounded-xl py-3 font-semibold text-base"
      >
        <LuHeart className="text-2xl" />
        Wishlist
      </button>
    );
  };

  const renderRightButton = () => {
    if (currentView === "cagnotte") {
      return (
        <button
          type="button"
          onClick={onChatClick}
          className="flex-1 flex items-center justify-center gap-2 bg-blue text-white rounded-xl py-3 font-semibold text-base"
        >
          <LuMessageCircleMore className="text-2xl" />
          Discussion
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={onCagnotteClick}
        className="flex-1 flex items-center justify-center gap-2 bg-yellow text-white rounded-xl py-3 font-semibold text-base"
      >
        <LuPiggyBank className="text-2xl" />
        Cagnotte
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex gap-4 p-4 bg-white border-t border-gray-200 max-w-screen-sm mx-auto">
      {renderLeftButton()}
      {renderRightButton()}
    </div>
  );
}
