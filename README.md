# OSM Meta API

⚠️
This API is no longer actively maintained. If you are interested in maintaining it, please contact [@kamicut](https://github.com/kamicut)
⚠️

An API to store, aggregate and search through OSM Metadata. The data is uploaded using [osm-meta-util](https://github.com/osmlab/osm-meta-util) to an Elastic Search backend and fully indexes the date and comment text. 

See the wiki for [API guide for endpoint documentation](https://github.com/osmlab/osm-meta-api/wiki/API-Guide).

A joint project built by [Development Seed](https://github.com/developmentseed) and the [American Red Cross](https://github.com/americanredcross).

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Deploying to heroku

The heroku deploy button above will start a server API connected to an Elastic Search database. It will also provision a dyno for live changeset monitoring, but you need to go into the app's `resource` settings and turn it on.

![adding dyno](https://cloud.githubusercontent.com/assets/719357/6984923/e006051c-d9fb-11e4-95b0-31cb07a5b453.png)

## Adding historical data

There's a script in the `uploaders` folder that can be used to upload data between two dates. The script expects the first argument to be the URL of the database. In the case of Heroku, check the app's configuration variables in 'Settings' for the `BONSAI_URL` variable. Use this as the first argument.

**Uploading data between two dates**

Using the [changeset replication directory](http://planet.osm.org/replication/changesets/) we get the file numbers for the dates we want to upload (e.g. `001181708` for `2015-02-10 20:56` and `001181721` for `2015-02-10 21:09`) 

```sh
node uploader.js DATABASE_URL 001181708 001181721
```

## Deploying locally

### Dependencies

You need to install and run Elastic Search using [this guide](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/setup.html)

Once Elastic search is running, export the Elastic Search URL location to the command line environment, e.g:

```sh
export ES_SERVER="http://localhost:9200"
```
### Installation

Clone the repo and install the npm dependencies
```sh
npm install
```

Bootstrap the Elastic Search database
```sh
node bootstrap.js
``` 

Start the server
```sh
npm start
```

### Adding data

There are two uploader scripts that can be used to upload data to the Elastic Search database. These scripts expect the first argument to be the URL of the database, so you can pass `ES_SERVER`

**Uploading data between two dates**

Using the [changeset replication directory](http://planet.osm.org/replication/changesets/) we get the file numbers for the dates we want to upload (e.g. `001181708` for `2015-02-10 20:56` and `001181721` for `2015-02-10 21:09`) 

```sh
node uploader.js $ES_SERVER 001181708 001181721
```

**Uploading data continuously**

```sh
node live-uploader.js $ES_SERVER
```
