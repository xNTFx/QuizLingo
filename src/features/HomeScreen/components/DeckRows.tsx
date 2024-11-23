import { useNavigate } from "react-router-dom";
import { GetDecksType, GetDeckWithCountType } from "../../../types/APITypes";
import { createTheme, Menu, MenuItem, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { FaGear } from "react-icons/fa6";

import useSwalPopupBoxes from "../../../hooks/useSwalPopupBoxes";
import DeckImage from "./DeckImage";

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

  const deckRows = data?.map((deck: GetDeckWithCountType) => {
    const deckProgress =
      deck.learned_words !== undefined && deck.total_words
        ? Number(deck.learned_words) / Number(deck.total_words)
        : 0;

    return (
      <article
        key={deck.deck_id}
        className="flex flex-col gap-2 bg-[#2C2C2C] p-2 rounded-md"
      >
        <div className="flex flex-row gap-4">
          <button className="hover:opacity-40 w-[64px] h-[64px] relative rounded">
            <DeckImage randomBg={deck.deck_img} />
            <div className="absolute rounded top-0 left-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 text-white">
              <p>Change Image</p>
            </div>
          </button>
          <div className="w-[30rem] max-w-[30rem]">
            <h2 className="text-lg overflow-auto max-w-[30rem]">
              {deck.deck_name}
            </h2>
            <div>
              <div className="flex justify-end">
                <p className="text-sm">{`${deck.learned_words}/${deck.total_words} words learned`}</p>
              </div>
              <div className="w-full h-2 rounded-lg bg-gray-600 relative">
                <div
                  style={{
                    width: `${deckProgress * 100}%`,
                  }}
                  className="h-2 rounded-lg bg-yellow-400 absolute w-[30rem] max-w-[30rem]"
                ></div>
              </div>
            </div>
          </div>
          <div className="relative w-8">
            <button
              className="absolute text-center transition-transform hover:rotate-90 p-1"
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
          </div>
        </div>
        <div className="flex flex-row justify-around">
          <button
            onClick={() => navigate(`${deck.deck_id}/mode-selection/new-words`)}
            disabled={Number(deck.new) === 0}
            className="w-[14.375rem] bg-blue-600 hover:opacity-80 py-[0.25rem] rounded-lg"
            style={Number(deck.new) === 0 ? { opacity: 0.4 } : undefined}
          >{`New vocabulary: ${deck.new}`}</button>
          <button
            onClick={() =>
              navigate(`${deck.deck_id}/mode-selection/new-reviews`)
            }
            disabled={Number(deck.review) === 0}
            className="w-[14.375rem] bg-green-600 hover:opacity-80 py-[0.25rem] rounded-lg"
            style={Number(deck.review) === 0 ? { opacity: 0.4 } : undefined}
          >{`Review vocabulary: ${deck.review}`}</button>
        </div>
      </article>
    );
  });

  return deckRows;
}
