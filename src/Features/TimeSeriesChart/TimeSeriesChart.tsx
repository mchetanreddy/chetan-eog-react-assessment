import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IState } from '../../store';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
      value
      metric
      unit
    }
  }
}
`;
const now:any = new Date();
const timeRangeLimit = now - 30 * 60 * 1000;

const getMetricsValues = (state: IState) => {
  const { getMetrics } = state.metrics;
  return {
    getMetrics
  };
};

export default () => {
  return (
    <Provider value={client}>
      <TimeSeriesChart />
    </Provider>
  );
};

const TimeSeriesChart = () => {
  const dispatch = useDispatch();
  const metric = useSelector(({ metrics }: IState) => metrics.selectedMetric);
  const [result] = (useQuery({
    query,
    variables: {
      input: [{
        metricName: metric,
        after: timeRangeLimit
      }]
    },
  }));
  const { fetching, data, error} = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.measurementsApiErrorReceived({ error: error.message }));
    }
    if (!data) {
      return
    };
    if(data) {
      const storeObj = {
        measurements: data.getMultipleMeasurements[0].measurements || []
      };
      dispatch(actions.measurementsDataRecevied(storeObj));
    }
  }, [dispatch, data, error]);

  if (fetching) {
    console.log(fetching);
  };
  
  return <LinearProgress />;
};
