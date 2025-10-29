// import { Query, Resolver, ID } from "type-graphql";
// import { WishlistItem } from "../entities/WishlistItem";

// @Resolver()
// export default class WishlistResolver {

//     // in-memory store
//     private static items: WishlistItem[] = [
//         {
//             id: "1",
//             name: "Noise-cancelling headphones",
//             description: "Over-ear, comfy for long sessions",
//             imageUrl: "https://cdn.thewirecutter.com/wp-content/media/2023/09/noise-cancelling-headphone-2048px-0876.jpg",
//             listId: "demo-list",
//             userId: "demo-user",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         },
//         {
//             id: "2",
//             name: "Nintendo Switch Console",
//             description: "Neon Blue/Red Joy-Con edition",
//             imageUrl: "https://www.shutterstock.com/image-photo/cheshire-england-august-7th-2018-260nw-1173580291.jpg",
//             listId: "demo-list",
//             userId: "demo-user",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         },
//         {
//             id: "3",
//             name: "Mario Kart 8 Deluxe",
//             description: "Multiplayer racing fun for the Switch",
//             imageUrl: "https://cdn.cultura.com/cdn-cgi/image/width=830/media/pim/TITELIVE/12_0045496420246_jm.jpg",
//             listId: "demo-list",
//             userId: "demo-user",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         },
//         {
//             id: "4",
//             name: "The Legend of Zelda: Breath of the Wild",
//             description: "Open-world adventure game",
//             imageUrl: "https://i5.walmartimages.com/asr/88fdeff7-b5c7-4dc1-9d30-66217f20f86c.3d08635afa4636f1074ae99ebf602b92.jpeg",
//             listId: "demo-list",
//             userId: "demo-user",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         },
//         {
//             id: "5",
//             name: "Nintendo Switch Pro Controller",
//             description: "Ergonomic controller for long gaming sessions",
//             imageUrl: "https://m.media-amazon.com/images/I/71Eeyub6v6L.jpg",
//             listId: "demo-list",
//             userId: "demo-user",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         },
//         {
//             id: "6",
//             name: "Kindle Paperwhite",
//             description: "E-reader with adjustable warm light",
//             imageUrl: "https://images.pexels.com/photos/844734/pexels-photo-844734.jpeg?cs=srgb&dl=pexels-ozgur-844734.jpg&fm=jpg",
//             listId: "demo-list",
//             userId: "demo-user",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         },
//         {
//             id: "7",
//             name: "Hiking backpack",
//             description: "Good quality, durable, water-resistant",
//             imageUrl: "https://images.unsplash.com/photo-1509762774605-f07235a08f1f?fm=jpg",
//             listId: "demo-list",
//             userId: "demo-user",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         },
//         {
//             id: "8",
//             name: "Fender Acoustic Guitar",
//             description: "Beginner-friendly dreadnought with case",
//             imageUrl: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?cs=srgb&dl=pexels-42north-1407322.jpg",
//             listId: "demo-list",
//             userId: "demo-user",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         },
//         {
//             id: "9",
//             name: "Front-loading clothes washer",
//             description: "Nice clothes washer",
//             imageUrl: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?fm=jpg",
//             listId: "demo-list",
//             userId: "demo-user",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         },
//         {
//             id: "10",
//             name: "Apple Watch Series 9",
//             description: "Smartwatch with fitness and health tracking",
//             imageUrl: "https://images.unsplash.com/photo-1517420879524-86d64ac2f339?fm=jpg",
//             listId: "demo-list",
//             userId: "demo-user",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         },

//     ];

//     @Query(() => [WishlistItem])
//     async wishlistItems(): Promise<WishlistItem[]> {
//         // newest first
//         return WishlistResolver.items;
//     }

//     // @Mutation(() => ID)
//     // async createWishlistItem(@Arg("data") data: AddWishlistItemInput) {
//     //     const wishlistItem = WishlistItem.create({

//     //     })
//     // }
// }
