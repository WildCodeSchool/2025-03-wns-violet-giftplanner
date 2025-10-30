import Wishlist from "../components/Wishlist";

const WishListPage = () => {
  return (
    <div className="h-dvh p-6">
      <div className="flex gap-6 h-full">
        {/* <Sidebar /> */}
        <div className="flex-1">
          <Wishlist />
        </div>
      </div>
    </div>
  );
};

export default WishListPage;
