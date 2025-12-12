import type { WishlistItemProps } from "../../types/Groups";
import Button from "../utils/Button";
import Card from "../utils/Card";
import Container from "../utils/Container";

type WishlistProps = {
  wishlistItems?: WishlistItemProps[];
};

export default function Wishlist({ wishlistItems = [] }: WishlistProps) {
  return (
    <Container
      colour="orange"
      title="Wishlist"
      button={<Button text="Proposition" icon="plus" colour="green" />}
    >
      {wishlistItems.length > 0 ? (
        wishlistItems.map((item) => {
          return (
            <Card key={item.id} id={item.id} title={item.title} large square>
              <p className="text-gray-600 text-xs sm:text-sm">{item.description}</p>
            </Card>
          );
        })
      ) : (
        <p className="text-white">Cette liste d'idées est vide. Il va falloir trouver un cadeau...</p>
      )}
    </Container>
  );
}
