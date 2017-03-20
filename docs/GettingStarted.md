# Documentation
#### 360Player JS SDK


## Getting started

All you need to do is `import` and initialize the class `ThreeSixtyInterface`.
If you're using imports you can of course name the class to whatever you feel apropriate since it is a default export.

```javascript
import { API_V1 } from '../src/constants'
import ThreeSixtyInterface from `threesixty-js-sdk`

const clientApiKey = 'your-client-api-key';
const api = new ThreeSixtyInterface(API_V1, clientApiKey);
```


## Authentication

Almost every request requires authentication to be made, authentication token is automatically added to each consecutive request after authentication has been made and validated.

There are two ways to authenticate each instance. Most commonly through credentials, _or_ with a valid [JWT](http://jwt.io/) token.

### With credentials

```javascript
api.connect('user@email.com', 'p******d');
```

### With token

```javascript
api.useToken('valid.jwt.token');
```


## Making requests

All requests to the API are called with `api.request`.

### `api.request` parameters

| Parameter                  | Description                               |
|----------------------------|-------------------------------------------|
| endpointUrl `string`       | Endpoint to request, i.e `/users/1`       |
| requestMethod `string`     | Request method to use, defaults to `GET`  |
| payload `object`           | _Optional_ request payload, sent as JSON. |
| additionalHeaders `object` | _Optional_ additional request headers.    |