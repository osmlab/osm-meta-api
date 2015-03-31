/*global ResponseBuilder*/
/*global ApiRequest*/
/*global ElasticSearchQuery*/
/*global sails*/
/**
 * OsmController
 *
 * @description :: Server-side logic for managing osms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var elasticsearch = require('elasticsearch');
var underscore = require('underscore');

var client = new elasticsearch.Client({
  host: sails.config.osm.esServer,

  // Note that this doesn't abort the query.
  requestTimeout: 10000  // milliseconds
});

module.exports = {

  redirect: function(req, res) {
    res.redirect('/osm');
  },

  get: function(req, res) {

    try {
      res = ResponseBuilder.setHeaders(res);

      var params = ApiRequest.checkParams(req.query);

      var query = ElasticSearchQuery.buildQuery(params);

      client.search({
        index: sails.config.osm.esIndex,
        type: sails.config.osm.esType,
        body: query
      }).then(function(body) {
        if (body.hits.hits.length === 0) {
          return res.badRequest({error: 'Nothing Found'});
        }

        var responseJson = {};

        responseJson.meta = underscore.clone(sails.config.osm.meta);

        if (!params.skip) {
          params.skip = 0
        } 

        params.skip += params.limit
      
        underscore.extend(responseJson.meta, {
          'count': body.hits.hits.length,
          'total_edits': body.aggregations.totalChanges.value,
          'total_contributors': body.aggregations.userTotal.buckets.length,
          'total_results': body.hits.total,
          'next_results': '?' + underscore(params)
                                  .map(function(val, key) {
                                    return '' + key + '=' + val}
                                  ).join('&')
        })

        responseJson.results = [];
        for (var i = 0; i < body.hits.hits.length; i++) {
          var es_results = body.hits.hits[i]._source;
          for (var j = 0; j < sails.config.osm.fields_to_remove.length; j++) {
            delete es_results[sails.config.osm.fields_to_remove[j]];
          }
          responseJson.results.push(es_results);
        }

        return res.json(responseJson);
      }, function(error) {
        return res.badRequest({'SERVER_ERROR': 'Check your request and try again',
                        'message': error.message});
      });
    }
    catch (e) {
      return res.badRequest(e);
    }

  }
};

