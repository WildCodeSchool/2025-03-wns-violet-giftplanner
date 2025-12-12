import type { Gift } from "../../types/Gift";
// import type { WishlistItemProps } from "../../types/Groups";
import Button from "../utils/Button";
import Card from "../utils/Card";
import Container from "../utils/Container";

<<<<<<< HEAD
type Props = {
  beneficiaryItems: Gift[];
  groupItems: Gift[];
  onAddIdea?: () => void; // later for opening modal ?
};

export default function Wishlist({ beneficiaryItems, groupItems, onAddIdea }: Props) {
  return (
    <Container
      colour="orange"
      title="Wishlist du groupe"
      button={<Button text="Proposer une idée" icon="plus" colour="green" onClick={onAddIdea} />}
    >
      {/* Beneficiary wishlist */}
      <section className="mb-6">
        <h3 className="text-md font-semibold mb-2 text-[#200904]">Idées du bénéficiaire</h3>

        {beneficiaryItems.length === 0 ? (
          <p className="text-gray-600 text-sm">Aucune idée ajoutée par le bénéficiaire.</p>
        ) : (
          <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {beneficiaryItems.map((gift) => (
              <Card key={gift.id} id={Number(gift.id)} title={gift.name} large square>
                <p className="text-gray-600 text-xs sm:text-sm">{gift.description}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Group suggestions */}
      <section>
        <h3 className="text-md font-semibold mb-2 text-[#200904]">Idées proposées par le groupe</h3>

        {groupItems.length === 0 ? (
          <p className="text-gray-600 text-sm">Aucune idée proposée pour le moment.</p>
        ) : (
          <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {groupItems.map((gift) => (
              <Card key={gift.id} id={Number(gift.id)} title={gift.name} large square>
                <p className="text-gray-600 text-xs sm:text-sm">{gift.description}</p>
              </Card>
            ))}
          </div>
        )}
      </section>
=======
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
>>>>>>> dev
    </Container>
  );
}
