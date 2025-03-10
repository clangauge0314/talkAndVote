import { createSlice } from '@reduxjs/toolkit';

const membershipSlice = createSlice({
  name: 'membership',
  initialState: {
    grade: null,
    loading: false,
    error: null
  },
  reducers: {
    setMembershipGrade: (state, action) => {
      state.grade = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setMembershipGrade, setLoading, setError } = membershipSlice.actions;
export default membershipSlice.reducer; 