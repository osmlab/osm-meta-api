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
var bulkBuffer = [];
var THRESHOLD = 20000;
var counter = 0;
var meta = MetaUtil({
  'delay': (process.argv[5] || 100),
  'start': Number(process.argv[3]),
  'end': Number(process.argv[4])
}).pipe(through(
  write, //Write function, transform and push buffer at threshold
  function() {
    if (bulkBuffer.length > 0) {
      pushToES(bulkBuffer, 'exit');
    } //End function: push contents of buffer and hang up
  }
  ));

function write(buf) {
  //operations on buffer
  var obj = JSON.parse(buf.toString());
  counter += 1;

  process.stdout.write('Processed: ' + counter + ' - Last date: ' + obj.created_at + '\r');

  //Index action
  bulkBuffer.push({
    'index': {
      '_type': 'meta',
      '_id': obj.id,
      '_index': 'osm'
    }
  });

  //Index content
  bulkBuffer.push(obj);

  //Push
  if (bulkBuffer.length >= THRESHOLD) {
    var data = _.clone(bulkBuffer);
    pushToES(data);
    bulkBuffer = [];
  }
}

function pushToES(data, flag) {
  client.bulk({ body: data }, function (err, resp) {
    if (err) {
      console.error(err);
      return;
    }
    if (resp) {
      // console.log('Added ' + resp.items.length + ' records.');
      if (flag === 'exit') {
        process.exit(0);
      }
      console.log(resp);
      return;
    }
  });
}
