import React from 'react';
import { AppRegistry } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import AppReducer from './state/AppReducer';
import SchedulePoller from './state/SchedulePoller';
import AppWithNavigationState from './navigators/AppNavigator';

class Root extends React.Component {
  store = createStore(AppReducer);

  constructor(props) {
    super(props);
      SchedulePoller.start(this.store.dispatch, 'east');
      SchedulePoller.start(this.store.dispatch, 'west');
  }

  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('BusScheduleApp', () => Root);
AppRegistry.runApplication('BusScheduleApp', { rootTag: document.getElementById('root') });
