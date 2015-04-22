var elasticsearch = require('elasticsearch');
var MetaUtil = require('osm-meta-util');
var through = require('through');
var _ = require('lodash');

var config = require('../config/osm.js').osm;

var client = new elasticsearch.Client({
  host: process.argv[2],

  // Note that this doesn't abort the query.
  requestTimeout: 10000  // milliseconds
});

//Call uploader
var counter = 0;
var meta = MetaUtil().pipe(through(
  write, //Write function, transform and push buffer at threshold
  function() {
    process.exit(0)
  }
));

function write(buf) {
  //operations on buffer
  var obj = JSON.parse(buf.toString());
  counter += 1;

  process.stdout.write('Processed: ' + counter + '\r');

  client.index({
    index: 'osm',
    type: 'meta',
    id: obj.id,
    body: obj
  }, function(err, resp) {
    if (err) {
      console.error(err)
    }
  })
}
