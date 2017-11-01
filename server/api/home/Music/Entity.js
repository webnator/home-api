'use strict';

const spotifyConfig = require('./../../../config/environment').music.spotify;
const config = require('./../../../config/environment').music;

module.exports = (deps) => {
  const {
    LogService,
    responses,
    RequestService
  } = deps;

  /** The Class to handle Music */
  class Music {
    constructor() {
      this.apiRequest = new RequestService({ baseUrl: spotifyConfig.webUrl });
      this.accountRequest = new RequestService({ baseUrl: spotifyConfig.accountUrl });

      this.actions = config.actions;
    }

    setCurrentSong(apiResponse) {
      this.currentSong = apiResponse;
    }
    setAccessToken(res) {
      spotifyConfig.accessToken = res.access_token;
      spotifyConfig.tokenType = res.token_type;
    }

    getCurrentSong() {
      return this.currentSong;
    }

    /**
     * Fetches the current playing song from spotify
     * @param logData {Object} - The log info for the current request
     * @returns {Promise.<*>}
     */
    async fetchCurrentSong(logData) {
      LogService.info(logData, 'Music fetchCurrentSong | Accessing');
      return await this.apiRequest.request({
        logData: logData,
        params: {
          method: 'GET',
          url: 'me/player/currently-playing',
          headers: {
            authorization: spotifyConfig.tokenType + ' ' + spotifyConfig.accessToken
          }
        },
        responses: {
          200: (res) => {
            LogService.info(logData, 'Music fetchCurrentSong | OK');
            this.setCurrentSong(res);
            return res;
          },
          204: async (err) => {
            LogService.info(logData, 'Music fetchCurrentSong | KO accessToken expired - refreshing', err);
            await this.refreshToken(logData);
            return await this.fetchCurrentSong(logData);
          },
          401: async (err) => {
            LogService.info(logData, 'Music fetchCurrentSong | KO accessToken expired - refreshing', err);
            await this.refreshToken(logData);
            return await this.fetchCurrentSong(logData);
          }
        },
        fallback: (err) => {
          LogService.error(logData, 'Music fetchCurrentSong | KO', err);
          throw responses.spotify_api_ko;
        }
      });
    }

    /**
     * Controls the plaback, allows only the defined ACTIONS
     * @param logData {Object} - The log info for the current request
     * @param action {String} - The action to perform in the API
     * @returns {Promise.<void>}
     */
    async controlPlayback(logData, action) {
      LogService.info(logData, 'Music controlPlayback | Accessing');
      const playbackAction = this.actions[action.toLowerCase()];
      if (!playbackAction) {
        throw responses.action_invalid;
      }
      return await this.apiRequest.request({
        logData: logData,
        params: {
          method: playbackAction.method,
          url: playbackAction.url,
          headers: {
            authorization: spotifyConfig.tokenType + ' ' + spotifyConfig.accessToken
          }
        },
        responses: {
          204: (res) => {
            LogService.info(logData, 'Music controlPlayback | OK');
            this.setCurrentSong(res);
            return res;
          },
          401: async (err) => {
            LogService.info(logData, 'Music controlPlayback | KO accessToken expired - refreshing', err);
            await this.refreshToken(logData);
            return await this.controlPlayback(logData, action);
          }
        },
        fallback: (err) => {
          LogService.error(logData, 'Music controlPlayback | KO', err);
          throw responses.spotify_api_ko;
        }
      });
    }

    /**
     * Refreshes the accessToken to access the api
     * @param logData {Object} - The log info for the current request
     * @returns {Promise.<*>}
     */
    async refreshToken(logData) {
      LogService.info(logData, 'Music refreshToken | Accessing');
      return await this.accountRequest.request({
        logData: logData,
        params: {
          method: 'POST',
          url: 'token',
          headers: {
            authorization: 'Basic ' + spotifyConfig.basicAuth,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          form: {
            grant_type: 'refresh_token',
            refresh_token: spotifyConfig.refresh_token
          }
        },
        responses: {
          200: (res) => {
            LogService.info(logData, 'Music refreshToken | OK');
            this.setAccessToken(res);
            return res;
          }
        },
        fallback: (err) => {
          LogService.error(logData, 'Music refreshToken | KO', err);
          throw responses.spotify_api_ko;
        }
      });
    }

  }

  return Music;
};

