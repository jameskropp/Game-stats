import React, { Component } from 'react';
import { observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import styled from 'styled-components';

import LeagueStore from '../../stores/LeagueStore';

@observer
class ItemsContainer extends Component {
  // Create an array and fill it with the default items LoL returns
  state = {
    items: Array.from(
      { length: 6 },
      (_, idx) => this.props.playerStats.stats[`item${idx++}`]
    )
  };

  componentDidMount() {
    const { playerStats } = this.props;
    LeagueStore.setItemsLoaded(false);

    const items = this.state.items.map(item => {
      return LeagueStore.fetchItem(item).then(() => {
        return;
      });
    });

    Promise.all(items).then(() => {
      LeagueStore.setItemsLoaded(true);
      return;
    });
  }

  render() {
    const { playerStats } = this.props;

    return (
      <ItemsDisplay>
        <b>Items:</b>
        <br />
        {LeagueStore.itemsLoaded ? (
          <ItemContainer>
            {this.state.items.map(item => {
              const itemDetails = LeagueStore.items[item];
              if (!itemDetails) return '';

              return (
                <Tooltip
                  key={`item-tool-${item}`}
                  title={`${itemDetails.name}`}
                >
                  <img
                    key={`item-${item}`}
                    src={`http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/${
                      itemDetails.image.full
                    }`}
                    alt={itemDetails.name}
                  />
                </Tooltip>
              );
            })}
          </ItemContainer>
        ) : (
          ''
        )}
      </ItemsDisplay>
    );
  }
}

const ItemsDisplay = styled.div`
  color: black;
`;

const ItemContainer = styled.div`
  display: flex;
`;

export default ItemsContainer;
