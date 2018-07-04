const express = require('express');
const router = express.Router();
const request = require('request-promise');
const _ = require('lodash');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Defined Routes

app.get('/', (req, res) => {
  res.send({ message: 'Works' });
});

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
      url: `http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json`
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
  }
};

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = router;
