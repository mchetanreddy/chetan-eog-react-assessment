import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricReducer } from '../Features/MetricDropDown/reducer';
import { reducer as measurementReducer } from '../Features/TimeSeriesChart/reducer';

export default {
  weather: weatherReducer,
  metrics: metricReducer,
  measurements: measurementReducer,
};
