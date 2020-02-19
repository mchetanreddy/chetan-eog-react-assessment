import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metrics = {
  selectedMetric: any;
  getMetrics: any;
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  getMetrics: [],
  selectedMetric:'',
};


const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsDataRecevied: (state, action: PayloadAction<Metrics>) => {
      const { getMetrics } = action.payload;
      state.getMetrics = getMetrics;
    },
    metricSelected: (state, action: PayloadAction<Metrics>) => {
      const { selectedMetric } = action.payload;
      state.selectedMetric = selectedMetric;
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
