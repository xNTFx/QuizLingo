import "@sweetalert2/theme-dark/dark.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Swal from "sweetalert2/dist/sweetalert2.min.js";
import {
  useCreateDeckMutation,
  useUpdateDeckMutation,
} from "../API/Redux/reduxQueryFetch";
import useHandleDeckRemove from "./useHandleDeckRemove";
import useHandleVocabularyRemoveFunction from "../features/BrowseVocabularyScreen/hooks/useHandleVocabularyRemoveFunction";
import { VocabularyType } from "../types/APITypes";

export default function useSwalPopupBoxes() {
  const [createDeck] = useCreateDeckMutation();
  const [updateDeck] = useUpdateDeckMutation();
  const handleDeckRemove = useHandleDeckRemove();
  const handleVocabularyRemoveFunction = useHandleVocabularyRemoveFunction();

  function createDeckFunction() {
    Swal.fire({
      title: "Write a deck name",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Create",
      showLoaderOnConfirm: true,
      preConfirm: async (input: string) => {
        try {
          createDeck(input.trim());
        } catch (error) {
          console.error("An error occurred while creating the deck:", error);
        }
      },
    });
  }

  function updateDeckFunction(deckId: number, deckName: string) {
    Swal.fire({
      title: "Rename the deck",
      input: "text",
      inputValue: deckName,
      showCancelButton: true,
      confirmButtonText: "Update",
      showLoaderOnConfirm: true,
      preConfirm: (input: string) => {
        if (input.trim() !== deckName) {
          updateDeck({ deckId, deckName: input.trim() });
        }
      },
    });
  }

  function handleDeckRemoveFunction(deckId: number) {
    Swal.fire({
      title: "Are you sure you want to delete the deck?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      preConfirm: (response: boolean) => {
        if (response) {
          handleDeckRemove(Number(deckId));
        }
      },
    });
  }

  function removeVocabulary(
    rowId: number,
    data: VocabularyType[],
    setSelectedDeck: React.Dispatch<React.SetStateAction<VocabularyType | null>>
  ) {
    Swal.fire({
      title: "Are you sure you want to delete the vocabulary?",
      icon: "question",
      inputAttributes: { autocapitalize: "off" },
      showCancelButton: true,
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      preConfirm: (response: boolean) => {
        if (response) {
          handleVocabularyRemoveFunction(rowId, data, setSelectedDeck);
        }
      },
    });
  }

  function errorAlert(errorName: string, icon: string) {
    const title = icon.slice(0, 1).toUpperCase() + icon.slice(1);
    Swal.fire({
      title: title,
      text: errorName,
      icon: icon,
      confirmButtonColor: "#3085d6",
    });
  }

  return {
    handleDeckRemoveFunction,
    updateDeckFunction,
    createDeckFunction,
    errorAlert,
    removeVocabulary,
  };
}
