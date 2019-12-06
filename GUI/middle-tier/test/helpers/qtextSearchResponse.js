module.exports = {
  henry: {
    metrics: {
      'query-resolution-time': 'PT0.002967S',
      'snippet-resolution-time': 'PT0.005458S',
      'total-time': 'PT0.010867S'
    },
    'page-length': 10,
    qtext: 'henry',
    facets: {
      EyeColor: {
        type: 'xs:string',
        facetValues: [
          {
            name: 'brown',
            count: 60,
            value: 'brown'
          },
          {
            name: 'blue',
            count: 30,
            value: 'blue'
          }
        ]
      }
    },
    results: [
      {
        confidence: 0.6000114,
        fitness: 0.7944844,
        format: 'json',
        href: '/v1/documents?uri=%2Fsample%2Fpeople%2F%2Fdata-1482.json',
        index: 1,
        matches: [
          {
            'match-text': [
              'Elma ',
              {
                highlight: 'Henry'
              }
            ],
            path: "fn:doc('/sample/people//data-1482.json')/text('name')"
          },
          {
            'match-text': [
              'Hello, Elma ',
              {
                highlight: 'Henry'
              },
              '! You have 4 unread messages.'
            ],
            path: "fn:doc('/sample/people//data-1482.json')/text('greeting')"
          }
        ],
        mimetype: 'application/json',
        path: "fn:doc('/sample/people//data-1482.json')",
        score: 115456,
        uri: '/sample/people//data-1482.json'
      },
      {
        confidence: 0.6000114,
        fitness: 0.7944844,
        format: 'json',
        href: '/v1/documents?uri=%2Fsample%2Fmanufacturing%2F%2Fdata-1482.json',
        index: 2,
        matches: [
          {
            'match-text': [
              'Elma ',
              {
                highlight: 'Henry'
              }
            ],
            path: "fn:doc('/sample/manufacturing//data-1482.json')/text('name')"
          },
          {
            'match-text': [
              'Hello, Elma ',
              {
                highlight: 'Henry'
              },
              '! You have 4 unread messages.'
            ],
            path:
              "fn:doc('/sample/manufacturing//data-1482.json')/text('greeting')"
          }
        ],
        mimetype: 'application/json',
        path: "fn:doc('/sample/manufacturing//data-1482.json')",
        score: 115456,
        uri: '/sample/manufacturing//data-1482.json'
      }
    ],
    'snippet-format': 'snippet',
    start: 1,
    total: 2
  },
  henryPageTwo: {
    metrics: {
      'query-resolution-time': 'PT0.002967S',
      'snippet-resolution-time': 'PT0.005458S',
      'total-time': 'PT0.010867S'
    },
    'page-length': 10,
    qtext: 'henry',
    facets: {
      EyeColor: {
        type: 'xs:string',
        facetValues: [
          {
            name: 'brown',
            count: 60,
            value: 'brown'
          },
          {
            name: 'blue',
            count: 30,
            value: 'blue'
          }
        ]
      }
    },
    results: [
      {
        confidence: 0.6000114,
        fitness: 0.7944844,
        format: 'json',
        href: '/v1/documents?uri=%2Fsample%2Fpeople%2F%2Fdata-1482.json',
        index: 1,
        matches: [
          {
            'match-text': [
              'Elma ',
              {
                highlight: 'Henry'
              }
            ],
            path: "fn:doc('/sample/people//data-1482.json')/text('name')"
          },
          {
            'match-text': [
              'Hello, Elma ',
              {
                highlight: 'Henry'
              },
              '! You have 4 unread messages.'
            ],
            path: "fn:doc('/sample/people//data-1482.json')/text('greeting')"
          }
        ],
        mimetype: 'application/json',
        path: "fn:doc('/sample/people//data-1482.json')",
        score: 115456,
        uri: '/sample/people//data-1482.json'
      },
      {
        confidence: 0.6000114,
        fitness: 0.7944844,
        format: 'json',
        href: '/v1/documents?uri=%2Fsample%2Fmanufacturing%2F%2Fdata-1482.json',
        index: 2,
        matches: [
          {
            'match-text': [
              'Elma ',
              {
                highlight: 'Henry'
              }
            ],
            path: "fn:doc('/sample/manufacturing//data-1482.json')/text('name')"
          },
          {
            'match-text': [
              'Hello, Elma ',
              {
                highlight: 'Henry'
              },
              '! You have 4 unread messages.'
            ],
            path:
              "fn:doc('/sample/manufacturing//data-1482.json')/text('greeting')"
          }
        ],
        mimetype: 'application/json',
        path: "fn:doc('/sample/manufacturing//data-1482.json')",
        score: 115456,
        uri: '/sample/manufacturing//data-1482.json'
      }
    ],
    'snippet-format': 'snippet',
    start: 11,
    total: 12
  }
};
