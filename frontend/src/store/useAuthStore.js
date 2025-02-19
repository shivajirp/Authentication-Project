import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({isLoading: true, error: null});

    try {
        const response = await axios.post(`${API_URL}/signup`, {email, password, name});
        set({user: response.data.user, isLoading: false, isAuthenticated: true})

    } catch (error) {
        set({isLoading: false, error: error.response?.data?.message || "error signing up"})
        throw error;
    }
  },

  verifyMail: async (code) => {
    set({isLoading: true, error: null});

    try {
        const response = await axios.post(`${API_URL}/verify-email`, {code});
        set({isLoading: false, isAuthenticated: true,user: response.data.user})
        return response.data

    } catch (error) {
        set({isLoading: false, error: error.response.data.message});
        throw error;
    }

  },

  checkAuth: async () => {
    set({error: null, isCheckingAuth: true});
    try {
      const response = await axios.get(`${API_URL}/check-auth`)
      set({isAuthenticated: true, isCheckingAuth: false, user: response.data.user})

    } catch (error) {
      set({error: null, isCheckingAuth: false, isAuthenticated: false})
    }
  },

  login: async (email, password) => {
    set({isLoading: true, error: null});

    try {
        const response = await axios.post(`${API_URL}/login`, {email, password});
        set({isAuthenticated:true, isLoading: false, user: response.data.user})

    } catch (error) {
        set({isLoading: false, error: error.response.data.message});
        throw error;
    }
  }

}))
