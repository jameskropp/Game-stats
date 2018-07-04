import React, { Component } from 'react';
import { asReactiveLoader } from 'mobx-models/reactiveLoader';
import { Provider } from 'mobx-react';
import styled from 'styled-components';

import LeagueStore from '../stores/LeagueStore';
import Header from './Header';
import Search from './Search';
import ProfileContainer from './ProfileContainer/ProfileContainer';

@asReactiveLoader
class App extends Component {
  render() {
    return (
      <Provider>
        <ContentContainer id="content-container">
          <Header />
          <Search />
          {LeagueStore.summonerLoaded && LeagueStore.summonerName ? (
            <ProfileContainer profile={LeagueStore.summonerProfile} />
          ) : (
            ''
          )}
        </ContentContainer>
      </Provider>
    );
  }
}

const ContentContainer = styled.div`
  height: 100%;
`;

export default App;
