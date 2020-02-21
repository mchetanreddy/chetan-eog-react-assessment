import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Measurements = {
  measurements: any;
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  measurements: [],
};


const slice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    measurementsDataRecevied: (state, action: PayloadAction<Measurements>) => {
      const { measurements } = action.payload;
      state.measurements = measurements;
    },
    measurementsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
