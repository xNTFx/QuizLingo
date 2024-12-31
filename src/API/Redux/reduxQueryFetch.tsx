import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";

import {
  AddVocabularyType,
  ElectronBaseQueryArgs,
  GetDeckWithCountType,
  GetDecksType,
  GetVocabularyArgumentsType,
  GetVocabularyToReviewArgType,
  GetVocabularyToReviewType,
  ReviewsHistory,
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

    getDecks: builder.query({
      query: () => ({
        url: "get-decks",
        method: "GET",
      }),
      providesTags: ["decks", "vocabulary"],
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

    createReviewsHistory: builder.mutation<
      void,
      {
        vocabularyId: number;
        easeFactor: number;
        quality: number;
        repetition: number;
        reviewDate: string;
      }
    >({
      query: ({
        vocabularyId,
        easeFactor,
        quality,
        repetition,
        reviewDate,
      }) => {
        return {
          url: "create-reviews-history",
          method: "POST",
          body: { vocabularyId, easeFactor, quality, repetition, reviewDate },
        };
      },
      invalidatesTags: ["vocabulary"],
    }),

    getReviewsHistory: builder.query<
      ReviewsHistory[],
      { vocabularyId: number | undefined }
    >({
      query: ({ vocabularyId }) => {
        return {
          url: "get-reviews-history",
          method: "GET",
          body: { vocabularyId },
        };
      },
      providesTags: ["vocabulary"],
    }),

    getReviewAndNewCountPerDate: builder.query<
      { review_date: string; new_count: string; review_count: string }[],
      {}
    >({
      query: () => {
        return {
          url: "get-revies-and-new-count-per-date",
          method: "GET",
        };
      },
      providesTags: ["vocabulary"],
    }),
  }),
});

export const {
  useGetVocabularyQuery,
  useUpdateVocabularyMutation,
  useGetDecksQuery,
  useCreateDeckMutation,
  useDeleteDeckMutation,
  useUpdateDeckMutation,
  useAddVocabularyMutation,
  useDeleteVocabularyMutation,
  useGetVocabularyToReviewQuery,
  useUpdateReviewMutation,
  useUpdateDeckImgMutation,
  useCreateReviewsHistoryMutation,
  useGetReviewsHistoryQuery,
  useGetReviewAndNewCountPerDateQuery,
} = learningAppApi;
