const express = require('express');
const path = require('path');

const router = express.Router();
const request = require('request-promise');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

// Defined Routes

app.get('/api/find_summoner/v1/:name', (request, response) => {
  league.summonerName = request.params.name;
  return league.getSummoner().then(() => {
    return league.getPosition().then(() => {
      response.send({ summoner: league.summoner });
    });
  });
});

app.get('/api/match_history/v1/:accountId/:endIndex', (request, response) => {
  league.accountId = request.params.accountId;
  league.endIndex = Number(request.params.endIndex);
  return league.getMatchHistory().then(() => {
    const matches = league.history.matches.map(function(match, index) {
      return league.getGameDetails(index, match.gameId).then(() => {
        return league.getChampion(index, match.champion).then(() => {
          return;
        });
      });
    });

    Promise.all(matches).then(() => {
      response.send({ matchHistory: league.history });
    });
  });
});

app.get('/api/find_item/v1/:itemId', (request, response) => {
  return league.getItem(request.params.itemId).then(res => {
    response.send({ item: res });
  });
});

app.get('/api/find_spell/v1/:spellId', (request, response) => {
  return league.getSpell(request.params.spellId).then(res => {
    response.send({ spell: res });
  });
});

// External API Calls

let league = {
  key: process.env.RIOT_KEY,
  summonerName: null,
  accountId: null,
  endIndex: 0,
  summoner: null,
  history: null,

  getSummoner: function() {
    return request({
      method: 'GET',
      url: `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${
        league.summonerName
      }`,
      headers: {
        'X-Riot-Token': league.key
      }
    }).then(res => {
      league.summoner = JSON.parse(res);
      league.accountId = league.summoner.accountId;
      return league.summoner;
    });
  },

  getPosition: function() {
    return request({
      method: 'GET',
      url: `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${
        league.summoner.id
      }`,
      headers: {
        'X-Riot-Token': league.key
      }
    }).then(res => {
      league.summoner.posHistory = JSON.parse(res);
      return res;
    });
  },

  getMatchHistory: function() {
    const index = league.endIndex;
    return request({
      method: 'GET',
      url: `https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${
        league.accountId
      }?beginIndex=${Math.floor(index - 5)}&endIndex=${index}`,
      headers: {
        'X-Riot-Token': league.key
      }
    }).then(res => {
      league.history = JSON.parse(res);
      return res;
    });
  },

  getGameDetails: function(index, gameId) {
    return request({
      method: 'GET',
      url: `https://na1.api.riotgames.com/lol/match/v3/matches/${gameId}`,
      headers: {
        'X-Riot-Token': league.key
      }
    }).then(res => {
      const response = JSON.parse(res);
      const playerIndex = response.participantIdentities.findIndex(
        obj => obj.player.accountId === Number(league.accountId)
      );
      const player = response.participantIdentities[playerIndex];

      let match = league.history.matches[index];
      match.gameDetails = response;
      match.gameDetails.currentId = player.participantId;
      return match;
    });
  },

  getChampion: function(index, championId) {
    return request({
      method: 'GET',
      url: `https://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json`
    }).then(res => {
      const response = JSON.parse(res);

      const result = _.find(response.data, function(obj) {
        if (obj.key === championId.toString()) {
          return obj;
        }
      });

      let match = league.history.matches[index];
      match.championDetails = result;
      return match;
    });
  },

  getItem: function(itemId) {
    return request({
      method: 'GET',
      url: `https://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/item.json`
    }).then(res => {
      const response = JSON.parse(res);
      const item = response.data[itemId];

      return item;
    });
  },

  getSpell: function(spellId) {
    return request({
      method: 'GET',
      url: `https://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/summoner.json`
    }).then(res => {
      const response = JSON.parse(res);

      const result = _.find(response.data, function(obj) {
        if (obj.key === spellId.toString()) {
          return obj;
        }
      });

      return result;
    });
  }
};

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = router;
