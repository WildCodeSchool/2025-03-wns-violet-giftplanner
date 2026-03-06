/// <reference types="@testing-library/jest-dom" />
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Wishlist from "../src/components/Wishlist";
import { ADD_GIFT, DELETE_GIFT, UPDATE_GIFT } from "../src/graphql/operations/wishlistOperations";

/* 
1) What do we want to test ?

Rendering states :
    - Error
    - Empty (no gift ideas present, shows "Aucune idée pour l'instant.")
    - Loading (shows a handful of skeleton elements)
    - Normal (renders GiftCard items for each gift)

Add gift flow :
    - Click 'add idea' and opens modal (title = "Ajouter une nouvelle idée")
    - Completes name field (at minimum) and optional additional fields, submits
    - Calls addGift mutation -> will depend on userId, will refetch after
    - Closes modal

Delete gift flow :
    - Click delete button on GiftCard element
    - Calls deleteGift mutation -> will depend on gift id, will refetch after

2) What needs to be 'mocked' (dependencies we need to imitate for complete testing) ?

    - Zustand profile store
    - Apollo hooks -> useQuery, useMutation
    - GiftCard + Skeleton

*/

// creation of mock functions, since we don't want to rely on Apollo (real) results for testing
const { mockUseQuery, mockUseMutation } = vi.hoisted(() => ({
    mockUseQuery: vi.fn(),
    mockUseMutation: vi.fn(),
}))

// replacement of apollo real hooks with mock ones in the apollo/client object
vi.mock("@apollo/client", async () => {
    const actual = await vi.importActual<any>("@apollo/client");
    return {
        ...actual,
        useQuery: (...args: any[]) => mockUseQuery(...args),
        useMutation: (...args: any[]) => mockUseMutation(...args),
    };
});

// mocking the Zustand profile store -> so the 'add' feature works
vi.mock("../src/zustand/myProfileStore", () => ({
    useMyProfileStore: (selector: any) =>
        selector({
            userProfile: { id: "7" },
        }),
}));

// mock the Modal and GiftCard to isolate testing on Wishlist
vi.mock("../src/components/utils/Modal", () => ({
    default: ({ isOpen, children }: any) =>
        isOpen ? <div data-testid="modal">{children}</div> : null,
}));

vi.mock("../src/components/wishlist/GiftCard", () => ({
    __esModule: true,
    default: ({ gift, onEdit, onDelete }: any) => (
        <div data-testid={`gift-${gift.id}`}>
            <div>{gift.name}</div>
            <button type="button" onClick={() => onEdit(gift)}>edit</button>
            <button type="button" onClick={() => onDelete(gift)}>delete</button>
        </div>
    ),
    GiftCardSkeleton: () => <div data-testid="gift-skeleton" />,
}));

describe("Wishlist", () => {
    const mockAddGift = vi.fn();
    const mockDeleteGift = vi.fn();
    const mockUpdateGift = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        mockUseQuery.mockReset();
        mockUseMutation.mockReset();

        mockUseMutation.mockImplementation((doc: any) => {
            if (doc === ADD_GIFT) return [mockAddGift, { loading: false }];
            if (doc === DELETE_GIFT) return [mockDeleteGift, { loading: false }];
            if (doc === UPDATE_GIFT) return [mockUpdateGift, { loading: false }];

            // Fallback in case something else uses useMutation
            return [vi.fn(), { loading: false }];
        });
    });

    test("affiche l'état vide quand aucun item et pas de loading", () => {
        mockUseQuery.mockReturnValue({
            data: { myWishlistItems: [] },
            loading: false,
            error: undefined,
        });

        render(<Wishlist />);

        expect(screen.getByText("Aucune idée pour l'instant.")).toBeInTheDocument();
    });

    test("affiche une erreur si la query échoue", () => {
        mockUseQuery.mockReturnValue({
            data: undefined,
            loading: false,
            error: { message: "Oops"}
        });

        render(<Wishlist />);

        expect(screen.getByText(/Erreur:/)).toBeInTheDocument();
        expect(screen.getByText(/Oops/)).toBeInTheDocument();
    });

    test("affiche les skeletons pendant le loading", () => {
        mockUseQuery.mockReturnValue({
            data: undefined,
            loading: true,
            error: undefined
        });

        render(<Wishlist />);

        expect(screen.getAllByTestId("gift-skeleton").length).toBeGreaterThan(0);
    });

    test("ouvre le modal d'ajout et soumet un nouveau cadeau", async () => {
        mockUseQuery.mockReturnValue({
            data: { myWishlistItems: [] },
            loading: false,
            error: undefined
        });

        mockAddGift.mockResolvedValue({ data: { addGift: { id: 1 } } });

        const user = userEvent.setup();
        render(<Wishlist />);

        await user.click(screen.getAllByText("Nouvelle idée")[0]);

        expect(screen.getByText("Ajouter une nouvelle idée")).toBeInTheDocument();

        await user.type(screen.getByLabelText("Nom"), "Nintendo Switch");
        await user.click(screen.getByRole("button", { name: "Ajouter" }));

        await waitFor(() => expect(mockAddGift).toHaveBeenCalledTimes(1));

        // Assert variables are correct (most important part)
        const callArg = mockAddGift.mock.calls[0][0];
        expect(callArg.variables).toEqual({
        data: {
            name: "Nintendo Switch",
            description: undefined,
            imageUrl: undefined,
            url: undefined,
            userId: 7, // Number("7") => 7
        },
        });

        // Also assert it refetches MY_WISHLIST_ITEMS (we don't compare query object deeply here)
        expect(callArg.awaitRefetchQueries).toBe(true);
        expect(callArg.refetchQueries?.length).toBe(1);
    });

    // todo : add test for editing a gift idea

});