import { learningAppApi } from '../API/Redux/reduxQueryFetch';
import { setupApiStore } from '../test-utils';
import { UnknownAction } from '@reduxjs/toolkit';

// Mock window.electronAPI
const mockInvoke = jest.fn();
window.electronAPI = {
  send: jest.fn(),
  receive: jest.fn(),
  invoke: mockInvoke,
};

describe('Learning App API', () => {
    const { store } = setupApiStore(learningAppApi);
    
    beforeEach(() => {
      mockInvoke.mockClear();
    });
  
    describe('getVocabulary', () => {
      it('should fetch vocabulary with correct parameters', async () => {
        const mockResponse = [{ 
          vocabulary_id: 1,
          front_word: 'test',
          back_word: 'test',
          deck_id: 1,
          audio_name: null,
          front_word_html: '',
          back_word_html: '',
          front_desc_html: '',
          back_desc_html: '',
          deck_name: 'Test Deck'
        }];
        mockInvoke.mockResolvedValueOnce(mockResponse);
  
        const action = learningAppApi.endpoints.getVocabulary.initiate({
          deckId: 1,
          limit: 10,
          offset: 0,
          search: '',
        }) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('get-vocabulary-to-browse', {
          deckId: 1,
          limit: 10,
          offset: 0,
          search: '',
        });
      });
    });
  
    describe('updateVocabulary', () => {
      it('should update vocabulary with correct parameters', async () => {
        const mockVocabulary = {
          vocabulary_id: 1,
          front_word: 'updated',
          back_word: 'updated',
          audio_name: null,
          front_word_html: '',
          back_word_html: '',
          front_desc_html: null,
          back_desc_html: null
        };
        mockInvoke.mockResolvedValueOnce(mockVocabulary);
  
        const action = learningAppApi.endpoints.updateVocabulary.initiate(
          mockVocabulary
        ) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('update-vocabulary', mockVocabulary);
      });
    });
  
    describe('addVocabulary', () => {
      it('should add vocabulary with correct parameters', async () => {
        const newVocabulary = {
          deckId: 1,
          frontWord: 'new',
          backWord: 'new',
          audioName: null,
          frontWordHTML: '',
          backWordHTML: '',
          frontDescHTML: null,
          backDescHTML: null
        };
        const mockResponse = { flashcardId: 1 };
        mockInvoke.mockResolvedValueOnce(mockResponse);
  
        const action = learningAppApi.endpoints.addVocabulary.initiate(
          newVocabulary
        ) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('add-flashcard', newVocabulary);
      });
    });
  
    describe('getDecks', () => {
      it('should fetch all decks', async () => {
        const mockDecks = [{
          deck_id: 1,
          deck_name: 'Test Deck',
          deck_img: 'test.jpg',
          deck_position: 1,
          new: '0',
          review: '0',
          total_words: '0',
          learned_words: '0'
        }];
        mockInvoke.mockResolvedValueOnce(mockDecks);
  
        const action = learningAppApi.endpoints.getDecks.initiate({
          limit: 10,
          offset: 0
        }) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('get-decks', undefined);
      });
    });
  
    describe('createDeck', () => {
      it('should create deck with correct parameters', async () => {
        const newDeck = {
          deck_name: 'New Deck',
          deck_img: 'image.jpg',
          deck_position: 1,
        };
        const mockResponse = {
          deck_id: 1,
          deck_name: 'New Deck',
          deck_img: 'image.jpg',
          deck_position: 1,
          new: '0',
          review: '0',
          total_words: '0',
          learned_words: '0'
        };
        mockInvoke.mockResolvedValueOnce(mockResponse);
  
        const action = learningAppApi.endpoints.createDeck.initiate(
          newDeck
        ) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('create-deck', newDeck);
      });
    });
  
    describe('deleteDeck', () => {
      it('should delete deck with correct id', async () => {
        mockInvoke.mockResolvedValueOnce(undefined);
  
        const action = learningAppApi.endpoints.deleteDeck.initiate(1) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('delete-deck', { deckId: 1 });
      });
    });
  
    describe('updateDeck', () => {
      it('should update deck with correct parameters', async () => {
        const updatedDeck = {
          deckId: 1,
          deckName: 'Updated Deck',
          deckPosition: 2
        };
        mockInvoke.mockResolvedValueOnce(updatedDeck);
  
        const action = learningAppApi.endpoints.updateDeck.initiate(
          updatedDeck
        ) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('update-deck', updatedDeck);
      });
    });
  
    describe('deleteVocabulary', () => {
      it('should delete vocabulary with correct id', async () => {
        mockInvoke.mockResolvedValueOnce(undefined);
  
        const action = learningAppApi.endpoints.deleteVocabulary.initiate(1) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('delete-vocabulary', { vocabularyId: 1 });
      });
    });
  
    describe('getVocabularyToReview', () => {
      it('should fetch vocabulary to review with correct parameters', async () => {
        const mockResponse = [{
          review_id: 1,
          vocabulary_id: 1,
          review_date: '2025-01-03',
          ease_factor: 2.5,
          repetition: 1,
          deck_id: 1,
          front_word: 'test',
          back_word: 'test',
          audio_name: null,
          front_word_html: '',
          back_word_html: '',
          front_desc_html: null,
          back_desc_html: null
        }];
        mockInvoke.mockResolvedValueOnce(mockResponse);
  
        const action = learningAppApi.endpoints.getVocabularyToReview.initiate({
          deckId: 1,
          limit: 10,
          type: 'review',
        }) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('get-vocabulary-to-review', {
          deckId: 1,
          limit: 10,
          type: 'review',
        });
      });
    });
  
    describe('updateReview', () => {
      it('should update review with correct parameters', async () => {
        const reviewUpdate = {
          reviewId: 1,
          vocabularyId: 1,
          reviewDate: '2025-01-03',
          easeFactor: 2.5,
          repetition: 1,
        };
        mockInvoke.mockResolvedValueOnce(undefined);
  
        const action = learningAppApi.endpoints.updateReview.initiate(
          reviewUpdate
        ) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('update-review', reviewUpdate);
      });
    });
  
    describe('updateDeckImg', () => {
      it('should update deck image with correct parameters', async () => {
        const updateData = {
          deck_id: 1,
          deck_img: 'new-image.jpg',
        };
        mockInvoke.mockResolvedValueOnce(undefined);
  
        const action = learningAppApi.endpoints.updateDeckImg.initiate(
          updateData
        ) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('update-deck-img', updateData);
      });
    });
  
    describe('createReviewsHistory', () => {
      it('should create review history with correct parameters', async () => {
        const reviewHistory = {
          vocabularyId: 1,
          easeFactor: 2.5,
          quality: 4,
          repetition: 1,
          reviewDate: '2025-01-03',
        };
        mockInvoke.mockResolvedValueOnce(undefined);
  
        const action = learningAppApi.endpoints.createReviewsHistory.initiate(
          reviewHistory
        ) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('create-reviews-history', reviewHistory);
      });
    });
  
    describe('getReviewsHistory', () => {
      it('should fetch review history with correct parameters', async () => {
        const mockResponse = [
          { 
            review_history_id: 1, 
            vocabulary_id: 1, 
            review_date: '2025-01-03',
            ease_factor: 2.5,
            quality: 4
          }
        ];
        mockInvoke.mockResolvedValueOnce(mockResponse);
  
        const action = learningAppApi.endpoints.getReviewsHistory.initiate({
          vocabularyId: 1
        }) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('get-reviews-history', { vocabularyId: 1 });
      });
    });
  
    describe('getReviewAndNewCountPerDate', () => {
      it('should fetch review and new count per date', async () => {
        const mockResponse = [
          { 
            review_date: '2025-01-03',
            new_count: '5',
            review_count: '10',
          }
        ];
        mockInvoke.mockResolvedValueOnce(mockResponse);
  
        const action = learningAppApi.endpoints.getReviewAndNewCountPerDate.initiate({}) as unknown as UnknownAction;
  
        await store.dispatch(action);
  
        expect(mockInvoke).toHaveBeenCalledWith('get-revies-and-new-count-per-date', undefined);
      });
    });
  });