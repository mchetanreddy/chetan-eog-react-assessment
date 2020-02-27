import { spawn } from 'redux-saga/effects';
import weatherSaga from '../Features/Weather/saga';
import metricSaga from '../Features/MetricDropDown/saga';
import measurementSaga from '../Features/MetricDropDown/saga';

export default function* root() {
  yield spawn(weatherSaga);
  yield spawn(metricSaga);
  yield spawn(measurementSaga);
}
