import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient'; // Make sure this is configured

export const fetchUserData = createAsyncThunk(
    'UserData/fetchUserData',
    async (email: string) => {
        console.log(email)
      const { data, error } = await supabase
        .from('user_podcast_data')
        .select('*')
        .eq('email', email) // Fetch by email
        .single(); // Expect a single row
  
      if (error) {
        console.error('Error fetching user data:', error.message);
        throw new Error(error.message);
      }
      
      return data;
    }
  );

// Async action to update liked podcasts
export const updateLikedPodcasts = createAsyncThunk(
    'UserData/updateLikedPodcasts',
    async ({ userEmail, liked }: { userEmail: string; liked: string[] }) => {
      const { data, error } = await supabase
        .from('user_podcast_data')
        .upsert({ email: userEmail, liked })
        .eq('email', userEmail); 
      if (error) throw new Error(error.message);
      return liked;
    }
  );
  
  // Async action to update last listened podcast
  export const updateLastListenedPodcast = createAsyncThunk(
    'UserData/updateLastListened',
    async ({ userEmail, last_listen }: { userEmail: string; last_listen: string }) => {
      const { data, error } = await supabase
        .from('user_podcast_data')
        .upsert({ email: userEmail, last_listen })
        .eq('email', userEmail); 
  
      if (error) throw new Error(error.message);
      return last_listen;
    }
  );
  

interface PodcastUserDataState {
  userData: {
    email: string;
    created_at: string;
    listen_time: string[];
    liked: string[];
    last_listen: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: PodcastUserDataState = {
  userData: null,
  loading: false,
  error: null,
};

const podcastUserDataSlice = createSlice({
  name: 'podcastUserData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload; // Data from Supabase
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user data';
      });
  },
});

export default podcastUserDataSlice.reducer;
