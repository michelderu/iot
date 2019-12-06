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

  //If you want to set attachments, uncomment here
  // instance['$attachments'] = doc;

  //insert code to manipulate the instance, triples, headers, uri, context metadata, etc.
  let filteredDoc = xdmp.documentFilter(doc);
  //filteredDoc = xdmp.tidy(filteredDoc).toArray()[1];
  filteredDoc = xdmp.quote(filteredDoc);
  //let filteredDoc = xdmp.pdfConvert(doc, sem.uuidString());

  /*

  // Get all publishers
  let jsPublishers = `
  var op = require("/MarkLogic/optic");
  let publishers = op.fromView('Inventory', 'Inventory')
  .where(
    op.and(
      op.eq(op.col("relevant"), true),
      op.ne(op.col('norm_publisher'), 'null')
    )
  )
  .select(['norm_publisher'])
  .result();
  fn.distinctValues(publishers);
  `;
  let publishers = xdmp.eval(jsPublishers, null, {"database" : xdmp.database("data-hub-FINAL")});
  console.log(publishers);

  // Get all products
  let jsProducts = `
  var op = require("/MarkLogic/optic");
  let products = op.fromView('Inventory', 'Inventory')
  .where(
    op.and(
      op.eq(op.col("relevant"), true),
      op.ne(op.col('norm_product'), 'null')
    )
  )
  .select(['norm_product'])
  .result();
  fn.distinctValues(products);
  `;
  let products = xdmp.eval(jsProducts, null, {"database" : xdmp.database("data-hub-FINAL")});
  console.log(products);

  // Build up an entity array
  let entities = new Array();
  for (var p of publishers) {
    entities.push(cts.entity(sem.uuidString(), p['Inventory.Inventory.norm_publisher'], p['Inventory.Inventory.norm_publisher'], 'norm_publisher'));
  }
  for (var p of products) {
    entities.push(cts.entity(sem.uuidString(), p['Inventory.Inventory.norm_product'], p['Inventory.Inventory.norm_product'], 'norm_product'));
  }
  let dictionary = cts.entityDictionary(entities);

  // Find the entities
  let resultBuilder = new NodeBuilder();
  cts.entityHighlight(filteredDoc,
    function(builder, entityType, text, normText, entityId, node, start) {
      if (text != '') {
        builder.addElement(fn.replace(entityType, ':| ', '-'), text, '');
      } 
    },
    resultBuilder, dictionary);
  instance = resultBuilder.toNode();

  */
  
  // Enrich postal codes
  filteredDoc = fn.replace(filteredDoc, '(Feenstra)', '<type xmlns="">$1</type>');
  filteredDoc = fn.replace(filteredDoc, '(warmtepomp)', '<device xmlns="">$1</device>');

  instance = xdmp.unquote(filteredDoc);

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

module.exports = {
  main: main
};
