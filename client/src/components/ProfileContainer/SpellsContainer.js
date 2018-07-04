import React, { Component } from 'react';
import { observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import styled from 'styled-components';

import LeagueStore from '../../stores/LeagueStore';

@observer
class SpellsContainer extends Component {
  state = {
    spells: [this.props.playerStats.spell1Id, this.props.playerStats.spell2Id]
  };

  componentDidMount() {
    const { playerStats } = this.props;
    LeagueStore.setSpellsLoaded(false);

    const spells = this.state.spells.map(spell => {
      return LeagueStore.fetchSpell(spell).then(() => {
        return;
      });
    });

    Promise.all(spells).then(() => {
      LeagueStore.setSpellsLoaded(true);
      return;
    });
  }

  render() {
    const { playerStats } = this.props;

    return (
      <SpellsDisplay>
        <b>Spells:</b>
        {LeagueStore.spellsLoaded ? (
          <SpellContainer>
            {this.state.spells.map(spell => {
              const spellDetails = LeagueStore.spells[spell];
              if (!spellDetails) return '';

              return (
                <Tooltip
                  key={`spell-tool-${spell}`}
                  title={`${spellDetails.name}`}
                >
                  <img
                    key={`spell-${spell}`}
                    src={`http://ddragon.leagueoflegends.com/cdn/6.24.1/img/spell/${
                      spellDetails.image.full
                    }`}
                    alt={spellDetails.name}
                  />
                </Tooltip>
              );
            })}
          </SpellContainer>
        ) : (
          ''
        )}
      </SpellsDisplay>
    );
  }
}

const SpellsDisplay = styled.div`
  color: black;
  margin-bottom: 10px;
`;

const SpellContainer = styled.div`
  display: flex;
`;

export default SpellsContainer;
