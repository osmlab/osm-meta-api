# OSM Meta API

A nodejs app that provides an API interface for OSM meta data.

This is a [Sails](http://sailsjs.org) application.

## Setup

    npm install

**Bootstrap Elastic Search if this is the first time:**

To install Elastic Search use [this guide](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/setup.html).

    node bootstrap.js

**To run locally:**

    sails lift

**Run with live reload:**

    forever --watch app.js

## API Guide

### Endpoints:

    /osm

| Parameters | Example | Definition
| ----    | ----- | -----
| `hash`    | `/osm?hash=notMapped` | search for the hashed data. **Do NOT use `#`**
| `comment` | `/osm?hash="this is my comment"` | search in comments
| `user`  | `/osm?user=username` | search among users
| `date`  | `/osm?date=[2015-01-10T20:55:08Z+TO+2015-02-10T20:56:00Z]` | search date range in `closed_at` field. You have to follow the correct date format: `YYYY-mm-ddThh:mm:ssZ`
| `limit` | `/osm?hash=notMapped&limit=24` | set a limit to output. Default is 1. Max is 1000
| `skip` | `/osm?hash=notMapped&limit=24&skip=100` | skips records. Should be used with limit to create pagination effect
| `search` | `/osm?search=comment:"thiscomment"+AND+user:username` | search in everything. Use [Apache Lucene - Query Parser Syntax](http://lucene.apache.org/core/2_9_4/queryparsersyntax.html)

### Sample Output:

```json
{
  "meta": {
    "about": "OSM Meta API",
    "credit": "This API is based on the openFDA's API https://github.com/FDA/openfda/tree/master/api ",
    "author": "Development Seed",
    "license": "http://creativecommons.org/publicdomain/zero/1.0/legalcode",
    "count": {
      "returned": 3,
      "limit": 3,
      "total": 24,
      "totalChanges": 3559,
      "usersContributed": 10
    }
  },
  "results": [
    {
      "comment": "Aktualizacja lokalizacji adresów na bazie iMPA dla gminy Orły",
      "uid": "1410361",
      "min_lat": "49.8545578",
      "created_at": "2015-02-10T20:55:10Z",
      "num_changes": "10",
      "created_by": "JOSM/1.5 (7995 en)",
      "max_lon": "22.8355397",
      "source": "orly.e-mapa.net",
      "user": "WiktorN",
      "max_lat": "49.8681715",
      "closed_at": "2015-02-10T20:55:12Z",
      "min_lon": "22.8141334",
      "open": "false",
      "id": "28759988"
    },
    {
      "comment": "scieżka",
      "uid": "2641836",
      "imagery_used": "Bing",
      "min_lat": "54.0767342",
      "created_at": "2015-02-10T20:55:11Z",
      "num_changes": "4",
      "created_by": "iD 1.6.2",
      "max_lon": "18.8057471",
      "user": "Maciej Tczew",
      "max_lat": "54.0788854",
      "closed_at": "2015-02-10T20:55:12Z",
      "min_lon": "18.800052",
      "open": "false",
      "id": "28759990"
    },
    {
      "comment": "roads",
      "uid": "1832883",
      "min_lat": "49.0487258",
      "created_at": "2015-02-10T20:55:18Z",
      "num_changes": "1",
      "created_by": "JOSM/1.5 (7995 ru)",
      "max_lon": "140.322819",
      "user": "Jake Strine",
      "max_lat": "49.0490797",
      "closed_at": "2015-02-10T20:55:18Z",
      "min_lon": "140.322176",
      "open": "false",
      "id": "28759994"
    }
  ]
}

```
