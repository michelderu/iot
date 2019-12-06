'use strict';

var util = require('./util.js');
var asArray = util.asArray;
var isObject = util.isObject;
var extendObject = util.extendObject;

/**
 * Helper method: builds an object of `points`, `boxes`, `circles`, and `polygons`,
 * used by {@link MLQueryBuilder.ext.geospatialConstraint}, for use with
 * {@link MLQueryBuilder.ext.customConstraint}
 *
 * examples:
 *
 *   ```
 *   qb.ext.geospatialConstraint('name',
 *     { latitude: 1, longitude: 2 },
 *     { south: 1, west: 2, north: 3, east: 4 }
 *   );
 *   ```
 *
 *   ```
 *   qb.ext.customConstraint('name', qb.ext.geospatialValues(
 *     { latitude: 1, longitude: 2 },
 *     { south: 1, west: 2, north: 3, east: 4 }
 *   ));
 *   ```
 *
 * @memberof! MLQueryBuilder
 * @method ext.geospatialValues
 *
 * @param {...Object} values - the geospatial values to parse
 * @return {Object} parsed geospatial values
 */
const geospatialValues = function() {
  var shapes = asArray.apply(null, arguments);

  var points = [];
  var boxes = [];
  var circles = [];
  var polygons = [];
  var shape;

  for (var i = 0; i < shapes.length; i++) {
    shape = shapes[i];

    if (shape.latitude || shape.latitude === 0) {
      points.push(shape);
    } else if (shape.south || shape.south === 0) {
      boxes.push(shape);
    } else if (shape.radius) {
      circles.push(shape);
    } else if (shape.point) {
      polygons.push(shape);
    }
  }

  return {
    point: points,
    box: boxes,
    circle: circles,
    polygon: polygons
  };
};

