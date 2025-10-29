import { useWishlistItemsQuery } from "../generated/graphql";
import LoadingHomePage from "../pages/loadingHomePage/LoadingHomePage";

export default function Wishlist() {
  const { data, loading, error } = useWishlistItemsQuery();

  if (loading) return <LoadingHomePage />;
  if (error) return <div>Oops: {error.message}</div>;

  interface WishlistItem {
    id: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    price?: number | null;
  }

  const items = data?.wishlistItems ?? [];
  const PLACEHOLDER =
    "https://img.freepik.com/free-psd/birthday-colorful-present-box-design_23-2150318126.jpg";

  return (
    <div className="h-full p-4 px-2 flex flex-col mx-auto bg-[#EA4B09] rounded-2xl">
      {/* Header */}
      <div className="flex justify-between text-[#FDFBF6] p-3 pb-6">
        <div className="flex items-center">
          <span className="mr-1 text-3xl">♥</span>
          <h2 className="text-2xl font-bold tracking-wide">Ma wishlist</h2>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-[#019645] text-[#FDFBF6] font-semibold px-4 p-2 rounded-xl hover:bg-[#01803b] transition"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FDFBF6] text-[#019645] font-bold">
            +
          </span>
          Nouvelle idée
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-5">
        <ul className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          {items.map((i: WishlistItem) => (
            <li key={i.id} className="bg-[#FDFBF6] rounded-lg shadow overflow-hidden flex flex-col">
              {/* card-img-top */}
              <img src={i.imageUrl ?? PLACEHOLDER} alt={i.name} className="w-full h-50 object-cover" />

              {/* card-body */}
              <div className="p-3 flex-1 flex flex-col">
                <h5 className="text-lg font-semibold text-[#200904] mb-2">{i.name}</h5>
                {i.description && <p className="text-sm text-[#200904] opacity-80 flex-1">{i.description}</p>}
                {i.price && <p className="mt-3 font-medium text-[#200904]">${i.price}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
