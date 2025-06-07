import axios from 'axios';
import { API_BASE_URL } from '../../../config/constants';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/flashcards`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const flashCardApi = {
  getDecks: () => api.get('/decks'),
  getDeckCards: (deckId: string) => api.get(`/decks/${deckId}/cards`),
  recordAnswer: (cardId: string, isCorrect: boolean, confidence?: string) =>
    api.post(`/cards/${cardId}/answer`, { isCorrect, confidence }),
  getUserStats: (deckId?: string) => 
    api.get('/stats', { params: { deckId } })
};
