import { observable, action, flow, runInAction } from 'mobx';

// import { Collection, parse, Schema } from 'mobx-models';

class LeagueStore {
  @observable state = 'pending';
  @observable summonerName = '';
  @observable summonerLoaded = false;
  @observable matchesLoaded = false;
  @observable itemsLoaded = false;
  @observable spellsLoaded = false;
  @observable summonerProfile = null;
  summonerMatches = [];
  endIndex = 5;
  totalGames = 0;
  items = {};
  spells = {};

  @action
  setSummonerName(name) {
    return new Promise((resolve, reject) => {
      if (name !== this.summonerName) {
        this.reset();
        this.summonerName = name;
        this.fetchSummoner().then(() => {
          resolve();
        });
      } else {
        reject();
      }
    });
  }

  @action
  reset = () => {
    this.summonerName = '';
    this.summonerProfile = null;
    this.summonerMatches = [];
    this.endIndex = 5;
    this.totalGames = 0;
  };

  @action
  setSummonerLoaded(value) {
    this.summonerLoaded = value;
  }

  @action
  setMatchesLoaded(value) {
    this.matchesLoaded = value;
  }

  @action
  setItemsLoaded(value) {
    this.itemsLoaded = value;
  }

  @action
  setSpellsLoaded(value) {
    this.spellsLoaded = value;
  }

  @action
  loadMoreMatches() {
    return new Promise((resolve, reject) => {
      if (this.endIndex < this.totalGames) {
        this.matchesLoaded = false;

        this.endIndex = Math.floor(this.endIndex + 5);
        this.fetchSummonerMatches().then(() => {
          resolve();
        });
      } else {
        reject();
      }
    });
  }

  @action
  async fetchSummoner() {
    this.summonerProfile = null;
    this.state = 'pending';
    try {
      const response = await fetch(
        `/api/find_summoner/v1/${this.summonerName}`
      );
      const body = await response.json();

      runInAction(() => {
        this.summonerProfile = body.summoner;
        this.state = 'done';
      });
    } catch (error) {
      runInAction(() => {
        this.state = 'error';
      });
    }
  }

  @action
  async fetchSummonerMatches() {
    if (this.summonerProfile && this.summonerProfile.accountId) {
      this.state = 'pending';
      try {
        const response = await fetch(
          `/api/match_history/v1/${this.summonerProfile.accountId}/${
            this.endIndex
          }`
        );
        const body = await response.json();

        runInAction(() => {
          const newArray = this.summonerMatches.concat(
            body.matchHistory.matches
          );
          this.summonerMatches = newArray;

          this.totalGames = body.matchHistory.totalGames;
          this.state = 'done';
        });
      } catch (error) {
        runInAction(() => {
          this.state = 'error';
        });
      }
    } else {
      this.state = 'error';
    }
  }

  // Fetch any static data from LoL ddragon system.

  @action
  async fetchItem(itemId) {
    if (itemId === 0) return true;
    if (itemId in this.items) return true;
    this.state = 'pending';
    try {
      const response = await fetch(`/api/find_item/v1/${itemId}`);
      const body = await response.json();

      runInAction(() => {
        this.items[itemId] = body.item;
        this.state = 'done';
      });
    } catch (error) {
      runInAction(() => {
        this.state = 'error';
      });
    }
  }

  @action
  async fetchSpell(spellId) {
    if (spellId === 0) return true;
    if (spellId in this.spells) return true;
    this.state = 'pending';
    try {
      const response = await fetch(`/api/find_spell/v1/${spellId}`);
      const body = await response.json();

      runInAction(() => {
        this.spells[spellId] = body.spell;
        this.state = 'done';
      });
    } catch (error) {
      runInAction(() => {
        this.state = 'error';
      });
    }
  }
}

const store = new LeagueStore();
window.leagueStore = store;
export default store;
