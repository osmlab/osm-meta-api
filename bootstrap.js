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
      dummyData();
      return;
    }

    return;
  });
};

var dummyData = function () {
  client.bulk({
    body: [
      {'index': {'_type': 'meta', '_id': 1, '_index': 'osm'}},
      {'comment': 'fixing missing/misalign TIGER http://osmlab.github.io/to-fix/?error=tigerdelta-named', 'uid': '2377377', 'min_lat': '38.5600312', 'created_at': '2015-02-10T20:54:58Z', 'num_changes': '1', 'created_by': 'JOSM/1.5 (7995 en)', 'max_lon': '-89.9332048', 'source': 'Bing', 'user': 'abel801', 'max_lat': '38.5600723', 'closed_at': '2015-02-10T20:55:02Z', 'min_lon': '-89.9332064', 'open': 'false', 'id': '28759981'},
      {'index': {'_type': 'meta', '_id': 2, '_index': 'osm'}},
      {'comment': '\u00dcberarbeitung Geb\u00e4ude, Stra\u00dfen etc. in Cramme', 'uid': '336745', 'imagery_used': 'Bing', 'min_lat': '52.1121175', 'created_at': '2015-02-10T20:54:55Z', 'num_changes': '3', 'created_by': 'iD 1.6.2', 'max_lon': '10.4490188', 'user': 'harzguide', 'max_lat': '52.1126299', 'closed_at': '2015-02-10T20:55:03Z', 'min_lon': '10.4421928', 'open': 'false', 'id': '28759978'},
      {'index': {'_type': 'meta', '_id': 3, '_index': 'osm'}},
      {'comment': 'Hausnnummern', 'uid': '111462', 'min_lat': '52.4578719', 'created_at': '2015-02-10T20:55:01Z', 'num_changes': '1', 'created_by': 'JOSM/1.5 (7995 de)', 'max_lon': '13.3178071', 'source': 'local', 'user': 'Posemuckel', 'max_lat': '52.4579252', 'closed_at': '2015-02-10T20:55:03Z', 'min_lon': '13.3177555', 'open': 'false', 'id': '28759982'},
      {'index': {'_type': 'meta', '_id': 4, '_index': 'osm'}},
      {'comment': 'Hausnummer', 'uid': '2105403', 'min_lat': '48.1276632', 'created_at': '2015-02-10T20:54:58Z', 'num_changes': '6', 'created_by': 'JOSM/1.5 (6502 de)', 'max_lon': '8.3312921', 'user': 'SPG2LD', 'max_lat': '48.1286477', 'closed_at': '2015-02-10T20:55:03Z', 'min_lon': '8.3282078', 'open': 'false', 'id': '28759980'},
      {'index': {'_type': 'meta', '_id': 5, '_index': 'osm'}},
      {'comment': 'Telecoms', 'uid': '3937', 'min_lat': '51.5894747', 'created_at': '2015-02-10T20:54:57Z', 'num_changes': '21', 'created_by': 'JOSM/1.5 (7779 en_GB)', 'max_lon': '-2.4417409', 'user': 'southglos', 'max_lat': '51.5982407', 'closed_at': '2015-02-10T20:55:03Z', 'min_lon': '-2.454737', 'open': 'false', 'id': '28759979'},
      {'index': {'_type': 'meta', '_id': 6, '_index': 'osm'}},
      {'uid': '2153544', 'imagery_used': 'Bing', 'min_lat': '50.4810648', 'created_at': '2015-02-10T20:54:54Z', 'num_changes': '74', 'created_by': 'iD 1.6.2', 'max_lon': '19.4268403', 'user': 'maks69', 'max_lat': '50.4827858', 'closed_at': '2015-02-10T20:55:05Z', 'min_lon': '19.4234829', 'open': 'false', 'id': '28759977'},
      {'index': {'_type': 'meta', '_id': 7, '_index': 'osm'}},
      {'comment': 'Electrified', 'uid': '2097920', 'min_lat': '51.1177388', 'created_at': '2015-02-10T20:55:03Z', 'num_changes': '1', 'created_by': 'JOSM/1.5 (7287 nl)', 'max_lon': '28.0504439', 'source': 'survey', 'user': 'WJtW', 'max_lat': '51.2104979', 'closed_at': '2015-02-10T20:55:08Z', 'min_lon': '27.7933886', 'open': 'false', 'id': '28759983'},
      {'index': {'_type': 'meta', '_id': 8, '_index': 'osm'}},
      {'comment': 'correction decalage bing calvaire de st justin', 'uid': '358508', 'min_lat': '42.8892763', 'created_at': '2015-02-10T20:55:08Z', 'num_changes': '46', 'created_by': 'JOSM/1.5 (7995 de)', 'max_lon': '0.0416651', 'source': 'GPS-Tracks strava', 'user': 'jabali', 'max_lat': '42.8921287', 'closed_at': '2015-02-10T20:55:11Z', 'min_lon': '0.0392983', 'open': 'false', 'id': '28759986'},
      {'index': {'_type': 'meta', '_id': 9, '_index': 'osm'}},
      {'comment': 'Aktualizacja lokalizacji adres\u00f3w na bazie iMPA dla gminy Or\u0142y', 'uid': '1410361', 'min_lat': '49.8545578', 'created_at': '2015-02-10T20:55:10Z', 'num_changes': '10', 'created_by': 'JOSM/1.5 (7995 en)', 'max_lon': '22.8355397', 'source': 'orly.e-mapa.net', 'user': 'WiktorN', 'max_lat': '49.8681715', 'closed_at': '2015-02-10T20:55:12Z', 'min_lon': '22.8141334', 'open': 'false', 'id': '28759988'},
      {'index': {'_type': 'meta', '_id': 10, '_index': 'osm'}},
      {'comment': 'Geb\u00e4ude geteilt oder detailliert', 'uid': '110838', 'min_lat': '49.2826528', 'created_at': '2015-02-10T20:55:10Z', 'num_changes': '13', 'created_by': 'JOSM/1.5 (7995 de)', 'max_lon': '9.697937', 'user': 'Bernhard W', 'max_lat': '49.2827974', 'closed_at': '2015-02-10T20:55:12Z', 'min_lon': '9.6972804', 'open': 'false', 'id': '28759987'},
      {'index': {'_type': 'meta', '_id': 11, '_index': 'osm'}},
      {'comment': 'scie\u017cka', 'uid': '2641836', 'imagery_used': 'Bing', 'min_lat': '54.0767342', 'created_at': '2015-02-10T20:55:11Z', 'num_changes': '4', 'created_by': 'iD 1.6.2', 'max_lon': '18.8057471', 'user': 'Maciej Tczew', 'max_lat': '54.0788854', 'closed_at': '2015-02-10T20:55:12Z', 'min_lon': '18.800052', 'open': 'false', 'id': '28759990'},
      {'index': {'_type': 'meta', '_id': 12, '_index': 'osm'}},
      {'comment': 'Haus gecleaned', 'uid': '691084', 'imagery_used': 'Bing', 'min_lat': '48.2125145', 'created_at': '2015-02-10T20:55:12Z', 'num_changes': '8', 'created_by': 'iD 1.6.2', 'max_lon': '15.6137615', 'user': 'YoungManKlaus', 'max_lat': '48.213057', 'closed_at': '2015-02-10T20:55:13Z', 'min_lon': '15.6127792', 'open': 'false', 'id': '28759991'},
      {'index': {'_type': 'meta', '_id': 13, '_index': 'osm'}},
      {'comment': 'addaption of forest area at the nature conservation area Heiliger See with bing map', 'uid': '2652929', 'imagery_used': 'Bing', 'min_lat': '54.16694', 'created_at': '2015-02-10T20:55:08Z', 'num_changes': '13', 'created_by': 'iD 1.6.2', 'max_lon': '12.3627095', 'user': 'thomas_graeff', 'max_lat': '54.2992393', 'closed_at': '2015-02-10T20:55:15Z', 'min_lon': '12.143725', 'open': 'false', 'id': '28759985'},
      {'index': {'_type': 'meta', '_id': 14, '_index': 'osm'}},
      {'uid': '2500882', 'imagery_used': 'Bing', 'created_at': '2015-02-10T19:55:16Z', 'num_changes': '0', 'created_by': 'iD 1.6.2', 'user': 'Kustaa', 'closed_at': '2015-02-10T20:55:16Z', 'open': 'false', 'id': '28758671'},
      {'index': {'_type': 'meta', '_id': 15, '_index': 'osm'}},
      {'comment': 'Nome errado', 'uid': '1924509', 'imagery_used': 'Bing', 'min_lat': '-23.1554087', 'created_at': '2015-02-10T20:55:15Z', 'num_changes': '13', 'created_by': 'iD 1.6.2', 'max_lon': '-51.710053', 'user': 'RENATA PEREZ', 'max_lat': '-23.1220975', 'closed_at': '2015-02-10T20:55:16Z', 'min_lon': '-51.8126775', 'open': 'false', 'id': '28759992'},
      {'index': {'_type': 'meta', '_id': 16, '_index': 'osm'}},
      {'comment': 'roads', 'uid': '1832883', 'min_lat': '49.0487258', 'created_at': '2015-02-10T20:55:18Z', 'num_changes': '1', 'created_by': 'JOSM/1.5 (7995 ru)', 'max_lon': '140.322819', 'user': 'Jake Strine', 'max_lat': '49.0490797', 'closed_at': '2015-02-10T20:55:18Z', 'min_lon': '140.322176', 'open': 'false', 'id': '28759994'},
      {'index': {'_type': 'meta', '_id': 17, '_index': 'osm'}},
      {'comment': 'Added residenti', 'uid': '698293', 'imagery_used': 'Bing;None', 'min_lat': '50.8147418', 'created_at': '2015-02-10T20:55:10Z', 'num_changes': '246', 'created_by': 'iD 1.6.2', 'max_lon': '4.3226964', 'user': 'Olivier Collet', 'max_lat': '50.8165518', 'closed_at': '2015-02-10T20:55:20Z', 'min_lon': '4.320928', 'open': 'false', 'id': '28759989'},
      {'index': {'_type': 'meta', '_id': 18, '_index': 'osm'}},
      {'uid': '2621794', 'imagery_used': 'Bing', 'min_lat': '36.7055056', 'created_at': '2015-02-10T20:55:19Z', 'num_changes': '3', 'created_by': 'iD 1.6.2', 'max_lon': '6.8555966', 'user': 'imad_salah', 'max_lat': '36.7057628', 'closed_at': '2015-02-10T20:55:27Z', 'min_lon': '6.8545587', 'open': 'false', 'id': '28759995'},
      {'index': {'_type': 'meta', '_id': 19, '_index': 'osm'}},
      {'uid': '2365643', 'imagery_used': 'Bing', 'min_lat': '49.0017229', 'created_at': '2015-02-10T20:55:31Z', 'num_changes': '63', 'created_by': 'iD 1.6.2', 'max_lon': '38.3781395', 'user': '\u0421\u0430\u0448\u043a\u0430_1981', 'max_lat': '49.0032557', 'closed_at': '2015-02-10T20:55:33Z', 'min_lon': '38.3763349', 'open': 'false', 'id': '28759996'},
      {'index': {'_type': 'meta', '_id': 20, '_index': 'osm'}},
      {'comment': 'Vestjylland', 'uid': '125657', 'imagery_used': 'Bing', 'min_lat': '56.2445768', 'created_at': '2015-02-10T20:55:31Z', 'num_changes': '54', 'created_by': 'iD 1.6.2', 'max_lon': '8.968125', 'user': 'Leif Lodahl', 'max_lat': '56.3845763', 'closed_at': '2015-02-10T20:55:35Z', 'min_lon': '8.4328436', 'open': 'false', 'id': '28759997'},
      {'index': {'_type': 'meta', '_id': 21, '_index': 'osm'}},
      {'uid': '609836', 'imagery_used': 'Bing', 'min_lat': '40.3773949', 'created_at': '2015-02-10T20:55:39Z', 'num_changes': '7', 'created_by': 'iD 1.6.2', 'max_lon': '-8.4513888', 'user': 'vinnys', 'max_lat': '40.3775806', 'closed_at': '2015-02-10T20:55:40Z', 'min_lon': '-8.4518018', 'open': 'false', 'id': '28759998'},
      {'index': {'_type': 'meta', '_id': 22, '_index': 'osm'}},
      {'uid': '2500882', 'imagery_used': 'Bing', 'created_at': '2015-02-10T19:55:40Z', 'num_changes': '0', 'created_by': 'iD 1.6.2', 'user': 'Kustaa', 'closed_at': '2015-02-10T20:55:40Z', 'open': 'false', 'id': '28758680'},
      {'index': {'_type': 'meta', '_id': 23, '_index': 'osm'}},
      {'comment': 'Change untagged way into highway=road', 'uid': '2551711', 'min_lat': '58.8819186', 'created_at': '2015-02-10T20:55:40Z', 'num_changes': '1', 'created_by': 'JOSM/1.5 (7995 en)', 'max_lon': '14.9159802', 'source': 'Bing 2012', 'user': 'VorpalSword', 'max_lat': '58.8826059', 'closed_at': '2015-02-10T20:55:41Z', 'min_lon': '14.9157572', 'open': 'false', 'id': '28760000'},
      {'index': {'_type': 'meta', '_id': 24, '_index': 'osm'}},
      {'comment': 'fix duplicate ways (osm inspector issue)', 'uid': '13832', 'min_lat': '6.2376567', 'created_at': '2015-02-10T20:55:40Z', 'num_changes': '7', 'created_by': 'JOSM/1.5 (7995 de)', 'max_lon': '-10.4912659', 'source': 'bing', 'user': 'Peter14', 'max_lat': '6.2397487', 'closed_at': '2015-02-10T20:55:41Z', 'min_lon': '-10.4958852', 'open': 'false', 'id': '28759999'},
      {'index': {'_type': 'meta', '_id': 25, '_index': 'osm'}},
      {'comment': 'Kampen bijwerken', 'uid': '607691', 'min_lat': '52.5656561', 'created_at': '2015-02-10T20:55:42Z', 'num_changes': '40', 'created_by': 'JOSM/1.5 (7995 nl)', 'max_lon': '5.9353486', 'source': 'Bing', 'user': 'brandmeester', 'max_lat': '52.569292', 'closed_at': '2015-02-10T20:55:44Z', 'min_lon': '5.9256422', 'open': 'false', 'id': '28760001'},
      {'index': {'_type': 'meta', '_id': 26, '_index': 'osm'}},
      {'uid': '243889', 'min_lat': '52.6685407', 'created_at': '2015-02-10T19:54:47Z', 'num_changes': '14', 'max_lon': '14.4446961', 'user': 'anst', 'max_lat': '52.671593', 'closed_at': '2015-02-10T20:55:45Z', 'min_lon': '14.4427555', 'open': 'false', 'id': '28758660'},
      {'index': {'_type': 'meta', '_id': 27, '_index': 'osm'}},
      {'comment': 'Iraq, #hotosm-project-886, source=Bing', 'uid': '190626', 'min_lat': '36.2265317', 'created_at': '2015-02-10T20:55:46Z', 'num_changes': '28', 'created_by': 'JOSM/1.5 (7995 en)', 'max_lon': '44.0084951', 'source': 'Bing', 'user': 'clairedelune', 'max_lat': '36.2290097', 'closed_at': '2015-02-10T20:55:47Z', 'min_lon': '44.0055087', 'open': 'false', 'id': '28760002'},
      {'index': {'_type': 'meta', '_id': 28, '_index': 'osm'}},
      {'uid': '2392943', 'imagery_used': 'Bing', 'min_lat': '48.4979024', 'created_at': '2015-02-10T20:55:48Z', 'num_changes': '7', 'created_by': 'iD 1.6.2', 'max_lon': '32.3197349', 'user': 'Skifes', 'max_lat': '48.4985978', 'closed_at': '2015-02-10T20:55:48Z', 'min_lon': '32.3186021', 'open': 'false', 'id': '28760004'},
      {'index': {'_type': 'meta', '_id': 29, '_index': 'osm'}},
      {'comment': 'Trace roads rivers and lakes. Correct some tags.', 'uid': '136860', 'min_lat': '18.0459079', 'created_at': '2015-02-10T20:54:22Z', 'num_changes': '2965', 'created_by': 'JOSM/1.5 (7347 en_GB)', 'max_lon': '77.7596419', 'source': 'Bing and Mapbox', 'user': 'indigomc', 'max_lat': '18.4210702', 'closed_at': '2015-02-10T20:55:57Z', 'min_lon': '77.1671989', 'open': 'false', 'id': '28759970'},
      {'index': {'_type': 'meta', '_id': 30, '_index': 'osm'}},
      {'uid': '688484', 'imagery_used': 'Bing', 'min_lat': '44.0868233', 'created_at': '2015-02-10T20:55:53Z', 'num_changes': '15', 'created_by': 'iD 1.6.2', 'max_lon': '6.225308', 'user': 'rainbow413', 'max_lat': '44.0876083', 'closed_at': '2015-02-10T20:55:58Z', 'min_lon': '6.2234717', 'open': 'false', 'id': '28760005'},
      {'index': {'_type': 'meta', '_id': 31, '_index': 'osm'}},
      {'uid': '2373957', 'imagery_used': 'Bing', 'min_lat': '63.2116323', 'created_at': '2015-02-10T20:55:46Z', 'num_changes': '132', 'created_by': 'iD 1.6.2', 'max_lon': '24.8049468', 'user': 'NearCry', 'max_lat': '63.3511106', 'closed_at': '2015-02-10T20:56:01Z', 'min_lon': '24.4035694', 'open': 'false', 'id': '28760003'},
      {'index': {'_type': 'meta', '_id': 32, '_index': 'osm'}},
      {'uid': '297482', 'min_lat': '43.6044469', 'created_at': '2015-02-10T20:55:06Z', 'num_changes': '1', 'max_lon': '1.4318695', 'user': 'don-vip', 'max_lat': '43.6044469', 'min_lon': '1.4318695', 'open': 'true', 'id': '28759984'},
      {'index': {'_type': 'meta', '_id': 33, '_index': 'osm'}},
      {'uid': '1123676', 'min_lat': '54.1229539', 'created_at': '2015-02-10T20:55:17Z', 'num_changes': '538', 'max_lon': '21.7276161', 'user': 'pawka007', 'max_lat': '54.2269457', 'min_lon': '21.5130997', 'open': 'true', 'id': '28759993'},
      {'index': {'_type': 'meta', '_id': 34, '_index': 'osm'}},
      {'uid': '336745', 'created_at': '2015-02-10T20:55:57Z', 'num_changes': '0', 'user': 'harzguide', 'open': 'true', 'id': '28760006'}
    ]
  }, function (err, resp) {
    if (err) {
      console.log(err);
      return;
    }

    if (resp) {
      console.log(resp);
    }

    process.exit(0);

  });
};

var main = function () {
  indexExist(config.esIndex);
};

main();

