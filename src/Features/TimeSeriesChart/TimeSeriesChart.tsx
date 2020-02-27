import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart, Line, XAxis, YAxis, Label, Tooltip,
} from 'recharts';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import moment from 'moment';
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
  const { 
    measurements,
    unit,
   } = useSelector(({ measurements} : IState) => measurements);
  
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
      const measurements = data.getMultipleMeasurements[0].measurements || [];
      const storeObj = {
        measurements,
        metricName: metric,
        unit: '',
      };
      dispatch(actions.measurementsDataRecevied(storeObj));
    }
  }, [dispatch, data, error, metric]);

  if (fetching) {
    return <>
    </>;
  };
  
  return (
    <LineChart
      width={1024}
      height={500}
      data={measurements}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <XAxis dataKey="xaxis" tickFormatter={(item) => {
        return (moment(item).format('h:mm:ss a'))
      }}>
        <Label value="Time" position="bottom" offset={-5} />
      </XAxis>
      <YAxis label={unit} margin="5"/>
      <Tooltip />
      <Line type="monotone" dataKey="yaxis" stroke="#8884d8" activeDot={{ r: 8 }} ticks="5" label="Unit Name"/>
    </LineChart>
  );
};
