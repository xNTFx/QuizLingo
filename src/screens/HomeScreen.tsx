import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import {
  useGetDecksWithLimitQuery,
  useUpdateDeckMutation,
} from "../API/Redux/reduxQueryFetch";
import ChangeImageBox from "../features/HomeScreen/components/ChangeImageBox";
import DeckRows from "../features/HomeScreen/components/DeckRows";
import useSwalPopupBoxes from "../hooks/useSwalPopupBoxes";
import { GetDeckWithCountType } from "../types/APITypes";

export default function HomeScreen() {
  const [isChangeImageBoxOpen, setIsChangeImageBoxOpen] = useState(false);
  const [selectedDeck, useSelectedDeck] = useState<GetDeckWithCountType | null>(
    null,
  );
  const [decks, setDecks] = useState<GetDeckWithCountType[]>([]);

  const { createDeckFunction } = useSwalPopupBoxes();

  const { data, isLoading } = useGetDecksWithLimitQuery({
    limit: 100,
    offset: 0,
  });
  const [updateDeck] = useUpdateDeckMutation();

  useEffect(() => {
    if (data) {
      setDecks(data);
    }
  }, [data]);

  if (!data) {
    return;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // handle drag end
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) {
      return; // dropped outside of the list
    }

    const updatedDecks = Array.from(decks);
    const [movedDeck] = updatedDecks.splice(source.index, 1);
    updatedDecks.splice(destination.index, 0, movedDeck);

    const updatedDeckWithPositions = updatedDecks.map((deck, index) => ({
      ...deck,
      deck_position: updatedDecks.length - index,
    }));

    setDecks(updatedDeckWithPositions);
    updatedDeckWithPositions.forEach(
      (deck, index) =>
        deck.deck_position !== updatedDecks[index].deck_position &&
        updateDeck({
          deckId: deck.deck_id,
          deckName: deck.deck_name,
          deckPosition: deck.deck_position,
        }),
    );
  };

  return (
    <main className="flex h-[calc(100vh-3rem)] select-none flex-col items-center bg-[#1F1F1F]">
      {isChangeImageBoxOpen ? (
        <ChangeImageBox
          setIsChangeImageBoxOpen={setIsChangeImageBoxOpen}
          selectedDeck={selectedDeck}
        />
      ) : null}
      {decks.length > 0 ? (
        <div
          id="scrollableDiv"
          className="mt-10 box-border flex max-h-[80vh] flex-col overflow-auto rounded-lg p-4 text-white shadow-md"
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="decks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col"
                >
                  {decks.map((deck, index) => (
                    <Draggable
                      key={deck.deck_id}
                      draggableId={deck.deck_id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-4 rounded-lg bg-[#2b2b2b] shadow-md"
                        >
                          <DeckRows
                            data={[deck]}
                            setIsChangeImageBoxOpen={setIsChangeImageBoxOpen}
                            useSelectedDeck={useSelectedDeck}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ) : (
        <div className="mt-10">
          <h2 className="text-xl">Please, create a deck</h2>
        </div>
      )}
      <div className="text-white">
        <button
          onClick={() => createDeckFunction(data)}
          className="w-40 rounded-xl bg-[#382bf0] p-2 font-extrabold hover:bg-[#5e43f3]"
        >
          Create Deck
        </button>
      </div>
    </main>
  );
}
