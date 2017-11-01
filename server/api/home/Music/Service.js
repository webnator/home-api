'use strict';

module.exports = (deps) => {
  const {
    Music,
    LogService
  } = deps;

  /** Static class to communicate with the Interview class methods */
  class MusicService {

    /**
     * Connects to spotify API to get the current playing song
     * @public
     * @static
     * @param {Object} data - The container object
     * @returns {Promise}
     */
    static async getCurrentSong(data) {
      LogService.info(data.logData, 'MusicService getCurrentSong | Accessing');

      data.music = new Music();
      try {
        await data.music.fetchCurrentSong(data.logData);
        data.currentSong = data.music.getCurrentSong();
        LogService.info(data.logData, 'MusicService getCurrentSong | OK');
        return Promise.resolve(data);
      } catch (err) {
        LogService.error(data.logData, 'MusicService getCurrentSong | KO', err);
        return Promise.reject(err);
      }
    }

    /**
     * Connects to spotify API to control the playback
     * @public
     * @static
     * @param {Object} data - The container object
     * @returns {Promise}
     */
    static async control(data) {
      LogService.info(data.logData, 'MusicService control | Accessing');

      data.music = new Music();
      try {
        await data.music.controlPlayback(data.logData, data.params.action);
        LogService.info(data.logData, 'MusicService control | OK');
        return Promise.resolve(data);
      } catch (err) {
        LogService.error(data.logData, 'MusicService control | KO', err);
        return Promise.reject(err);
      }
    }
  }

  return MusicService;
}

