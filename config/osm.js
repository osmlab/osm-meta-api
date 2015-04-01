/**
 * OSM API Configuration
 */
console.log(process.env)
module.exports.osm = {
  esServer: process.env.ES_SERVER || process.env.BONSAI || 'localhost:9200',
  esIndex: process.env.ES_INDEX || 'osm',
  esType: process.env.ES_TYPE || 'meta',
  serverName: process.env.SERVER_NAME || 'api.developmentseed.org',
  accessControlAllowOrigin: '*',
  expected_params: ['search', 'limit', 'skip', 'hash', 'comment', 'user', 'date'],
  api_request_error: 'ApiRequestError',
  api_default_limit: 100,
  api_max_limit: 1000,
  date_fields: ['created_at', 'closed_at'],
    meta: {
    'about': 'OSM Meta API',
    'credit': 'This API is based on the openFDA\'s API ' +
              'https://github.com/FDA/openfda/tree/master/api ',
    'author': 'Development Seed',
    'license': 'http://creativecommons.org/publicdomain/zero/1.0/legalcode',
  },
  fields_to_remove: []
};
