# thingamajig

A simple Node.js API for widgets, gadgets, and functions.

## development

`thingamajig` is an API for managing _widget_ and _gadget_ resources. This repo is simply a starting point for the server, complete with a set of tests. Your code should make these tests pass. Implement the following:

 - server to handle requests with a router
 - data store of some form for models
 - models for widgets, gadgets, and functions
 - controllers for API routes
 - functions which are missing

### run

```
$ npm start
```

### dev

```
$ npm run dev
```

### test

```
$ npm test
```

## doc

### widgets

Widgets serve as a primitive in this system, and are used as parts of gadgets. A widget is described by a list of optional _parts_.

A widget consists of the following:

```json
{
  "name": "<string>",
  "parts": ["<string>"]
}
```

### create widget

**POST** /api/widget

**args**

| field | type             | description          |
| ----- | ---------------- | -------------------- |
| name  | string           | a unique widget name |
| parts | array of strings | list of parts        |

**response**

| field   | type    | description       |
| ------- | ------- | ----------------- |
| success | boolean | success indicator |
| widget  | object  | widget details    |

**example**

```
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"name": "sprocket", "parts": ["spoke", "wheel"]}' \
  http://localhost:3000/api/widget
```

### gadgets

Gadgets are a collection of widgets and _functions_. A gadget's _parts_ are a sum of all the underlying widgets' parts and functions.

A gadget consists of the following:

```json
{
  "name": "<string>",
  "widgets": ["<string>"],
}
```

**POST** /api/gadget

**args**

| field     | type             | description          |
| --------- | ---------------- | -------------------- |
| name      | string           | a unique widget name |
| widgets   | array of strings | list of widget names |
| functions | array of strings | list of functions    |

**response**

| field   | type    | description       |
| ------- | ------- | ----------------- |
| success | boolean | success indicator |
| gadget  | object  | gadget details    |

**example**

```
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"name": "tailx", "widgets": ["sprocket"], "functions": ["sig", "hash"]}' \
  http://localhost:3000/api/gadget
```

### functions

Functions are predefined sets of functionality which can be applied to a gadget, provided that gadget references that name. These functions are implemented in `src/func`. Functions may not be submitted through the API, but may be invoked on a gadget.

A function execution record consists of the following:

```json
{
  "success": bool,
  "uuid": "<string>",
  "name": "<string>",
  "gadget": "<string>",
  "start": "<date>",
  "output": any,
}
```

**POST** /api/function

**args**

| field  | type   | description          |
| ------ | ------ | -------------------- |
| name   | string | a unique widget name |
| gadget | string | list of widget names |

**response**

| field   | type    | description                   |
| ------- | ------- | ----------------------------- |
| success | boolean | success indicator             |
| uuid    | string  | universally unique identifier |


```
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"name": "hash", "gadget": "tailx"}' \
  http://localhost:3000/api/function
```

**GET** /api/function/{uuid}

**args**

| field | type   | description                   |
| ----- | ------ | ----------------------------- |
| uuid  | string | universally unique identifier |

**response**

| field   | type    | description                          |
| ------- | ------- | ------------------------------------ |
| success | boolean | success indicator                    |
| uuid    | string  | universally unique identifier        |
| name    | string  | name of the function invoked         |
| gadget  | name    | name of the gadget argument          |
| start   | date    | an ISO-8601 date representation      |
| output  | any     | the result of the function execution |

**example**

```
curl -X GET http://localhost:3000/api/function/e786f9b7-8e78-46ee-9369-f10f4e1e11f0
```
