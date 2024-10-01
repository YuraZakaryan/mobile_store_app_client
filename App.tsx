import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import Navigation from './app/navigation/';
import { setupStore } from './app/redux/store';

const App = () => {
  const store = setupStore();
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <Navigation />
    </Provider>
  );
};
export default App;
