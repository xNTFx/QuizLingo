import DeckSelection from "./DeckSelection";

export default function DeckSelectionContainer({
  deckList,
  selectedDeck,
  id,
  currentDeck,
  setCurrentDeck,
  isInitialDeck = true,
}: {
  deckList: any;
  selectedDeck: any;
  id: string | undefined;
  currentDeck: { deckId: string; deckName: string };
  setCurrentDeck: React.Dispatch<
    React.SetStateAction<{ deckId: string; deckName: string }>
  >;
  isInitialDeck?: boolean;
}) {
  return (
    <div className="mt-10 w-8/12 bg-black">
      {!selectedDeck && id === "0" ? (
        <DeckSelection
          deckList={deckList}
          currentDeck={currentDeck}
          setCurrentDeck={setCurrentDeck}
          isInitialDeck={isInitialDeck}
        />
      ) : null}
    </div>
  );
}
