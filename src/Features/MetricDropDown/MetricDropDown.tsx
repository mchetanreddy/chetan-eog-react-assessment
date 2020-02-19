import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IState } from '../../store';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
{
  getMetrics
}`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

const getMetricsValues = (state: IState) => {
  const { getMetrics } = state.metrics;
  return {
    getMetrics
  };
};

export default () => {
  return (
    <Provider value={client}>
      <MetricDropDown />
    </Provider>
  );
};

const MetricDropDown = () => {
  const dispatch = useDispatch();
  const [result] = useQuery({
    query,
    variables: {},
  });
  const { fetching, data, error} = result;
  const {
    getMetrics,
  } = useSelector(getMetricsValues);
  const classes = useStyles();
  const [metric, setMetric] = useState('');

  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) {
      return
    };
    if(data) {
      dispatch(actions.metricsDataRecevied(data));
    }
    
  }, [dispatch, data, error]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const { value } = event.target;
    const storeObj = {
      selectedMetric: value
    };
    setMetric(value as string);
    dispatch(actions.metricSelected(storeObj as any))
  };

  if (fetching) {
    return <LinearProgress />
  };
  if (getMetrics.length !== 0){
    const menuItemsList = getMetrics.map((metric:any) => 
      (<MenuItem value={metric}>{metric}</MenuItem>)
    );
    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="select-metric">Select Metric</InputLabel>
          <Select
            labelId="select-metric-label"
            id="metrics"
            value={metric}
            onChange={handleChange}
          >
            {menuItemsList}
          </Select>
        </FormControl>
      </div>
    );
  }
  return <LinearProgress />;
};
