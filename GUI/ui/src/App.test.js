import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

it('renders without crashing', () => {
  const mockStore = {
    getState: () => ({
      user: {}
    }),
    dispatch: () => {},
    subscribe: () => {}
  };

  shallow(<App store={mockStore} />);
});
