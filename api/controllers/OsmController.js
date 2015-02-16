/**
 * OsmController
 *
 * @description :: Server-side logic for managing osms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: logging.ElasticsearchLogger,

  // Note that this doesn't abort the query.
  requestTimeout: 10000  // milliseconds
});


module.exports = {
  get: function(req, res) {

    client.search({index:'osm', 'comment': 'Iraq'}).then(function(body) {
      // if (body.hits.hits.length == 0) {
      //   ApiError(response, 'NOT_FOUND', 'No matches found!');
      // }

      return res.json(body.hits.hits);
    });

    // return res.json({'hi': 'bye'});
  }
};

