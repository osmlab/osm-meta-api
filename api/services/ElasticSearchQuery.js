 /*global sails*/

var ejs = require('elastic.js');

var ELASTICSEARCH_QUERY_ERROR = 'ElasticsearchQueryError';
var SUPPORTED_QUERY_RE = '^[0-9a-zA-Z#\.\_\:\(\)\"\\[\\]\{\}\\-\\+\>\<\= ]+$';

var DATE_FIELDS = sails.config.date_fields;

var exports = module.exports = {
  supportedQueryString: function(query) {
    var supported_query_re = new RegExp(SUPPORTED_QUERY_RE);
    return supported_query_re.test(query);
  },

  buildQuery: function(params) {

    var q = ejs.Request();

    if (!params.search && !params.count) {
      q.query(ejs.MatchAllQuery());
    }

    if (params.search) {
      if (!exports.supportedQueryString(params.search)) {
        throw {
          name: ELASTICSEARCH_QUERY_ERROR,
          message: 'Search not supported: ' + params.search
        };
      }
      q.query(ejs.QueryStringQuery(params.search));
    }

    if (params.count) {
      if (DATE_FIELDS.indexOf(params.count) != -1) {
        q.facet(ejs.DateHistogramFacet('count').
          field(params.count).interval('day').order('time'));
      } else {
        var limit = parseInt(params.limit);
        q.facet(ejs.TermsFacet('count').
          fields([exports.ReplaceExact(params.count)]).size(limit));
      }
    }

    q.agg(ejs.SumAggregation('totalChanges').field('num_changes'));

    q.agg(ejs.TermsAggregation('userTotal').field('user'));

    q.size(params.limit);

    return q;
  }
};
