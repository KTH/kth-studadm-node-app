# Studadm Node App

This repository acts as a common-library made for StudAdm at KTH. 

It is based upon kth-node-web and uses existing kth libraries where possible.

It might very well be useful to other
teams.

## Usage of this library

### Controller-support

The controller support library lets you write your controller logic in more of an input/output fashion rather
than using the request/response objects provided by express. A controller is an object implementing the Controller<IN>
interface

```typescript
export class ControllerResponse {
}

export interface Controller<IN> {
  handle (input: IN): Promise<ControllerResponse>
}
```

There are varous forms of ControllerResponse, for example the JsonResponse. This response type contains an object
and indicates to the adapter that the response should be written as json. Thus if the controller returns
such an object a json response will be written to the client.

## Design considerations

### Typescript

The reasons for picking Typescript over using plain Javascript are in short

* It is enforced documentation. Properly named types and properties can often be the only
  documentation needed.
* It makes refactoring possible. It is important to evolve the code base, and we want to be able to refactor the code
  with confidence.
* Faster coding. Many typical runtime errors are mitigated by the compile time type checking, and the code editor
  can provide better code completion.

There are some disadvantages for Typescript as well:

* It is a new language to most developers. Learning the syntax and the typesystem will take some time. 
* The external typings (i.e. node modules under @types/*) for a library might diverge from the actual code, and we end up with either runtime errors or 
  compile time errors. A possible solution to this problem can be to fixing the library and typing versions in package.json
  to a point where they are in sync.
* The provided typings for a library (e.g. inferno) can be broken or diverge from the actual code. Again fixing the version
  in package.json might help in these cases.
  
### Dependency injection

The dependencies of a class or a function can be considered one of:

* Dynamic dependencies. These dependencies can be for example a connection string for a database, or they might have
  different implementations (production/test, server/browser).
* Static dependencies. Pure functions and classes from the project code and third part libraries that need not be configured
  or exchanged depending on the environment.
  
Dynamic dependencies should always be explicitly provided by dependency injection. Using import/require statements
together wit form of global state for configuration makes the application more fragile and hard to reason about.

Static dependencies should be imported with import statements.

Small applications should be fine doing dependency injection without any IOC container or DI framework. Normally
all dependencies can be wired in the start script of the application. 


### Configuration

All configuration is done by setting environment variables, which makes it easy to run the app in Docker containers. 
The start script of the application (usually src/server/app.ts) should retrieve these values and provide them to the 
different parts of the application.

### UI

Since we've adopted Inferno for client side rendering it makes sense to use it for server side rendering as well.
This framework/library provides some inital page-templates to use for server side rendering.

## License

The MIT License (MIT)

Copyright (c) 2018 KTH Royal Institute of Technology

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.