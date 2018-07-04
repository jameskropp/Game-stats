import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import styled from 'styled-components';

import LeagueStore from '../../stores/LeagueStore';
import SpellsContainer from './SpellsContainer';
import ItemsContainer from './ItemsContainer';

@observer
class MatchDetails extends Component {
  render() {
    const { playerStats, gameLength } = this.props;

    return (
      <DetailsContainer>
        <h3>Game Overview:</h3>
        <p>- Champion Level: {playerStats.stats.champLevel}</p>
        <p>
          - {playerStats.stats.totalMinionsKilled} CS ({Math.floor(
            playerStats.stats.totalMinionsKilled / gameLength
          )}{' '}
          cs/min)
        </p>

        <ExtraContainer>
          <SpellsContainer playerStats={playerStats} />
          <ItemsContainer playerStats={playerStats} />
        </ExtraContainer>
      </DetailsContainer>
    );
  }
}

const DetailsContainer = styled.div`
  color: black;
`;

const ExtraContainer = styled.div`
  color: black;
`;

export default MatchDetails;
