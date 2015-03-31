/**
 * Bootstrap a clean version of Elastic Search
 */

var elasticsearch = require('elasticsearch');
var config = require('./config/osm.js').osm;

var client = new elasticsearch.Client({
  host: config.esServer,

  // Note that this doesn't abort the query.
  requestTimeout: 10000  // milliseconds
});

var mapping = {
  meta: {
    properties: {
      uid         : {'type' : 'long', 'index' : 'not_analyzed'},
      min_lat     : {'type' : 'double', 'index' : 'analyzed'},
      max_lat     : {'type' : 'double', 'index' : 'analyzed'},
      min_lon     : {'type' : 'double', 'index' : 'analyzed'},
      max_lon     : {'type' : 'double', 'index' : 'analyzed'},
      created_at  : {'type' : 'date', 'format': 'date_time_no_millis', 'index' : 'not_analyzed'},
      closed_at   : {'type' : 'date', 'format': 'date_time_no_millis', 'index' : 'analyzed'},
      num_changes : {'type' : 'integer', 'index' : 'analyzed'},
      user        : {'type' : 'string', 'index' : 'analyzed'},
      open        : {'type' : 'boolean'},
      id          : {'type' : 'long', 'index' : 'not_analyzed'}
    }
  }
};


var indexExist = function (indexName) {
  client.indices.exists({index: indexName}, function(err, resp){
    if (err) {
      console.log(err);
      return;
    }

    if (!resp) {
      console.log(indexName + ' does not exist');
      createIndex(indexName);
    }
    else {
      console.log(indexName + ' already exists');
      process.exit(0);
    }
  });
};

var createIndex = function (indexName) {
  client.indices.create({index: indexName}, function(err, resp){
    if (err) {
      console.log(err);
      return;
    }

    if (resp) {
      console.log(indexName + ' created');
      addMapping(indexName, 'meta');
    }
    else {
      console.log('Creation of ' + indexName + ' failed.');
      process.exit(0);
    }
  });
};

var addMapping = function (indexName, typeName) {
  client.indices.putMapping({
    index: indexName,
    type: typeName,
    body: mapping
  }, function(err, resp) {
    if (err) {
      console.log(err);
      return;
    }

    if (resp) {
      console.log(resp);
      console.log('Added Mapping')
      process.exit(0)
      return;
    }

    return;
  });
};



var main = function () {
  indexExist(config.esIndex);
};

main();

