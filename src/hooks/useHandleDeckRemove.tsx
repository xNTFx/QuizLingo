import { useCallback } from "react";

import {
  useDeleteDeckMutation,
  useDeleteVocabularyMutation,
} from "../API/Redux/reduxQueryFetch";
import { VocabularyType } from "../types/APITypes";
import { extractMultipleAudioAndImageSrc } from "../utils/extractAudioAndImageSrc";

export default function useHandleDeckRemove() {
  const [deleteVocabulary] = useDeleteVocabularyMutation();
  const [deleteDeck] = useDeleteDeckMutation();

  const handleDeckRemove = useCallback(
    async (deckId: number | null) => {
      if (!deckId) return;

      try {
        const data = await window.electronAPI.invoke(
          "get-vocabulary-to-delete-deck",
          {
            deckId: deckId,
          }
        );

        const fileSrcList: string[] = [];
        const fileDeckSrcList: string[] = [];

        data.forEach((element: VocabularyType) => {
          const audioSrcs =
            extractMultipleAudioAndImageSrc(element.audio_name) ?? [];
          const imgSource1 =
            extractMultipleAudioAndImageSrc(element.front_desc_html) ?? [];
          const imgSource2 =
            extractMultipleAudioAndImageSrc(element.back_desc_html) ?? [];

          const validAudioSrcs = audioSrcs.filter(
            (src): src is string => src !== null
          );
          const validImgSource1 = imgSource1.filter(
            (src): src is string => src !== null
          );
          const validImgSource2 = imgSource2.filter(
            (src): src is string => src !== null
          );

          if (element.deck_id === deckId) {
            fileDeckSrcList.push(
              ...validAudioSrcs,
              ...validImgSource1,
              ...validImgSource2
            );
          } else {
            fileSrcList.push(
              ...validAudioSrcs,
              ...validImgSource1,
              ...validImgSource2
            );
          }
        });

        const filteredFileSrcList = [...new Set(fileSrcList.filter(Boolean))];
        const filteredFileDeckSrcList = [
          ...new Set(fileDeckSrcList.filter(Boolean)),
        ];
        const uniqueSrcList = filteredFileDeckSrcList.filter(
          (item) => !filteredFileSrcList.includes(item)
        );

        await deleteDeck(deckId).unwrap();

        await Promise.all(
          data.map((element: VocabularyType) =>
            deleteVocabulary(element.vocabulary_id).unwrap()
          )
        );

        if (uniqueSrcList.length > 0) {
          uniqueSrcList.forEach((element) => {
            window.electronAPI.send("remove-file-from-public", {
              uniqueFilename: element,
            });
          });
        }
      } catch (err) {
        console.error(
          "Error during deck or vocabulary deletion, or file removal:",
          err
        );
      }
    },
    [deleteDeck, deleteVocabulary]
  );

  return handleDeckRemove;
}
