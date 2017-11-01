'use strict';

let REPOSITORIES = {};

class RepositoryFactory {
  constructor() {
  }

  /**
   * Get a repository from the RepositoryFactory
   * @public
   * @param {Object} repository - The repository name
   * @return {Object} result - The instance repository
   */
  static getRepository(repository) {
    return REPOSITORIES[repository];
  }

}

module.exports = RepositoryFactory;