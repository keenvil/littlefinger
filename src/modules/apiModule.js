import Rest from '../adapters/rest';

export default class ApiModule {

  adapter = null

  name = ''

  constructor(name) {
    this.adapter = new Rest({
      module: name
    });
    this.name = name;
  }

}
