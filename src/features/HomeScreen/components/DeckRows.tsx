import { Menu, MenuItem, ThemeProvider, createTheme } from "@mui/material";
import { useState } from "react";
import { FaGear } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import useSwalPopupBoxes from "../../../hooks/useSwalPopupBoxes";
import { GetDeckWithCountType, GetDecksType } from "../../../types/APITypes";
import DeckImage from "./DeckImage";

export default function DeckRows({
  data,
  setIsChangeImageBoxOpen,
  useSelectedDeck,
}: {
  data: GetDecksType[];
  setIsChangeImageBoxOpen: React.Dispatch<React.SetStateAction<boolean>>;
  useSelectedDeck: React.Dispatch<
    React.SetStateAction<GetDeckWithCountType | null>
  >;
}) {
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
    deckId: number,
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
        className="flex flex-col gap-2 rounded-md bg-[#2C2C2C] p-2"
      >
        <div className="flex flex-row gap-4">
          <button
            onClick={() => {
              setIsChangeImageBoxOpen((prev) => !prev);
              useSelectedDeck(deck);
            }}
            className="relative h-[64px] w-[64px] rounded hover:opacity-40"
          >
            <DeckImage deckImg={deck.deck_img} />
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded bg-black/50 text-white opacity-0 hover:opacity-100">
              <p>Change Image</p>
            </div>
          </button>
          <div className="w-[30rem] max-w-[30rem]">
            <h2 className="max-w-[30rem] overflow-auto text-lg">
              {deck.deck_name}
            </h2>
            {Number(deck.total_words) > 0 ? (
              <div>
                <div className="flex justify-end">
                  <p className="text-sm">{`${deck.learned_words}/${deck.total_words} vocabulary learned`}</p>
                </div>
                <div className="relative h-2 w-full rounded-lg bg-gray-600">
                  <div
                    style={{
                      width: `${deckProgress * 100}%`,
                    }}
                    className="absolute h-2 w-[30rem] max-w-[30rem] rounded-lg bg-yellow-400"
                  ></div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="relative w-8">
            <button
              className="absolute p-1 text-center transition-transform hover:rotate-90"
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
            className="w-[14.375rem] rounded-lg bg-blue-600 py-[0.25rem] hover:opacity-80"
            style={Number(deck.new) === 0 ? { opacity: 0.4 } : undefined}
          >{`New vocabulary: ${deck.new}`}</button>
          <button
            onClick={() =>
              navigate(`${deck.deck_id}/mode-selection/new-reviews`)
            }
            disabled={Number(deck.review) === 0}
            className="w-[14.375rem] rounded-lg bg-green-600 py-[0.25rem] hover:opacity-80"
            style={Number(deck.review) === 0 ? { opacity: 0.4 } : undefined}
          >{`Review vocabulary: ${deck.review}`}</button>
        </div>
      </article>
    );
  });

  return deckRows;
}
