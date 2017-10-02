/**
 * Library façade
 */
import Rest from './adapters/rest';
import KeenvilApiError from './exceptions/keenvilApiError';
import ApiModule from './modules/apiModule';
import ModuleRegistry from './modules/moduleRegistry';

export {
  Rest,
  KeenvilApiError,
  ApiModule,
  ModuleRegistry
}
