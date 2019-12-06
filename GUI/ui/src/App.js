import React from 'react';
import { Grid } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import { AppContainer } from '@marklogic-community/grove-core-react-redux-containers';

import Routes from './components/Routes';
import Navbar from './components/Navbar';

const App = appProps => (
  <AppContainer
    {...appProps}
    render={props => (
      <div>
        <Navbar
          isAuthenticated={props.isAuthenticated}
          currentUsername={props.currentUser}
          submitLogout={props.submitLogout}
        />
        <Grid fluid={true}>
          <Routes {...props} />
        </Grid>
      </div>
    )}
  />
);

export default withRouter(App);
