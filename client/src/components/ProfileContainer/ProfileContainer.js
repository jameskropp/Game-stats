import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

import LeagueStore from '../../stores/LeagueStore';
import MatchCard from './MatchCard';

@observer
class ProfileContainer extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    uri: null
  };

  componentDidMount() {
    const { profile } = this.props;
    // If Image is broken replace with placeholder
    this.setState({
      uri: `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/${
        profile.profileIconId
      }.png`
    });

    // Force reload matches when summoner has changed
    LeagueStore.setMatchesLoaded(false);
    LeagueStore.fetchSummonerMatches(profile.accountId).then(() => {
      LeagueStore.setMatchesLoaded(true);
    });
  }

  // Load 5 more matches
  loadMoreMatches = () => {
    LeagueStore.setMatchesLoaded(false);
    LeagueStore.loadMoreMatches().then(() => {
      LeagueStore.setMatchesLoaded(true);
    });
  };

  render() {
    const { profile } = this.props;

    return (
      <Paper style={paperStyle}>
        <SummonerProfile>
          <Card style={profileStyle}>
            <img
              className="league-avatar"
              src={this.state.uri}
              onError={() =>
                this.setState({ uri: 'http://via.placeholder.com/128x128' })
              }
            />
            <CardContent>
              <PlayerName>
                <h3>{profile.name}</h3>
                <h4>Level: {profile.summonerLevel}</h4>
              </PlayerName>
              {profile.posHistory && profile.posHistory[0] ? (
                <PlayerStats>
                  <p>Tier: {profile.posHistory[0].tier}</p>
                  <p>Wins: {profile.posHistory[0].wins}</p>
                  <p>Losses: {profile.posHistory[0].losses}</p>
                  <p>
                    Win Ratio:{' '}
                    {Math.floor(
                      (profile.posHistory[0].wins /
                        (profile.posHistory[0].wins +
                          profile.posHistory[0].losses)) *
                        100
                    )}%
                  </p>
                </PlayerStats>
              ) : (
                ''
              )}
            </CardContent>
          </Card>
        </SummonerProfile>
        <MatchContainer>
          <h2>Match History</h2>
          {LeagueStore.matchesLoaded ? (
            <MatchHistory>
              {LeagueStore.summonerMatches.map((match, i) => {
                return <MatchCard match={match} key={`match-${i}`} />;
              })}
              <Button
                variant="outlined"
                color="primary"
                onClick={this.loadMoreMatches}
              >
                Load More
              </Button>
            </MatchHistory>
          ) : (
            <LoadingZone>
              <CircularProgress size={50} />
            </LoadingZone>
          )}
        </MatchContainer>
      </Paper>
    );
  }
}

const SummonerProfile = styled.div`
  flex: 1;
  padding: 5px;

  .league-avatar {
    margin-bottom: -15px;
    height: 128px;
    width: 128px;
  }
`;

const MatchContainer = styled.div`
  flex: 4;
  padding: 10px;
`;

const MatchHistory = styled.div`
  display: 'flex';
  justify-content: 'center';
`;

const LoadingZone = styled.div`
  display: 'flex';
  align-items: 'center';
`;

const PlayerStats = styled.div`
  p {
    margin: 1px;
    padding: 0px;
  }
`;

const PlayerName = styled.div`
  h3 {
    margin-top: 5px;
    margin-bottom: -20px;
  }
`;

const paperStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  margin: '20px',
  padding: '10px',
  backgroundColor: '#FAFAFA'
};

const profileStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: '10px'
};

export default ProfileContainer;
