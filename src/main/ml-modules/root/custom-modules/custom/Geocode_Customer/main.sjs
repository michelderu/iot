/*
  Copyright 2012-2019 MarkLogic Corporation

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const DataHub = require("/data-hub/5/datahub.sjs");
const datahub = new DataHub();

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
  if (doc && (doc instanceof Document || doc instanceof XMLDocument)) {
    doc = fn.head(doc.root);
  }

  //get our instance, default shape of envelope is envelope/instance, else it'll return an empty object/array
  let instance = datahub.flow.flowUtils.getInstance(doc) || {};

  // get triples, return null if empty or cannot be found
  let triples = datahub.flow.flowUtils.getTriples(doc) || [];

  //gets headers, return null if cannot be found
  let headers = datahub.flow.flowUtils.getHeaders(doc) || {};

  // CUSTOM CODE HERE //

  instance = xdmp.toJSON(instance).toObject();
  let geo = geocode(instance.Customer.address, 'pk.3c58d18a0b3513d8d24ec8331d7d754a', true);
  instance.Customer.geo = geo;

  //If you want to set attachments, uncomment here
  instance['$attachments'] = doc;

  //form our envelope here now, specifying our output format
  let envelope = datahub.flow.flowUtils.makeEnvelope(instance, headers, triples, outputFormat);

  //assign our envelope value
  content.value = envelope;

  //assign the uri we want, in this case the same
  content.uri = id;

  //assign the context we want
  content.context = context;

  //now let's return out our content to be written
  return content;
}

/*
  Geocode an address
  Uses an API KEY from https://my.locationiq.com/
  Free plan allows 1 lookup per second
  IMPORTANT: Make sure to run this lookup single-threaded!
*/
function geocode (address, api_key, log=false) {
  address = xdmp.urlEncode(address);
  
  // First see if we cached this address already
  let geodata;
  let cache = cts.search(cts.andQuery([cts.collectionQuery("geodata"), cts.jsonPropertyValueQuery('address', address)]));
  if (!fn.empty(cache)) {
    if (log) {console.log('GEOCODE: CACHED RESULT')};
    geodata = fn.head(cache).root.geodata;
  } else {
    // Call the geocoding service and sleep for 1000 ms
    let result = xdmp.httpGet('https://eu1.locationiq.com/v1/search.php?key=' + api_key + '&format=json&q=' + address);
    xdmp.sleep(1000);
    
    result = result.toArray();
    if (result[0].code == '200') {
      // When the HTTP response equals 200, take the result from the service
      if (log) {console.log('GEOCODE: MATCH (' + result[0].code + ' / ' + result[0].message + ')')};
      geodata = result[1].root[0];
    } else {
      // When there is another HTTP response, return an empty result
      if (log) {console.log('GEOCODE: ADDRES NOT FOUND (' + result[0].code + ' / ' + result[0].message + ')')};
      geodata = xdmp.toJSON({});
    }
    
    // Cache the data for future use
    let jsInsert = `
      declareUpdate();
      let geodoc = {
        "address": "` + address + `",
        "geodata": ` + geodata + `
      };
      xdmp.documentInsert(sem.uuidString(), geodoc, {collections: 'geodata'});`
    xdmp.eval(jsInsert, null);
  }

  return {
    coordinate: {
      "lat": geodata.lat,
      "lon": geodata.lon
    },
    "class": geodata.class,
    "type": geodata.type
  };
}

module.exports = {
  main: main
};
