import type { WishlistItemProps } from "../../types/Groups";
import Button from "../utils/Button";
import Card from "../utils/Card";
import Container from "../utils/Container";

export default function Wishlist({ wishlistItems }: { wishlistItems: WishlistItemProps[] }) {
  return (
    <Container
      colour="orange"
      title="Whislist"
      button={<Button text="Proposition" icon="plus" colour="green" />}
    >
      {wishlistItems.map((item) => {
        return (
          <Card key={item.id} id={item.id} title={item.title} large square>
            <p className="text-gray-600 text-xs sm:text-sm">{item.description} test test step </p>
          </Card>
        );
      })}
    </Container>
  );
}
