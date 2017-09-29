export default class ModuleRegistry {

  modules = null

  constructor() {
    this.modules = new Map();
  }

  addModule(moduleName, moduleDefinition) {
    if (!this.modules.has(moduleName)) {
      this.modules.set(moduleName, moduleDefinition);
    } else {
      throw new Error(`Littlefinger: there is already a module with named ${moduleName}`);
    }
  }

  getModule(moduleName) {
    return this.modules.get(moduleName);
  }

}
