import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

import LeagueStore from '../stores/LeagueStore';

@observer
class Search extends Component {
  state = {
    name: null,
    profile: null
  };

  findSummonerProfile = () => {
    if (this.state.name && this.state.name !== LeagueStore.summonerName) {
      LeagueStore.setSummonerLoaded(false);

      LeagueStore.setSummonerName(this.state.name).then(() => {
        if (LeagueStore.state === 'done') {
          this.setState({ profile: LeagueStore.summonerProfile });
          LeagueStore.setSummonerLoaded(true);
        }
      });
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return (
      <Paper style={paperStyle}>
        <h1>Search Summoner Stats</h1>
        <TextField
          id="input-with-icon-textfield"
          autoFocus
          style={searchStyle}
          placeholder="Name - Ex: ABC"
          onChange={this.handleChange('name')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        <Button
          variant="outlined"
          color="primary"
          onClick={this.findSummonerProfile}
        >
          Search
        </Button>
      </Paper>
    );
  }
}

const paperStyle = {
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  margin: '6% 20px 20px 20px',
  padding: '25px',
  alignItems: 'center',
  backgroundColor: '#FAFAFA'
};

const titleStyle = {
  margin: '10px 10px 10px 10px',
  paddingRight: '15px'
};

const searchStyle = {
  color: 'white',
  paddingBottom: '15px'
};

export default Search;
