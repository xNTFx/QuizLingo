import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";

import {
  AddVocabularyType,
  ElectronBaseQueryArgs,
  GetDeckWithCountType,
  GetDecksArgsType,
  GetDecksType,
  GetVocabularyArgumentsType,
  GetVocabularyToReviewArgType,
  GetVocabularyToReviewType,
  UpdateDeckImgProps,
  UpdateDeckType,
  UpdateReviewPropsArg,
  UpdateVocabularyParams,
} from "../../types/APITypes";
import { VocabularyType } from "../../types/APITypes";

const electronBaseQuery: BaseQueryFn<
  ElectronBaseQueryArgs,
  unknown,
  unknown
> = async ({ url, body }) => {
  //console.log(`Making IPC call to ${url} with body:`, body);
  try {
    const result = await window.electronAPI.invoke(url, body);
    //console.log(`IPC call successful:`, result);
    return { data: result };
  } catch (error) {
    console.error(`IPC call failed:`, error);
    return { error };
  }
};

export const learningAppApi = createApi({
  reducerPath: "learningAppApi",
  tagTypes: ["vocabulary", "decks"],
  baseQuery: electronBaseQuery,
  endpoints: (builder) => ({
    getVocabulary: builder.query<VocabularyType[], GetVocabularyArgumentsType>({
      query: ({ deckId, limit, offset, search }) => {
        return {
          url: "get-vocabulary-to-browse",
          method: "GET",
          body: { deckId, limit, offset, search },
        };
      },
      providesTags: ["vocabulary"],
    }),

    // getVocabularyForReview: builder.query<
    //   VocabularyType[],
    //   GetVocabularyArgumentsType
    // >({
    //   query: (deckId) => ({
    //     url: "get-vocabulary-to-browse",
    //     method: "GET",
    //     body: { deckId },
    //   }),
    // }),

    updateVocabulary: builder.mutation<VocabularyType, UpdateVocabularyParams>({
      query: (newVocabulary) => ({
        url: "update-vocabulary",
        method: "UPDATE",
        body: newVocabulary,
      }),
      invalidatesTags: ["vocabulary"],
    }),

    addVocabulary: builder.mutation<AddVocabularyType, AddVocabularyType>({
      query: (vocabularyProps) => {
        return {
          url: "add-flashcard",
          method: "POST",
          body: vocabularyProps,
        };
      },
      invalidatesTags: ["vocabulary"],
    }),

    getDecksWithLimit: builder.query<GetDeckWithCountType[], GetDecksArgsType>({
      query: ({ limit, offset }) => ({
        url: "get-decks-with-limit",
        method: "GET",
        body: { limit, offset },
      }),
      providesTags: ["decks", "vocabulary"],
    }),

    getDeckById: builder.query<GetDeckWithCountType[], number>({
      query: (deckId) => ({
        url: "get-deck-by-id",
        method: "GET",
        body: { deckId },
      }),
      providesTags: ["decks", "vocabulary"],
    }),

    getDecks: builder.query<GetDecksType[], void>({
      query: () => ({
        url: "get-decks",
        method: "GET",
      }),
      providesTags: ["decks"],
    }),

    createDeck: builder.mutation<
      GetDeckWithCountType,
      { deck_name: string; deck_img: string; deck_position: number }
    >({
      query: ({ deck_name, deck_img, deck_position }) => {
        return {
          url: "create-deck",
          method: "POST",
          body: { deck_name, deck_img, deck_position },
        };
      },
      invalidatesTags: ["decks"],
    }),

    deleteDeck: builder.mutation<void, number>({
      query: (deckId) => ({
        url: "delete-deck",
        method: "DELETE",
        body: { deckId },
      }),
      invalidatesTags: ["decks"],
    }),

    updateDeck: builder.mutation<GetDecksType, UpdateDeckType>({
      query: (newDeck) => ({
        url: "update-deck",
        method: "UPDATE",
        body: newDeck,
      }),
      invalidatesTags: ["decks"],
    }),

    deleteVocabulary: builder.mutation<VocabularyType, number>({
      query: (vocabularyId) => ({
        url: "delete-vocabulary",
        method: "DELETE",
        body: { vocabularyId },
      }),
      invalidatesTags: ["vocabulary"],
    }),

    getVocabularyToReview: builder.query<
      GetVocabularyToReviewType[],
      GetVocabularyToReviewArgType
    >({
      query: ({ deckId, limit, type }) => ({
        url: "get-vocabulary-to-review",
        method: "GET",
        body: { deckId, limit, type },
      }),
      providesTags: ["vocabulary"],
    }),

    updateReview: builder.mutation<void, UpdateReviewPropsArg>({
      query: ({
        reviewId,
        vocabularyId,
        reviewDate,
        easeFactor,
        repetition,
      }) => ({
        url: "update-review",
        method: "UPDATE",
        body: {
          reviewId,
          vocabularyId,
          reviewDate,
          easeFactor,
          repetition,
        },
      }),
      invalidatesTags: ["vocabulary"],
    }),

    updateDeckImg: builder.mutation<void, UpdateDeckImgProps>({
      query: ({ deck_id, deck_img }) => {
        return {
          url: "update-deck-img",
          method: "UPDATE",
          body: {
            deck_id,
            deck_img,
          },
        };
      },
      invalidatesTags: ["decks"],
    }),
  }),
});

export const {
  useGetVocabularyQuery,
  useUpdateVocabularyMutation,
  useGetDecksQuery,
  useGetDecksWithLimitQuery,
  useCreateDeckMutation,
  useDeleteDeckMutation,
  useUpdateDeckMutation,
  useAddVocabularyMutation,
  useDeleteVocabularyMutation,
  useGetVocabularyToReviewQuery,
  useUpdateReviewMutation,
  useGetDeckByIdQuery,
  useUpdateDeckImgMutation,
} = learningAppApi;
