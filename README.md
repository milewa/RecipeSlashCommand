# Giphy Slash Command for Mixmax

This is an open source Mixmax Slash Command designed to link a url for a recipe using the Food2Fork database through their API. See <http://food2fork.com/about/api> for details on the Food2Fork API

See <http://developer.mixmax.com/docs/overview-slash-commands#tutorial-building-mygiphy> for more information about how a slash command works in MixMax.
Code was written based on typeahead.js and resolver.js from <https://github.com/mixmaxhq/giphy-example-slash-command>. server.js was also found from that repo. 

## Running locally

1. Install using `npm install`
2. Run using `npm start`

To simulate locally how Mixmax calls the typeahead URL (to return a JSON list of typeahead results), run:

```
curl https://localhost:9145/typeahead?text=cats --insecure
```

To simulate locally how Mixmax calls the resolver URL (to return HTML that goes into the email), run:

```
curl https://localhost:9145/resolver?text=cats --insecure
```

To add the slash command to your mixmax application as a slash command

Input|Value
-----|----
Name|MyRecipleSearch
Command|reciple
Parameter placeholder|\[Search\]
Typeahead API URL|https://localhost:9145/typeahead
Resolver API URL|https://localhost:9145/resolver

Then refresh and next time, add a cool reciple to your email!

## Why do we run it in https locally?

Mixmax slash command APIs are required to be served over https. This is because they are queried directly from the Mixmax client in the browser (using AJAX) that's running on an https domain. Browsers forbid AJAX requests from https domains to call http APIs, for security. So we must run an https server with a locally-signed certificate.

See [here](http://developer.mixmax.com/docs/integration-api-appendix#local-development-error-neterr_insecure_response) for how to fix the **ERR_INSECURE_RESPONSE** error that you might get in Chrome.
