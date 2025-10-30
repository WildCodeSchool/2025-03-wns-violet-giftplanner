export default function Wishlist() {
  // const { data, loading, error } = useWishlistItemsQuery();

  const data = {
    wishlistItems: [
      {
        id: "1",
        name: "Noise-cancelling headphones",
        description: "Over-ear, comfy for long sessions",
        imageUrl:
          "https://cdn.thewirecutter.com/wp-content/media/2023/09/noise-cancelling-headphone-2048px-0876.jpg",
        listId: "demo-list",
        userId: "demo-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Nintendo Switch Console",
        description: "Neon Blue/Red Joy-Con edition",
        imageUrl:
          "https://www.shutterstock.com/image-photo/cheshire-england-august-7th-2018-260nw-1173580291.jpg",
        listId: "demo-list",
        userId: "demo-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Mario Kart 8 Deluxe",
        description: "Multiplayer racing fun for the Switch",
        imageUrl:
          "https://cdn.cultura.com/cdn-cgi/image/width=830/media/pim/TITELIVE/12_0045496420246_jm.jpg",
        listId: "demo-list",
        userId: "demo-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        name: "The Legend of Zelda: Breath of the Wild",
        description: "Open-world adventure game",
        imageUrl:
          "https://i5.walmartimages.com/asr/88fdeff7-b5c7-4dc1-9d30-66217f20f86c.3d08635afa4636f1074ae99ebf602b92.jpeg",
        listId: "demo-list",
        userId: "demo-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5",
        name: "Nintendo Switch Pro Controller",
        description: "Ergonomic controller for long gaming sessions",
        imageUrl: "https://m.media-amazon.com/images/I/71Eeyub6v6L.jpg",
        listId: "demo-list",
        userId: "demo-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "6",
        name: "Kindle Paperwhite",
        description: "E-reader with adjustable warm light",
        imageUrl:
          "https://images.pexels.com/photos/844734/pexels-photo-844734.jpeg?cs=srgb&dl=pexels-ozgur-844734.jpg&fm=jpg",
        listId: "demo-list",
        userId: "demo-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "7",
        name: "Hiking backpack",
        description: "Good quality, durable, water-resistant",
        imageUrl: "https://images.unsplash.com/photo-1509762774605-f07235a08f1f?fm=jpg",
        listId: "demo-list",
        userId: "demo-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "8",
        name: "Fender Acoustic Guitar",
        description: "Beginner-friendly dreadnought with case",
        imageUrl:
          "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?cs=srgb&dl=pexels-42north-1407322.jpg",
        listId: "demo-list",
        userId: "demo-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "9",
        name: "Front-loading clothes washer",
        description: "Nice clothes washer",
        imageUrl: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?fm=jpg",
        listId: "demo-list",
        userId: "demo-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "10",
        name: "Apple Watch Series 9",
        description: "Smartwatch with fitness and health tracking",
        imageUrl: "https://images.unsplash.com/photo-1517420879524-86d64ac2f339?fm=jpg",
        listId: "demo-list",
        userId: "demo-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  // if (loading) return <LoadingHomePage />;
  // if (error) return <div>Oops: {error.message}</div>;

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
