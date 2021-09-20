# Sandbox
Sandbox for Beckn APIs

## Introduction
The sandbox contains the following 4 mock servers :
MOCK BAP (A mock Beckn Application Platform server) (code in /bap/)
MOCK BG (A mock Beckn Gateway server) (code in /bg/)
MOCK BPP1 (1 of the 2 mock Beckn Provider Platform server) (code in /bpp/)
MOCK BPP2 (1 of the 2 mock Beckn Provider Platform server) (code in /bap/)

Apart from these servers there are 2 more componenets, a react frontend to view the details and an admin backend to change the settings of a mock server.


* Admin frontend app url : http://13.235.139.60:5555/login
* BG : http://13.235.139.60/sandbox/bg
* BAP : http://13.235.139.60/sandbox/bap
* BPP1 : http://13.235.139.60/sandbox/bpp1
* BPP2 : http://13.235.139.60/sandbox/bpp2

### Trigger Mock BAP
To trigger a search request from the mock BAP server we can use the *POST/trigger/search* endpoint with the following body :
```
{
   "domain": "domain_name",
   "use_case": "use_case_name",
   "ttl": wait time in milliseconds
}
```
**domain** is the domain in which the use case is from. Current supported values are local_retail and delivery.
**use_case** is the name of the use case that should be used for the triggered transaction.
**ttl** is the time in milliseconds that the MOCK BAP should wait for the before sending back the results received.  

This API call will return the responses received from the BPPs as a list.

Examples : 
```
{
   "domain": "local_retail",
   "use_case": "on_search/return_fulfillment_catalog_with_providers",
   "ttl":3000
}
```
The above call will trigger the on_search/return_fulfillment_catalog_with_providers use case from the local_retail domain and will wait for 3000 milliseconds before sending back the list of responses. 
```
{
   "domain": "delivery",
   "use_case": "search/search_by_item_availability_timings",
   "ttl":2000
}
```
The above call will trigger the search/search_by_item_availability_timings use case from the delivery domain and will wait for 2000 milliseconds before sending back the list of responses.

### Trigger BPP via BAP directly without going through BG

To trigger a BPP directly using the mock BAP, we can add a new parameter bpp_uri which will contain the url of the BPP to be triggered (without backslash at the end). This will trigger the BPP mentioned directly without the transaction being routed through the BG.
```
{
   "domain": "domain_name",
   "use_case": "use_case_name",
   "bpp_uri":"url_of_bpp",
   "ttl":3000
}
```
**bpp_uri** is the url of the BPP to send the request to. This should not have the backslash at the end.
This will return the results returned by the BPP.
Examples :
```
{
   "domain": "delivery",
   "use_case": "on_search/return_item_catalog",
   "bpp_uri":"http://13.235.139.60:6666",
   "ttl":3000
}
```
The above call will trigger the `on_search/return_item_catalog` use case from the delivery domain to the BPP at `http://13.235.139.60:6666` and will wait for `3000` milliseconds before sending back the list of responses.

### Directly send requests to BG or BPP without BAP

To directly send requests to the BG or BPP, the body should contain the request in json format as per the specifications which will contain the domain in context.domain. The request header should contain the use case id to be used for the call which the BPP will interpret to send the corresponding response back. The response will be sent to the endpoint specified in the bap_uri of the request. 

* If we need to trigger the call to the BG we can trigger it to the following endpoint :
   * `<bg_uri>/search`
* If we need to trigger the call directly to one of the mock BPPs we can trigger it to the endpoint :
   * `<bpp_uri>/search`

Example :
If the context part of the request contains the following data : 
```
{
   "context": {
     "domain": "delivery",
     "action": "search",
     "core_version": "string",
     "bap_id": "MOCK_BAP",
     "bap_uri": "http://13.235.139.60:4444",
     "bpp_id": "MOCK_BPP1",
     "bpp_uri": "http://13.235.139.60:6666",
     "transaction_id": "123871371289371983",
     "timestamp": "2021-03-23T10:00:40.065Z",
   }
```
*(Please note above context object is only for representation and has many fields removed)*

The request has the following header : 
```
Header name: use_case
Header value : on_search/return_item_catalog
```
The above call will trigger the `on_search/return_item_catalog` use case from the `delivery` domain to the BPP at `http://13.235.139.60:6666` and will send the response back to `http://13.235.139.60:4444` if called directly or to the BG (`http://13.235.139.60:5555`) if the BG is called and the BG will route the response back to `http://13.235.139.60:4444`.

The supported usecses are stored in the mock_json_files folder. More use case jsons may be added to the folder as required.
