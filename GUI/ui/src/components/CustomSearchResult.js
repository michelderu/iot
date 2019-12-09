import React from 'react';
import { CardResult, SearchView, SearchSnippet} from '@marklogic-community/grove-core-react-components';

// Header of the result blocks
const CustomSearchHeaderContent = props => {
  // Show a customized header
  if (props.result.extracted) {
      return <div>
          <b>{props.result.extracted.content[0].Customer.firstname} {props.result.extracted.content[0].Customer.lastname} ({props.result.extracted.content[0].Customer.id})</b>
      </div>
  }
  // Remove everything before the last '/'
  var uri = decodeURI(props.result.uri);
  return <div>
      <p>{uri.slice(uri.lastIndexOf('/') + 1)}</p>
  </div>
};

// Content of the result blocks
const CustomSearchResultContent = props => {
    if (props.result.extracted) {
      let address = props.result.extracted.content[0].Customer.address;
      let street = address.split(', ')[0];
      let postal_city = address.split(', ')[1] + ' ' + address.split(', ')[2];
        return <div>
                <b>CRM DATA</b>
                <div>{street}</div>
                <div>{postal_city}</div>
                <div><a href="mailto:{props.result.extracted.content[0].Customer.email}">{props.result.extracted.content[0].Customer.email}</a></div>
                <b>ERP DATA</b>
                <div>{props.result.extracted.content[0].Customer.subscriptions[0].Subscription.brand} {props.result.extracted.content[0].Customer.subscriptions[0].Subscription.device_type}</div>
                <div>Maintenance ends: {props.result.extracted.content[0].Customer.subscriptions[0].Subscription.end_date}</div>
        </div>
    }
    return <div className="ml-search-result-matches">
        {
        props.result.matches &&
            props.result.matches.map((match, index) => (
            <SearchSnippet match={match} key={index} />
            ))
        }
    </div>
};

const CustomSearchResult = props => {
  // 1. Suppress the header, though you could change the header instead.
  // 2. Add 'You got a result!' to each result content using the above component.
  return (
    <CardResult
      result={props.result}
      detailPath={props.detailPath}
      header={CustomSearchHeaderContent}
      content={CustomSearchResultContent}
    />
  );
};

export default CustomSearchResult;