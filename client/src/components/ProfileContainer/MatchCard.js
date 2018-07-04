import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';

import MatchDetails from './MatchDetails';

@observer
class MatchCard extends Component {
  state = {
    expanded: null
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  render() {
    const { expanded } = this.state;
    const { match } = this.props;

    // Find player stats from participant list.
    const statsIndex = match.gameDetails.participants.findIndex(
      obj => obj.participantId === match.gameDetails.currentId
    );
    const playerStats = match.gameDetails.participants[statsIndex];
    const gameLength = moment
      .utc(match.gameDetails.gameDuration * 1000)
      .format('mm:ss');

    return (
      <MatchPanel>
        <ExpansionPanel
          expanded={expanded === 'matchPanel'}
          onChange={this.handleChange('matchPanel')}
          style={panelStyle}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            data-status={playerStats.stats.win}
          >
            <MatchHeading>
              <img
                style={avatarStyle}
                src={`http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${
                  match.championDetails.image.full
                }`}
                alt={match.championDetails.name}
              />
              <PrimaryHeading>
                <p>{playerStats.stats.win ? 'Victory' : 'Defeat'}</p>
                <p>{match.championDetails.name}</p>
              </PrimaryHeading>
              <SecondaryHeading>
                {gameLength} mins
                {` - ${playerStats.stats.kills}/${playerStats.stats.deaths}/${
                  playerStats.stats.assists
                } - ${Math.floor(
                  (playerStats.stats.kills + playerStats.stats.assists) /
                    playerStats.stats.deaths
                )} KDA`}
              </SecondaryHeading>
            </MatchHeading>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {this.state.expanded ? (
              <MatchDetails
                playerStats={playerStats}
                gameLength={moment
                  .utc(match.gameDetails.gameDuration * 1000)
                  .format('mm')}
              />
            ) : (
              ''
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </MatchPanel>
    );
  }
}

const MatchPanel = styled.div`
  color: white;

  [data-status='true'] {
    background-color: #8cd790;
  }
  [data-status='false'] {
    background-color: #e53a40;
  }
`;

const MatchHeading = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const PrimaryHeading = styled.div`
  margin-left: 10px;
  font-size: 18px;
  flex-basis: 33.33%;
  flex-shrink: 0;

  p {
    margin: 1px;
    padding: 0px;
    font-size: 1em;
    font-weight: 0.8em;
    color: white;
  }

  p:nth-child(2) {
    font-size: 0.8em;
    font-weight: 0.5em;
  }
`;

const SecondaryHeading = styled.div`
  font-size: 15px;
  padding-left: 5px;
  color: white;
`;

const panelStyle = {
  marginBottom: '10px',
  width: '100%'
};

const matchStyle = {
  display: 'flex',
  marginBottom: '10px'
};

const avatarStyle = {
  height: '50px',
  width: '50px'
};

export default MatchCard;
