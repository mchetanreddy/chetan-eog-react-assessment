import { createSlice, PayloadAction } from 'redux-starter-kit';
export type Measurements = {
  measurements: any;
  unit: string,
  metricName: string,
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  measurements: [],
  unit:'',
  metricName: '',
};


const slice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    measurementsDataRecevied: (state, action: PayloadAction<Measurements>) => {
      const { measurements = [] } = action.payload;
      const metricName = (measurements && measurements[0] && measurements[0].metric) || '';
      const unit = (measurements && measurements[0] && measurements[0].unit) || '';
      const data:any = measurements.map((item:any) => ({
        xaxis: item.at,
        yaxis: item.value,
        unit,
        metricName,
      }));

      state.measurements = data;
      state.metricName = metricName;
      state.unit = unit;
    },
    measurementsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
