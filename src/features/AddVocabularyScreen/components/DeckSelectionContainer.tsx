import DeckSelection from "./DeckSelection";

export default function DeckSelectionContainer({
  deckList,
  selectedDeck,
  id,
  currentDeckName,
  setCurrentDeckName,
}: {
  deckList: any;
  selectedDeck: any;
  id: string | undefined;
  currentDeckName: string;
  setCurrentDeckName: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="mt-10 w-8/12 bg-black">
      {!selectedDeck && id === "0" ? (
        <DeckSelection
          deckList={deckList}
          currentDeckName={currentDeckName}
          setCurrentDeckName={setCurrentDeckName}
        />
      ) : null}
    </div>
  );
}
