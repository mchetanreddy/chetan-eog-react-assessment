import { TimeSeries } from "pondjs";
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
      const { measurements = [] } = action.payload;
      const metricName = (measurements && measurements[0] && measurements[0].metric) || '';
      const data:any =  new TimeSeries({
        name: metricName,
        columns: ["time", "value", "unit"],
        points: measurements.map((pt:any) => [pt.at, pt.value, pt.unit])
      });

      state.measurements = data;
    },
    measurementsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
