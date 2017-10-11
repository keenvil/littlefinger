import Rest from '../adapters/rest';

export default class ApiModule {

  adapter = null

  name = ''

  constructor(name, apiConfig) {
    this.adapter = new Rest({
      module: name,
      apiConfig
    });
    this.name = name;
  }

}
