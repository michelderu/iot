import React from 'react';
import { CardResult, SearchView, SearchSnippet} from '@marklogic-community/grove-core-react-components';

const CustomSearchResultContent = props => {
    if (props.result.extracted) {
        return <div>
                <div>{props.result.extracted.content[0].Inventory.publisher}</div>
                <div>{props.result.extracted.content[0].Inventory.product}</div>
                <div>{props.result.extracted.content[0].Inventory.version}</div>
                <div><b>Scan date:</b> {props.result.extracted.content[0].Inventory.scan_date}</div>
                <div><b>Username:</b> {props.result.extracted.content[0].Inventory.username}</div>
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

const CustomSearchHeaderContent = props => {
    if (props.result.extracted) {
        return <div>
            <p>{props.result.extracted.content[0].Inventory.full_product}</p>
        </div>
    }
    var uri = decodeURI(props.result.uri);
    return <div>
        <p>{uri.slice(uri.lastIndexOf('/') + 1)}</p>
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