module.exports = exports = {
  /**
   * Builds a {@link http://docs.marklogic.com/guide/rest-dev/search#id_69918 combined query}
   * @memberof! MLQueryBuilder
   * @method ext.combined
   *
   * @param {Object} query - a structured query (from {@link MLQueryBuilder#where})
   * @param {String} [qtext] - a query text string, to be parsed server-side
   * @param {Object} [options] - search options
   * @return {Object} {@link http://docs.marklogic.com/guide/rest-dev/search#id_69918 combined query}
   */
  combined: function combined(query, qtext, options) {
    if (isObject(qtext) && !options) {
      options = qtext;
      qtext = null;
    }

    return {
      search: {
        query: (query && query.query) || query,
        qtext: qtext || '',
        options: (options && options.options) || options
      }
    };
  },

  /**
   * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_38268 `range-constraint-query`}
   * @memberof! MLQueryBuilder
   * @method ext.rangeConstraint
   *
   * @param {String} name - constraint name
   * @param {String} [operator] - operator for matching constraint to `values`; one of `LT`, `LE`, `GT`, `GE`, `EQ`, `NE` (defaults to `EQ`)
   * @param {String|Array<String>} values - the values the constraint should equal (logical OR)
   * @param {String|Array<String>} [options] - range options: {@link http://docs.marklogic.com/guide/rest-dev/appendixa#id_84264}
   * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_38268 range-constraint-query}
   */
  rangeConstraint: function rangeConstraint(name, operator, values, options) {
    if (!values && !options) {
      values = operator;
      operator = null;
    }

    if (
      operator &&
      ['LT', 'LE', 'GT', 'GE', 'EQ', 'NE'].indexOf(operator) === -1
    ) {
      throw new Error('invalid rangeConstraint query operator: ' + operator);
    }

    return {
      'range-constraint-query': {
        'constraint-name': name,
        value: asArray(values),
        'range-operator': operator || 'EQ',
        'range-option': asArray(options)
      }
    };
  },

  /**
   * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_63420 `value-constraint-query`}
   * @memberof! MLQueryBuilder
   * @method ext.valueConstraint
   *
   * @param {String} name - constraint name
   * @param {String|Number|Array<String>|Array<Number>|null} values - the values the constraint should equal (logical OR)
   * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_63420 value-constraint-query}
   */
  valueConstraint: function valueConstraint(name, values) {
    var query = {
      'value-constraint-query': {
        'constraint-name': name
      }
    };

    var type;

    if (values === null) {
      type = 'null';
      values = [];
    } else {
      values = asArray(values);
      type = typeof values[0];
      type = (type === 'string' && 'text') || type;
    }

    query['value-constraint-query'][type] = values;

    return query;
  },

  /**
   * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_66833 `word-constraint-query`}
   * @memberof! MLQueryBuilder
   * @method ext.wordConstraint
   *
   * @param {String} name - constraint name
   * @param {String|Array<String>} values - the values the constraint should equal (logical OR)
   * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_66833 word-constraint-query}
   */
  wordConstraint: function wordConstraint(name, values) {
    return {
      'word-constraint-query': {
        'constraint-name': name,
        text: asArray(values)
      }
    };
  },

  /**
   * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_30776 `collection-constraint-query`}
   * @memberof! MLQueryBuilder
   * @method ext.collectionConstraint
   *
   * @param {String} name - constraint name
   * @param {String|Array<String>} values - the values the constraint should equal (logical OR)
   * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_30776 collection-constraint-query}
   */
  collectionConstraint: function collectionConstraint(name, values) {
    return {
      'collection-constraint-query': {
        'constraint-name': name,
        uri: asArray(values)
      }
    };
  },

  /**
   * Builds a {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_28778 `custom-constraint-query`}
   * @memberof! MLQueryBuilder
   * @method ext.customConstraint
   *
   * @param {String} name - constraint name
   * @param {...String|Array<String>|Array<Object>} values - the values the constraint should equal (logical OR)
   * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_28778 custom-constraint-query}
   */
  customConstraint: function customConstraint() {
    var args = asArray.apply(null, arguments);

    var constraintName = args.shift();

    // horrible hack for when arguments.length === 2 and arguments[1] is an array
    if (args.length === 1 && Array.isArray(args[0])) {
      args = args[0];
    }

    // args instanceof Array<Object>
    var shouldExtend = args
      .map(function(arg) {
        return isObject(arg);
      })
      .reduce(function(a, b) {
        return a && b;
      });

    var query = {
      'custom-constraint-query': {
        'constraint-name': constraintName
      }
    };

    if (shouldExtend) {
      while (args.length) {
        extendObject(query['custom-constraint-query'], args.shift());
      }
    } else {
      query['custom-constraint-query'].text = args.filter(function(arg) {
        return !isObject(arg);
      });
    }

    return query;
  },

  /**
   * builds a [geospatial-constraint-query](http://docs.marklogic.com/guide/search-dev/structured-query#id_88775)
   * @memberof! MLQueryBuilder
   * @method ext.geospatialConstraint
   *
   * @param {String} name - constraint name
   * @param {...Object} values - the geospatial values to parse
   * @return {Object} [geospatial-constraint-query](http://docs.marklogic.com/guide/search-dev/structured-query#id_88775)
   */
  geospatialConstraint: function geospatialConstraint() {
    var args = asArray.apply(null, arguments);

    var constraintName = args.shift();

    // horrible hack for when arguments.length === 2 and arguments[1] is an array
    if (args.length === 1 && Array.isArray(args[0])) {
      args = args[0];
    }

    var geoValues = geospatialValues(args);
    var query = {
      'geospatial-constraint-query': {
        'constraint-name': constraintName
      }
    };

    extendObject(query['geospatial-constraint-query'], geoValues);

    return query;
  },

  /**
   * constraint query function factory
   * @memberof! MLQueryBuilder
   * @method ext.constraint
   *
   * @param {String} type - constraint type (`'value' || 'word' || collection' || 'custom' || '*'`)
   * @return {Function} a constraint query builder function, one of:
   *   - {@link MLQueryBuilder.ext.rangeConstraint}
   *   - {@link MLQueryBuilder.ext.valueConstraint}
   *   - {@link MLQueryBuilder.ext.wordConstraint}
   *   - {@link MLQueryBuilder.ext.collectionConstraint}
   *   - {@link MLQueryBuilder.ext.customConstraint}
   */
  constraint: function constraint(type) {
    switch (type) {
      case 'value':
        return this.valueConstraint;
      case 'word':
        return this.wordConstraint;
      case 'custom':
        return this.customConstraint;
      case 'collection':
        return this.collectionConstraint;
      case 'geospatial':
        return this.geospatialConstraint;
      default:
        return this.rangeConstraint;
    }
  },

  /**
   * Builds an {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_45570 `operator-state` query component}
   * @memberof! MLQueryBuilder
   * @method ext.operatorState
   *
   * @param {String} name - operator name
   * @param {String} stateName - operator-state name
   * @return {Object} {@link http://docs.marklogic.com/guide/search-dev/structured-query#id_45570 operator-state query component}
   */
  operatorState: function operatorState(name, stateName) {
    return {
      'operator-state': {
        'operator-name': name,
        'state-name': stateName
      }
    };
  }
};
