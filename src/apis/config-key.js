let _apiConfig;

/**
 *
 * @param {{ appKey: string, appId: string }} config
 */
export function configApiKey(config) {
  _apiConfig = config;
}

/**
 * @returns {{ appKey: string, appId: string }}
 */
export function getAPIConfig() {
  return _apiConfig;
}
