import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

class Header extends Component {
  render() {
    return (
      <AppBar style={barStyle}>
        <Typography variant="title" color="inherit" style={titleStyle}>
          Summoner Stats
        </Typography>
      </AppBar>
    );
  }
}

const barStyle = {
  display: 'flex',
  padding: '10px',
  flexDirection: 'row',
  alignItems: 'center'
};

const titleStyle = {
  margin: '10px 10px 10px 10px',
  paddingRight: '15px'
};

export default Header;
