# NOTE:

This code includes samples of both client and server side code.

### Client side:

The client side samples display react and redux technology that demonstrate reacts component based architecture as well as redux's global state management system.

1. React Component samples - These files demonstrate the reusable asset architecture of React as well as its redux store integration through an action/reducer system. Please note each component is designed to perform a specific set of tasks, thus reducing the amount of redundant code upon re-rendering the application. There are also life cycle events to hydrate each component with the proper data based on a specific life cycle of the component itself.

2. Redux store samples - These files show the flow of global redux state initiated from an action creator then resulting in a copied/modified piece of state. The state will modify the components in which they are bound to through the entire react application.


### Server side:

The server side samples include both third party integrations and server side route handlers that accept specific types of client HTTP requests.

1. The index.js file is the main server file connecting all third party integrations which include but are not limited to:

-MongoDB database
-Passport strategies for token based authentication
-Live web sockets for real time communications between various clients
-Route handling with Express to make specific types of clients requests. The server responds back through a system of callback functions and newer async/await Javascript technology.

2. There is a also a database schema file that is a scaffold for each document inserted into the database. It checks for errors assuring that the data entered/modified in the database is of the proper type.
