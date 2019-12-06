/* eslint no-unused-vars: "off" */
var provider = (function() {
  'use strict';

  var extensions = require('./query-builder-extensions.js');
  var util = require('./util.js');
  var asArray = util.asArray;
  var extendObject = util.extendObject;

  /**
   * @class MLQueryBuilder
   * @classdesc angular service for building
   * {@link http://docs.marklogic.com/guide/search-dev/structured-query structured queries}
   *
   * Designed for one-way compatibility with a subset of the official
   * {@link http://developer.marklogic.com/features/node-client-api node-client-api}
   * {@link http://docs.marklogic.com/jsdoc/queryBuilder.html query-builder};
   * queries written to {@link MLQueryBuilder} (excluding extension methods)
   * should work with the offical API, but not necessarily vice-versa.
   *
   * Additionally includes extension methods (on {@link MLQueryBuilder.ext}),
   * supporting various constraint queries, operator state query components,
   * and combined queries.
   */
  var provide = function(config) {
    function where() {
      var args = asArray.apply(null, arguments);
      return {
        query: {
          queries: args
        }
      };
    }

    return {
      /**
       * Creates a {@link http://docs.marklogic.com/guide/search-dev/structured-query structured query}
       * from a set of sub-queries
       * @method MLQueryBuilder#where
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#where
       *
       * @param {...Object} queries - sub queries
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query structured query}
       */
      where: where,

      and: function and() {
        var args = asArray.apply(null, arguments);
        return {
          'and-query': {
            queries: args
          }
        };
      },

      /**
       * Builds an {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_64259 `or-query`}
       * @method MLQueryBuilder#or
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#or
       *
       * @param {...Object} queries - sub queries
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_64259 or-query}
       */
      or: function or() {
        var args = asArray.apply(null, arguments);
        return {
          'or-query': {
            queries: args
          }
        };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_39488 `not-query`}
       * @method MLQueryBuilder#not
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#not
       *
       * @param {Object} query - sub query to be negated
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_39488 not-query}
       */
      not: function properties(query) {
        return {
          'not-query': query
        };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_30556 `document-fragment-query`}
       * @method MLQueryBuilder#documentFragment
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#documentFragment
       *
       * @param {Object} query - sub query to be constrained to document fragments
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_30556 document-fragment-query}
       */
      documentFragment: function documentFragment(query) {
        return { 'document-fragment-query': query };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_67222 `properties-fragment-query`}
       * @method MLQueryBuilder#propertiesFragment
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#propertiesFragment
       *
       * @param {Object} query - sub query to be constrained to properties fragments
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_67222 properties-fragment-query}
       */
      propertiesFragment: function propertiesFragment(query) {
        return { 'properties-fragment-query': query };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_53441 `locks-fragment-query`}
       * @method MLQueryBuilder#locksFragment
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#locksFragment
       *
       * @param {Object} query - sub query to be constrained to document locks
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_53441 locks-fragment-query}
       */
      locksFragment: function locksFragment(query) {
        return { 'locks-fragment-query': query };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_76890 `collection-query`}
       * @method MLQueryBuilder#collection
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#collection
       *
       * @param {...String|Array<String>} uris - the collection URIs to query (logical OR)
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_76890 collection-query}
       */
      collection: function collection() {
        var args = asArray.apply(null, arguments);
        return {
          'collection-query': {
            uri: args
          }
        };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_94821 `directory-query`}
       * @method MLQueryBuilder#directory
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#directory
       *
       * @param {...String|Array<String>} uris - the directory URIs to query (logical OR)
       * @param {Boolean} [infinite] - whether to query into all sub-directories (defaults to `true`)
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_94821 directory-query}
       */
      directory: function directory() {
        var args = asArray.apply(null, arguments);
        var last = args[args.length - 1];
        var infinite = true;

        if (last === true || last === false) {
          infinite = last;
          args.pop();
        }

        // horrible hack to support an array of URIs
        if (args.length === 1 && Array.isArray(args[0])) {
          args = args[0];
        }

        return {
          'directory-query': {
            uri: args,
            infinite: infinite
          }
        };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_27172 `document-query`}
       * @method MLQueryBuilder#document
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#document
       *
       * @param {...String} uris - document URIs to match
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_27172 document-query}
       */
      document: function document() {
        var args = asArray.apply(null, arguments);
        return {
          'document-query': {
            uri: args
          }
        };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_25949 `boost-query`}
       * @method MLQueryBuilder#boost
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#boost
       *
       * @param {Object} matching - matching query
       * @param {Object} boosting - boosting query
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_25949 boost-query}
       */
      boost: function boost(matching, boosting) {
        return {
          'boost-query': {
            'matching-query': matching,
            'boosting-query': boosting
          }
        };
      },

      /**
       *
       * @method MLQueryBuilder#qname
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#qname
       */
      qname: function qname(ns, name) {
        var args = asArray.apply(null, arguments);

        if (args.length === 1) {
          return { ns: null, name: args[0] };
        } else {
          return { ns: args[0], name: args[1] };
        }
      },

      /**
       *
       * @method MLQueryBuilder#element
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#element
       */
      element: function element() {
        var args = asArray.apply(null, arguments);
        var qname;

        if (args.length === 1) {
          if (args[0].ns || args[0].name) {
            qname = args[0];
          } else {
            qname = this.qname(args[0]);
          }
        } else {
          qname = this.qname(args[0], args[1]);
        }

        return { element: qname };
      },

      /**
       *
       * @method MLQueryBuilder#datatype
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#datatype
       */
      datatype: function datatype(type, collation) {
        var datatypes = [
          'anyURI',
          'date',
          'dateTime',
          'dayTimeDuration',
          'decimal',
          'double',
          'float',
          'gDay',
          'gMonth',
          'gMonthDay',
          'gYear',
          'gYearMonth',
          'int',
          'long',
          'string',
          'time',
          'unsignedInt',
          'unsignedLong',
          'yearMonthDuration'
        ];

        if (datatypes.indexOf(type) > -1) {
          type = 'xs:' + type;
        } else {
          throw new Error('Unknown datatype: ' + type);
        }

        return {
          datatype: type,
          collation: collation
        };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_83393 `range-query`}
       *
       * @method MLQueryBuilder#range
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#range
       *
       * @param {Object|String|Array<String>} indexedName - the name of a range index
       * @param {Object} [datatype] - the type/collation of the range index (as returned by {@link MLQueryBuilder#datatype})
       * @param {String} [operator] - the query operator
       * @param {...*} [value] - the values to compare
       * @param {Object} [rangeOptions] - the range query options (as returned by {@link MLQueryBuilder#rangeOptions})
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_83393 range-query}
       */
      range: function range() {
        var comparisons = {
          '<': 'LT',
          '<=': 'LE',
          '>': 'GT',
          '>=': 'GE',
          '=': 'EQ',
          '!=': 'NE'
        };

        var args = asArray.apply(null, arguments);

        var indexedName = args.shift();

        // TODO: attribute/field/path
        if (!indexedName.element) {
          indexedName = { 'json-property': indexedName };
        }

        var datatype = args.shift();
        var operator = null;
        var values = [];

        if (datatype && datatype.datatype) {
          datatype = { type: datatype.datatype, collation: datatype.collation };
          operator = args.shift();
        } else {
          operator = datatype;
          datatype = null;
        }

        if (!comparisons[operator]) {
          Array.prototype.push.apply(values, asArray(operator));
          operator = null;
        }

        var options = [];

        args.forEach(function(arg) {
          if (arg['range-option']) {
            Array.prototype.push.apply(options, asArray(arg['range-option']));
          } else {
            Array.prototype.push.apply(values, asArray(arg));
          }
        });

        // console.log(values)

        var query = {
          'range-query': {
            value: values,
            'range-operator': comparisons[operator] || 'EQ',
            'range-option': options
          }
        };

        extendObject(query['range-query'], indexedName, datatype);

        return query;
      },

      /**
       *
       * @method MLQueryBuilder#rangeOptions
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#rangeOptions
       */
      rangeOptions: function rangeOptions(ns, name) {
        var args = asArray.apply(null, arguments);

        return { 'range-option': args };
      },

      /**
       * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_56027 `term-query`}
       * @method MLQueryBuilder#term
       * @see http://docs.marklogic.com/jsdoc/queryBuilder.html#term
       *
       * @param {...String} terms - terms to match (logical OR)
       * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_56027 term-query}
       */
      term: function term() {
        var args = asArray.apply(null, arguments);
        return {
          'term-query': {
            text: args
          }
        };
      },

      /**
       * query builder extensions
       * @memberof MLQueryBuilder
       * @type {Object}
       */
      ext: extensions
    };
  };

  return provide;
})();

module.exports = provider;
