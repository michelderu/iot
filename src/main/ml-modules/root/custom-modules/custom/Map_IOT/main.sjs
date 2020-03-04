const DataHub = require("/data-hub/5/datahub.sjs");
var gHelper  = require("/custom-modules/pipes/graphHelper")
const datahub = new DataHub();


function getGraphDefinition() {
  return {"models":[{"label":"raw_device","collection":"raw_device","source":"Sources","fields":[{"label":"co [id8]","field":"co","value":"co","path":"/envelope/instance/number-node('co')","type":16,"children":[],"parent":"/envelope/instance"},{"label":"id [id7]","field":"id","value":"id","path":"/envelope/instance/text('id')","type":3,"children":[],"parent":"/envelope/instance"},{"label":"ot [id11]","field":"ot","value":"ot","path":"/envelope/instance/number-node('ot')","type":16,"children":[],"parent":"/envelope/instance"},{"label":"rt [id10]","field":"rt","value":"rt","path":"/envelope/instance/number-node('rt')","type":16,"children":[],"parent":"/envelope/instance"},{"label":"wt [id9]","field":"wt","value":"wt","path":"/envelope/instance/number-node('wt')","type":16,"children":[],"parent":"/envelope/instance"}],"options":["nodeInput","fieldsOutputs"]},{"label":"IOT","collection":"IOT","source":"Entities","fields":[{"label":"co","field":"co","path":"//co"},{"label":"co_warning","field":"co_warning","path":"//co_warning"},{"label":"device_id","field":"device_id","path":"//device_id"},{"label":"id","field":"id","path":"//id"},{"label":"outside_temp","field":"outside_temp","path":"//outside_temp"},{"label":"request_temp","field":"request_temp","path":"//request_temp"},{"label":"water_temp","field":"water_temp","path":"//water_temp"}],"options":["fieldsInputs","nodeOutput"]}],"executionGraph":{"last_node_id":14,"last_link_id":21,"nodes":[{"id":3,"type":"Sources/raw_device","pos":[436,355],"size":[305,168],"flags":{},"order":3,"mode":0,"inputs":[{"name":"Node","type":0,"link":1}],"outputs":[{"name":"co","links":[5]},{"name":"id","links":[6]},{"name":"ot","links":[7]},{"name":"rt","links":[8]},{"name":"wt","links":[9]}],"properties":{},"widgets_values":[true]},{"id":1,"type":"dhf/input","pos":[150,602],"size":[180,60],"flags":{},"order":0,"mode":0,"outputs":[{"name":"input","type":"","links":[1,19]},{"name":"uri","type":"","links":[20]},{"name":"collections","type":"","links":null}],"properties":{}},{"id":5,"type":"string/uuid","pos":[663,125],"size":{"0":255,"1":58},"flags":{},"order":1,"mode":0,"outputs":[{"name":"uuid","links":[10]}],"properties":{},"widgets_values":[""]},{"id":4,"type":"Entities/IOT","pos":[1011,332],"size":[305,208],"flags":{},"order":4,"mode":0,"inputs":[{"name":"co","type":0,"link":5},{"name":"co_warning","type":0,"link":null},{"name":"device_id","type":0,"link":6},{"name":"id","type":0,"link":10},{"name":"outside_temp","type":0,"link":7},{"name":"request_temp","type":0,"link":8},{"name":"water_temp","type":0,"link":9}],"outputs":[{"name":"Node","type":"Node","links":[18]},{"name":"Prov","type":null,"links":null}],"properties":{},"widgets_values":[true]},{"id":14,"type":"dhf/envelope","pos":[1480,492],"size":[180,160],"flags":{},"order":5,"mode":0,"inputs":[{"name":"headers","type":0,"link":null},{"name":"triples","type":0,"link":null},{"name":"instance","type":0,"link":18},{"name":"attachments","type":0,"link":19},{"name":"uri","type":0,"link":20},{"name":"collections","type":0,"link":21}],"outputs":[{"name":"output","type":null,"links":[17]}],"properties":{}},{"id":13,"type":"dhf/output","pos":[1817,509],"size":[180,160],"flags":{},"order":6,"mode":0,"inputs":[{"name":"output","type":0,"link":17}],"properties":{}},{"id":12,"type":"string/constant","pos":[842,772],"size":[180,60],"flags":{},"order":2,"mode":0,"outputs":[{"name":"value","type":"xs:string","links":[21]}],"properties":{},"widgets_values":["iot"]}],"links":[[1,1,0,3,0,0],[5,3,0,4,0,0],[6,3,1,4,2,0],[7,3,2,4,4,0],[8,3,3,4,5,0],[9,3,4,4,6,0],[10,5,0,4,3,0],[17,14,0,13,0,0],[18,4,0,14,2,0],[19,1,0,14,3,0],[20,1,1,14,4,0],[21,12,0,14,5,0]],"groups":[],"config":{},"version":0.4}}}

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