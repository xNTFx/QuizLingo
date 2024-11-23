import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";

import { GetDecksType } from "../../../types/APITypes";

interface DeckSelectionTypes {
  deckList: GetDecksType[];
  currentDeck: { deckId: string; deckName: string };
  setCurrentDeck: React.Dispatch<
    React.SetStateAction<{ deckId: string; deckName: string }>
  >;
  isInitialDeck: boolean;
}

export default function DeckSelection({
  deckList,
  currentDeck,
  setCurrentDeck,
  isInitialDeck,
}: DeckSelectionTypes) {
  const { id } = useParams();

  const darkTheme = createTheme({
    components: {
      MuiList: {
        styleOverrides: {
          root: {
            backgroundColor: "black",
          },
        },
      },
    },
    palette: {
      mode: "dark",
    },
  });

  function findDeckById(deckId: string) {
    return deckList?.find((deck) => String(deck.deck_id) === deckId) || null;
  }

  const initialDeck = findDeckById(id ?? "0") || deckList[0];

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <FormControl fullWidth>
          <InputLabel id="add-deck-select-label">Deck</InputLabel>
          <Select
            labelId="add-deck-select-label"
            id="add-deck-select"
            value={
              Number(currentDeck.deckId) ||
              (isInitialDeck ? initialDeck.deck_id : 0)
            }
            label="Deck"
            onChange={(event) => {
              const selectedId = event.target.value;
              const selectedDeck = findDeckById(selectedId.toString());
              setCurrentDeck({
                deckId: selectedId.toString(),
                deckName: selectedDeck?.deck_name || "",
              });
            }}
          >
            {!isInitialDeck && <MenuItem value="0">All Decks</MenuItem>}

            {deckList?.map((deck) => (
              <MenuItem key={deck.deck_id} value={deck.deck_id}>
                {deck.deck_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ThemeProvider>
    </>
  );
}
