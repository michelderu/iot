const DataHub = require("/data-hub/5/datahub.sjs");
var gHelper  = require("/custom-modules/graphHelper")
const datahub = new DataHub();


function getGraphDefinition() {

  return {
    "models": [{
      "label": "raw_crm",
      "collection": "raw_crm",
      "source": "Sources",
      "fields": [{
        "label": "address [id12]",
        "field": "address",
        "value": "address",
        "path": "/envelope/instance/text('address')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "email [id11]",
        "field": "email",
        "value": "email",
        "path": "/envelope/instance/text('email')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "first_name [id9]",
        "field": "first_name",
        "value": "first_name",
        "path": "/envelope/instance/text('first_name')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "id [id8]",
        "field": "id",
        "value": "id",
        "path": "/envelope/instance/text('id')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "last_name [id10]",
        "field": "last_name",
        "value": "last_name",
        "path": "/envelope/instance/text('last_name')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }],
      "options": ["nodeInput", "fieldsOutputs"]
    }, {
      "label": "Customer",
      "collection": "Customer",
      "source": "Entities",
      "fields": [{
        "label": "address",
        "field": "address",
        "path": "//address"
      }, {
        "label": "email",
        "field": "email",
        "path": "//email"
      }, {
        "label": "firstname",
        "field": "firstname",
        "path": "//firstname"
      }, {
        "label": "id",
        "field": "id",
        "path": "//id"
      }, {
        "label": "lastname",
        "field": "lastname",
        "path": "//lastname"
      }, {
        "label": "subscriptions",
        "field": "subscriptions",
        "path": "//subscriptions"
      }],
      "options": ["fieldsInputs", "nodeOutput"]
    }, {
      "label": "raw_erp",
      "collection": "raw_erp",
      "source": "Sources",
      "fields": [{
        "label": "device [id9]",
        "field": "device",
        "value": "device",
        "path": "/envelope/instance/text('device')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "device_id [id13]",
        "field": "device_id",
        "value": "device_id",
        "path": "/envelope/instance/text('device_id')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "end_date [id12]",
        "field": "end_date",
        "value": "end_date",
        "path": "/envelope/instance/text('end_date')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "start_date [id11]",
        "field": "start_date",
        "value": "start_date",
        "path": "/envelope/instance/text('start_date')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "type [id10]",
        "field": "type",
        "value": "type",
        "path": "/envelope/instance/text('type')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }],
      "options": ["nodeInput", "fieldsOutputs"]
    }, {
      "label": "Subscription",
      "collection": "Subscription",
      "source": "Entities",
      "fields": [{
        "label": "customer_id",
        "field": "customer_id",
        "path": "//customer_id"
      }, {
        "label": "device_type",
        "field": "device_type",
        "path": "//device"
      }, {
        "label": "device_id",
        "field": "device_id",
        "path": "//device_id"
      }, {
        "label": "end",
        "field": "end",
        "path": "//end"
      }, {
        "label": "start",
        "field": "start",
        "path": "//start"
      }, {
        "label": "type",
        "field": "type",
        "path": "//type"
      }],
      "options": ["fieldsInputs", "nodeOutput"]
    }, {
      "label": "raw_crm",
      "collection": "raw_crm",
      "source": "Sources",
      "fields": [{
        "label": "account_number [id19]",
        "field": "account_number",
        "value": "account_number",
        "path": "/envelope/instance/text('account_number')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "city [id13]",
        "field": "city",
        "value": "city",
        "path": "/envelope/instance/text('city')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "company [id17]",
        "field": "company",
        "value": "company",
        "path": "/envelope/instance/text('company')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "customer_id [id21]",
        "field": "customer_id",
        "value": "customer_id",
        "path": "/envelope/instance/text('customer_id')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "dob [id10]",
        "field": "dob",
        "value": "dob",
        "path": "/envelope/instance/text('dob')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "email [id16]",
        "field": "email",
        "value": "email",
        "path": "/envelope/instance/text('email')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "first_name [id8]",
        "field": "first_name",
        "value": "first_name",
        "path": "/envelope/instance/text('first_name')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "gender [id14]",
        "field": "gender",
        "value": "gender",
        "path": "/envelope/instance/text('gender')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "id [id22]",
        "field": "id",
        "value": "id",
        "path": "/envelope/instance/text('id')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "ip_address [id20]",
        "field": "ip_address",
        "value": "ip_address",
        "path": "/envelope/instance/text('ip_address')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "job_title [id18]",
        "field": "job_title",
        "value": "job_title",
        "path": "/envelope/instance/text('job_title')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "last_name [id9]",
        "field": "last_name",
        "value": "last_name",
        "path": "/envelope/instance/text('last_name')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "phone [id15]",
        "field": "phone",
        "value": "phone",
        "path": "/envelope/instance/text('phone')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "street_address [id11]",
        "field": "street_address",
        "value": "street_address",
        "path": "/envelope/instance/text('street_address')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "zip_code [id12]",
        "field": "zip_code",
        "value": "zip_code",
        "path": "/envelope/instance/text('zip_code')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }],
      "options": ["nodeInput", "fieldsOutputs"]
    }, {
      "label": "Customer",
      "collection": "Customer",
      "source": "Entities",
      "fields": [{
        "label": "address",
        "field": "address",
        "path": "//address"
      }, {
        "label": "email",
        "field": "email",
        "path": "//email"
      }, {
        "label": "firstname",
        "field": "firstname",
        "path": "//firstname"
      }, {
        "label": "id",
        "field": "id",
        "path": "//id"
      }, {
        "label": "lastname",
        "field": "lastname",
        "path": "//lastname"
      }, {
        "label": "subscriptions",
        "field": "subscriptions",
        "path": "//subscriptions"
      }],
      "options": ["fieldsInputs", "nodeOutput"]
    }, {
      "label": "Subscription",
      "collection": "Subscription",
      "source": "Entities",
      "fields": [{
        "label": "brand",
        "field": "brand",
        "path": "//brand"
      }, {
        "label": "device_type",
        "field": "device_type",
        "path": "//device"
      }, {
        "label": "device_id",
        "field": "device_id",
        "path": "//device_id"
      }, {
        "label": "end_date",
        "field": "end_date",
        "path": "//end_date"
      }, {
        "label": "start_date",
        "field": "start_date",
        "path": "//start_date"
      }],
      "options": ["fieldsInputs", "nodeOutput"]
    }, {
      "label": "raw_erp",
      "collection": "raw_erp",
      "source": "Sources",
      "fields": [{
        "label": "brand [id10]",
        "field": "brand",
        "value": "brand",
        "path": "/envelope/instance/text('brand')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "customer_id [id14]",
        "field": "customer_id",
        "value": "customer_id",
        "path": "/envelope/instance/text('customer_id')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "device [id9]",
        "field": "device",
        "value": "device",
        "path": "/envelope/instance/text('device')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "device_id [id13]",
        "field": "device_id",
        "value": "device_id",
        "path": "/envelope/instance/text('device_id')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "end_date [id12]",
        "field": "end_date",
        "value": "end_date",
        "path": "/envelope/instance/text('end_date')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "id [id8]",
        "field": "id",
        "value": "id",
        "path": "/envelope/instance/text('id')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }, {
        "label": "start_date [id11]",
        "field": "start_date",
        "value": "start_date",
        "path": "/envelope/instance/text('start_date')",
        "type": 3,
        "children": [],
        "parent": "/envelope/instance"
      }],
      "options": ["nodeInput", "fieldsOutputs"]
    }],
    "executionGraph": {
      "last_node_id": 14,
      "last_link_id": 32,
      "nodes": [{
        "id": 1,
        "type": "dhf/input",
        "pos": [165, 469],
        "size": [180, 60],
        "flags": {},
        "order": 0,
        "mode": 0,
        "outputs": [{
          "name": "input",
          "type": "",
          "links": [1, 22]
        }, {
          "name": "uri",
          "type": "",
          "links": [11]
        }, {
          "name": "collections",
          "type": "",
          "links": []
        }],
        "properties": {}
      }, {
        "id": 4,
        "type": "Entities/Customer",
        "pos": [1345, 199],
        "size": [305, 188],
        "flags": {},
        "order": 6,
        "mode": 0,
        "inputs": [{
          "name": "address",
          "type": 0,
          "link": 5
        }, {
          "name": "email",
          "type": 0,
          "link": 6
        }, {
          "name": "firstname",
          "type": 0,
          "link": 7
        }, {
          "name": "id",
          "type": 0,
          "link": 28
        }, {
          "name": "lastname",
          "type": 0,
          "link": 8
        }, {
          "name": "subscriptions",
          "type": 0,
          "link": 27
        }],
        "outputs": [{
          "name": "Node",
          "type": "Node",
          "links": [10]
        }, {
          "name": "Prov",
          "type": null,
          "links": []
        }],
        "properties": {},
        "widgets_values": [true]
      }, {
        "id": 5,
        "type": "string/Templating",
        "pos": [930, 202],
        "size": [230, 160],
        "flags": {},
        "order": 4,
        "mode": 0,
        "inputs": [{
          "name": "v1",
          "type": 0,
          "link": 2
        }, {
          "name": "v2",
          "type": 0,
          "link": 3
        }, {
          "name": "v3",
          "type": 0,
          "link": 4
        }],
        "outputs": [{
          "name": "newString",
          "type": "xs:string",
          "links": [5]
        }],
        "properties": {},
        "widgets_values": ["v4", "v5", "${v1}, ${v2}, ${v3}"]
      }, {
        "id": 3,
        "type": "Sources/raw_crm",
        "pos": [445, 189],
        "size": [305, 368],
        "flags": {},
        "order": 2,
        "mode": 0,
        "inputs": [{
          "name": "Node",
          "type": 0,
          "link": 1
        }],
        "outputs": [{
          "name": "account_number",
          "links": null
        }, {
          "name": "city",
          "links": [4]
        }, {
          "name": "company",
          "links": null
        }, {
          "name": "customer_id",
          "links": [28, 29]
        }, {
          "name": "dob",
          "links": null
        }, {
          "name": "email",
          "links": [6]
        }, {
          "name": "first_name",
          "links": [7]
        }, {
          "name": "gender",
          "links": null
        }, {
          "name": "id",
          "links": []
        }, {
          "name": "ip_address",
          "links": []
        }, {
          "name": "job_title",
          "links": null
        }, {
          "name": "last_name",
          "links": [8]
        }, {
          "name": "phone",
          "links": null
        }, {
          "name": "street_address",
          "links": [2]
        }, {
          "name": "zip_code",
          "links": [3]
        }],
        "properties": {},
        "widgets_values": [true]
      }, {
        "id": 2,
        "type": "dhf/output",
        "pos": [1528, 712],
        "size": [180, 160],
        "flags": {},
        "order": 7,
        "mode": 0,
        "inputs": [{
          "name": "output",
          "type": 0,
          "link": null
        }, {
          "name": "headers",
          "type": 0,
          "link": null
        }, {
          "name": "triples",
          "type": 0,
          "link": null
        }, {
          "name": "instance",
          "type": 0,
          "link": 10
        }, {
          "name": "attachments",
          "type": 0,
          "link": 21
        }, {
          "name": "uri",
          "type": 0,
          "link": 11
        }, {
          "name": "collections",
          "type": 0,
          "link": 32
        }],
        "properties": {}
      }, {
        "id": 10,
        "type": "basic/Array",
        "pos": [1275, 608],
        "size": {
          "0": 170,
          "1": 106
        },
        "flags": {},
        "order": 5,
        "mode": 0,
        "inputs": [{
          "name": "item1",
          "type": 0,
          "link": 22
        }, {
          "name": "item2",
          "type": 0,
          "link": 30
        }, {
          "name": "item3",
          "type": 0,
          "link": null
        }, {
          "name": "item4",
          "type": 0,
          "link": null
        }, {
          "name": "item5",
          "type": 0,
          "link": null
        }],
        "outputs": [{
          "name": "array",
          "links": [21]
        }],
        "properties": {}
      }, {
        "id": 12,
        "type": "graph/subgraph",
        "pos": [985, 455],
        "size": {
          "0": 211.60000610351562,
          "1": 66
        },
        "flags": {},
        "order": 3,
        "mode": 0,
        "inputs": [{
          "name": "customer_id",
          "type": 0,
          "link": 29
        }],
        "outputs": [{
          "name": "subscriptions",
          "type": 0,
          "links": [27]
        }, {
          "name": "attachment",
          "type": 0,
          "links": [30]
        }],
        "title": "Lookup subscriptions",
        "properties": {
          "enabled": true
        },
        "subgraph": {
          "last_node_id": 13,
          "last_link_id": 27,
          "nodes": [{
            "id": 2,
            "type": "graph/output",
            "pos": [1575, 279],
            "size": [180, 60],
            "flags": {},
            "order": 10,
            "mode": 0,
            "inputs": [{
              "name": "",
              "type": 0,
              "link": 6
            }],
            "properties": {
              "name": "subscriptions",
              "type": 0
            }
          }, {
            "id": 1,
            "type": "graph/input",
            "pos": [145, 168],
            "size": [180, 90],
            "flags": {},
            "order": 0,
            "mode": 0,
            "outputs": [{
              "name": "",
              "type": "number",
              "links": [10]
            }],
            "properties": {
              "name": "customer_id",
              "type": "",
              "value": null
            }
          }, {
            "id": 6,
            "type": "cts/ExpertQueryBuilder",
            "pos": [440, 129],
            "size": {
              "0": 255,
              "1": 58
            },
            "flags": {},
            "order": 1,
            "mode": 0,
            "inputs": [{
              "name": "v0",
              "type": 0,
              "link": 10
            }],
            "outputs": [{
              "name": "ctsQuery",
              "links": [11]
            }],
            "properties": {
              "ctsQuery": "cts.andQuery([\ncts.collectionQuery(\"ERP\"),\ncts.jsonPropertyValueQuery(\"customer_id\", \"${v0}\")\n])"
            },
            "widgets_values": ["1"]
          }, {
            "id": 7,
            "type": "cts/search",
            "pos": [444, 249],
            "size": {
              "0": 170,
              "1": 26
            },
            "flags": {},
            "order": 2,
            "mode": 0,
            "inputs": [{
              "name": "query",
              "type": 0,
              "link": 11
            }],
            "outputs": [{
              "name": "results",
              "links": [15]
            }],
            "properties": {}
          }, {
            "id": 9,
            "type": "fn/head",
            "pos": [443, 342],
            "size": {
              "0": 170,
              "1": 26
            },
            "flags": {},
            "order": 3,
            "mode": 0,
            "inputs": [{
              "name": "nodes",
              "type": 0,
              "link": 15
            }],
            "outputs": [{
              "name": "node",
              "links": [16, 23]
            }],
            "properties": {}
          }, {
            "id": 5,
            "type": "Entities/Subscription",
            "pos": [1201, 212],
            "size": [305, 168],
            "flags": {},
            "order": 9,
            "mode": 0,
            "inputs": [{
              "name": "brand",
              "type": 0,
              "link": 14
            }, {
              "name": "device_type",
              "type": 0,
              "link": 22
            }, {
              "name": "device_id",
              "type": 0,
              "link": 18
            }, {
              "name": "end_date",
              "type": 0,
              "link": 25
            }, {
              "name": "start_date",
              "type": 0,
              "link": 27
            }],
            "outputs": [{
              "name": "Node",
              "type": "Node",
              "links": [6]
            }, {
              "name": "Prov",
              "type": null,
              "links": null
            }],
            "properties": {},
            "widgets_values": [true]
          }, {
            "id": 10,
            "type": "string/Map values",
            "pos": [813, 146],
            "size": {
              "0": 255,
              "1": 58
            },
            "flags": {},
            "order": 6,
            "mode": 0,
            "inputs": [{
              "name": "value",
              "type": 0,
              "link": 21
            }],
            "outputs": [{
              "name": "mappedValue",
              "links": [22]
            }],
            "properties": {
              "mapping": [{
                "source": "C",
                "target": "cv"
              }, {
                "source": "W",
                "target": "warmptepomp"
              }, {
                "source": "G",
                "target": "geiser"
              }, {
                "source": "A",
                "target": "airconditioning"
              }, {
                "source": "B",
                "target": "boiler"
              }]
            },
            "widgets_values": ["string"]
          }, {
            "id": 8,
            "type": "Sources/raw_erp",
            "pos": [442, 426],
            "size": [305, 208],
            "flags": {},
            "order": 4,
            "mode": 0,
            "inputs": [{
              "name": "Node",
              "type": 0,
              "link": 16
            }],
            "outputs": [{
              "name": "brand",
              "links": [14]
            }, {
              "name": "customer_id",
              "links": null
            }, {
              "name": "device",
              "links": [21]
            }, {
              "name": "device_id",
              "links": [18]
            }, {
              "name": "end_date",
              "links": [24]
            }, {
              "name": "id",
              "links": null
            }, {
              "name": "start_date",
              "links": [26]
            }],
            "properties": {},
            "widgets_values": [true]
          }, {
            "id": 12,
            "type": "date/FormatDateAuto",
            "pos": [890, 518],
            "size": {
              "0": 170,
              "1": 26
            },
            "flags": {},
            "order": 7,
            "mode": 0,
            "inputs": [{
              "name": "inputDate",
              "type": 0,
              "link": 24
            }],
            "outputs": [{
              "name": "IsoDate",
              "links": [25]
            }],
            "properties": {}
          }, {
            "id": 13,
            "type": "date/FormatDateAuto",
            "pos": [892, 592],
            "size": {
              "0": 170,
              "1": 26
            },
            "flags": {},
            "order": 8,
            "mode": 0,
            "inputs": [{
              "name": "inputDate",
              "type": 0,
              "link": 26
            }],
            "outputs": [{
              "name": "IsoDate",
              "links": [27]
            }],
            "properties": {}
          }, {
            "id": 11,
            "type": "graph/output",
            "pos": [1576, 475],
            "size": [180, 60],
            "flags": {},
            "order": 5,
            "mode": 0,
            "inputs": [{
              "name": "",
              "type": 0,
              "link": 23
            }],
            "properties": {
              "name": "attachment",
              "type": 0
            }
          }],
          "links": [
            [6, 5, 0, 2, 0, 0],
            [10, 1, 0, 6, 0, 0],
            [11, 6, 0, 7, 0, 0],
            [14, 8, 0, 5, 0, 0],
            [15, 7, 0, 9, 0, 0],
            [16, 9, 0, 8, 0, 0],
            [18, 8, 3, 5, 2, 0],
            [21, 8, 2, 10, 0, 0],
            [22, 10, 0, 5, 1, 0],
            [23, 9, 0, 11, 0, 0],
            [24, 8, 4, 12, 0, 0],
            [25, 12, 0, 5, 3, 0],
            [26, 8, 6, 13, 0, 0],
            [27, 13, 0, 5, 4, 0]
          ],
          "groups": [],
          "config": {},
          "version": 0.4
        }
      }, {
        "id": 14,
        "type": "string/constant",
        "pos": [1171, 828],
        "size": [180, 60],
        "flags": {},
        "order": 1,
        "mode": 0,
        "outputs": [{
          "name": "value",
          "type": "xs:string",
          "links": [32]
        }],
        "properties": {},
        "widgets_values": [""]
      }],
      "links": [
        [1, 1, 0, 3, 0, 0],
        [2, 3, 13, 5, 0, 0],
        [3, 3, 14, 5, 1, 0],
        [4, 3, 1, 5, 2, 0],
        [5, 5, 0, 4, 0, 0],
        [6, 3, 5, 4, 1, 0],
        [7, 3, 6, 4, 2, 0],
        [8, 3, 11, 4, 4, 0],
        [10, 4, 0, 2, 3, 0],
        [11, 1, 1, 2, 5, 0],
        [21, 10, 0, 2, 4, 0],
        [22, 1, 0, 10, 0, 0],
        [27, 12, 0, 4, 5, 0],
        [28, 3, 3, 4, 3, 0],
        [29, 3, 3, 12, 0, 0],
        [30, 12, 1, 10, 1, 0],
        [32, 14, 0, 2, 6, 0]
      ],
      "groups": [],
      "config": {},
      "version": 0.4
    }
  }
}

function main(content, options) {

  //grab the doc id/uri
  let id = content.uri;

  //here we can grab and manipulate the context metadata attached to the document
  let context = content.context;

  //let's set our output format, so we know what we're exporting
  let outputFormat = options.outputFormat ? options.outputFormat.toLowerCase() : datahub.flow.consts.DEFAULT_FORMAT;

  //here we check to make sure we're not trying to push out a binary or text document, just xml or json
  if (outputFormat !== datahub.flow.consts.JSON && outputFormat !== datahub.flow.consts.XML) {
    datahub.debug.log({
      message: 'The output format of type ' + outputFormat + ' is invalid. Valid options are ' + datahub.flow.consts.XML + ' or ' + datahub.flow.consts.JSON + '.',
      type: 'error'
    });
    throw Error('The output format of type ' + outputFormat + ' is invalid. Valid options are ' + datahub.flow.consts.XML + ' or ' + datahub.flow.consts.JSON + '.');
  }

  /*
  This scaffolding assumes we obtained the document from the database. If you are inserting information, you will
  have to map data from the content.value appropriately and create an instance (object), headers (object), and triples
  (array) instead of using the flowUtils functions to grab them from a document that was pulled from MarkLogic.
  Also you do not have to check if the document exists as in the code below.

  Example code for using data that was sent to MarkLogic server for the document
  let instance = content.value;
  let triples = [];
  let headers = {};
   */

  //Here we check to make sure it's still there before operating on it
  if (!fn.docAvailable(id)) {
    datahub.debug.log({message: 'The document with the uri: ' + id + ' could not be found.', type: 'error'});
    throw Error('The document with the uri: ' + id + ' could not be found.')
  }

  //grab the 'doc' from the content value space
  let doc = content.value;

  // let's just grab the root of the document if its a Document and not a type of Node (ObjectNode or XMLNode)
  //if (doc && (doc instanceof Document || doc instanceof XMLDocument)) {
  //  doc = fn.head(doc.root);
  //}

  /*
  //get our instance, default shape of envelope is envelope/instance, else it'll return an empty object/array
  let instance = datahub.flow.flowUtils.getInstance(doc) || {};

  // get triples, return null if empty or cannot be found
  let triples = datahub.flow.flowUtils.getTriples(doc) || [];

  //gets headers, return null if cannot be found
  let headers = datahub.flow.flowUtils.getHeaders(doc) || {};

  //If you want to set attachments, uncomment here
  // instance['$attachments'] = doc;
  */



  //insert code to manipulate the instance, triples, headers, uri, context metadata, etc.


  let results = gHelper.executeGraphStep(doc,id,getGraphDefinition(),{collections: xdmp.documentGetCollections(id)})
  return results;
}

module.exports = {
  main: main
};
