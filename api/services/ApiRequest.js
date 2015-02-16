/*global sails*/
/*global _*/

var EXPECTED_PARAMS = sails.config.osm.expected_params;
var API_REQUEST_ERROR = sails.config.osm.api_request_error;
var API_LIMIT = sails.config.osm.api_default_limit;
var API_MAX_LIMIT = sails.config.osm.api_max_limit;

module.exports = {

  apiCheck: function(res, req) {
    try {
      return exports.checkParams(req.query);
    } catch (e) {
      // log.error(e);
      if (e.name == API_REQUEST_ERROR) {
        res.badRequest(e.message);
      }
      return null;
    }
  },

  checkParams: function(params) {
    // Ensure we only have params that are expected.
    _.forEach(params, function(value, key) {
      if (EXPECTED_PARAMS.indexOf(key) === -1) {
        throw {
          name: API_REQUEST_ERROR,
          message: 'Invalid parameter: ' + key
        };
      }
    });

    if (params.limit) {
      var limit = parseInt(params.limit);
      if (isNaN(limit)) {
        throw {
          name: API_REQUEST_ERROR,
          message: 'Invalid limit parameter value.'
        };
      }
      params.limit = limit;
    }

    // Limit to 100 results per search request.
    if (!params.count && params.limit && params.limit > API_LIMIT) {
      throw {
        name: API_REQUEST_ERROR,
        message: 'Limit cannot exceed ' + API_LIMIT.toString() + ' results for search requests. Use ' +
          'the skip param to get additional results.'
      };
    }

    // Limit to 1000 results per count request.
    if (params.count && params.limit && params.limit > API_MAX_LIMIT) {
      throw {
        name: API_REQUEST_ERROR,
        message: 'Limit cannot exceed ' + API_MAX_LIMIT.toString() + ' results for count requests.'
      };
    }


    // Set default values for missing params
    if (!params.limit) {
      if (params.count) {
        params.limit = 100;
      } else {
        params.limit = 1;
      }
    }


    var clean_params = {};
    _.assign(clean_params,
      _.pick(params, EXPECTED_PARAMS));

    return clean_params;

  }
};
