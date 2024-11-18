import { useNavigate } from "react-router-dom";
import { GetDecksType, GetDeckWithCountType } from "../../../types/APITypes";
import { createTheme, Menu, MenuItem, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { FaGear } from "react-icons/fa6";

import useSwalPopupBoxes from "../../../hooks/useSwalPopupBoxes";

export default function DeckRows({ data }: { data: GetDecksType[] }) {
  //Used to set the position of the popover
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);

  const { updateDeckFunction, handleDeckRemoveFunction } = useSwalPopupBoxes();

  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>,
    deckId: number
  ) {
    setAnchorEl(event.currentTarget);
    setSelectedDeckId(deckId);
  }

  function handleClose() {
    setAnchorEl(null);
    setSelectedDeckId(null);
  }

  if (!data) return;

  const deckRows = data?.map((deck: GetDeckWithCountType) => (
    <tr key={deck.deck_id} className="text-center">
      <td className="max-w-[50vw] select-text overflow-auto text-start">
        <button
          onClick={() => {
            navigate(`${deck.deck_id}/mode-selection`);
          }}
          className="cursor-pointer rounded-lg p-1 hover:bg-black hover:underline"
        >
          {deck.deck_name}
        </button>
      </td>
      <td className="px-2 pl-8 text-blue-700">{deck.new ? deck.new : "0"}</td>
      <td className="px-2 text-green-400">{deck.review ? deck.review : "0"}</td>
      <td className="relative px-2 text-center">
        <button
          className="text-center transition-transform hover:rotate-90"
          onClick={(event) => handleClick(event, deck.deck_id)}
        >
          <FaGear />
        </button>
        <ThemeProvider theme={darkTheme}>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={selectedDeckId === deck.deck_id}
            onClose={handleClose}
          >
            <MenuItem>Settings</MenuItem>
            <MenuItem
              onClick={() => {
                updateDeckFunction(deck.deck_id, deck.deck_name);
                handleClose();
              }}
            >
              Rename
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDeckRemoveFunction(deck.deck_id);
                handleClose();
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </ThemeProvider>
      </td>
    </tr>
  ));

  return deckRows;
}
