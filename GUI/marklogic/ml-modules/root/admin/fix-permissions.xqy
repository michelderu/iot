xquery version "1.0-ml";

import module namespace c = "http://marklogic.com/roxy/application-config" at "/config/config.xqy";

declare default function namespace "http://www.w3.org/2005/xpath-functions"; (::)

declare option xdmp:mapping "false";

let $new-permissions := (
  xdmp:permission($c:app-name || "-role", "read"),
  xdmp:permission($c:app-name || "-role", "update"),
  xdmp:permission($c:app-name || "-role", "execute")
)

let $uris :=
  if (contains(xdmp:database-name(xdmp:database()), "content")) then

    (: This is to make sure all alert files are accessible :)
    cts:uri-match("*alert*")

  else

    (: This is to make sure all triggers, schemas, modules and REST extensions are accessible :)
    cts:uris()

let $fixes :=
  for $uri in $uris
  let $existing-permissions := xdmp:document-get-permissions($uri)

  (: Only apply new permissions if really necessary (gives better logging too):)
  where not(ends-with($uri, "/"))
    and (
      count($existing-permissions) ne count($new-permissions)
      or
      count($existing-permissions[string(.) = $new-permissions/string(.)]) ne count($new-permissions)
    )

  return (
    "  " || $uri,
    xdmp:document-set-permissions($uri, $new-permissions)
  )
return
  if ($fixes) then
    string-join($fixes, "&#10;")
  else
    "  no changes needed.."
