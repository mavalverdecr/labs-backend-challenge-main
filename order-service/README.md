# Order Service - Summary

## Architecture

- The project has been created using Onion Architecture and Dependency Injection. In order to separate the domain from the infrastructure and the application concerns.
- Inside the infrastructure folder, I have separated the http server from the queue consumer.
- Both are instantiated in the main file (index.ts) and receive the routes and consumers by dependency injection.
- Also the database is another implementation that is injected in the http server and the queue listener.
- Domain entities are in the models folder.
- Inside repositories folder are the implementations of the Order Repository and the Contact Repository. The first one has the responsibility to manage the data persistence and the second one to get the data from the external system (via http requests).
- Inside services folder are the implementations of the use cases. Each one has its own controller and its own DTOs.
- Shared folder is used to contain the cross-cutting concerns.

## Choices

- I have chosen Onion Architecture and Dependency Injection because it is a good practice to make the code more robust, easier to maintain and test. I think this combination it is very good for this kind of microserviceses. Ease the decoupling between the layers, make the code more modular and easier to test, also it is easier to change the technologies in case of need.
- I have created a simple server using `express` to handle the http requests and `kafkajs` to consume the messages from the queue service.
- `MongoDB` as database because is already being used in the stack and I am familiar with it.
- I opted for make a base class for http controller and router to avoid code duplication. Each router receive the controllers by dependency injection. I mind this allows to implements new routes with no changing the http server implementation and no adding new dependencies. As developer you only have to extends your controllers and your routers from the base classes and export the implementation of these lasts on its specific file (`./infrastructure/httpServer/routes.ts`).
- For the same reason I also made a base class for queue consumer. Their implementations have to be exported in its specific file (`./infrastructure/queueServer/consumers.ts`). _It may seem that these two points would be more of a future improvement than initial requirements, but I have no expense too much time in implementing them_.
- I decide to not suscribe to the topic `personevents-created` because it is not relevant to orders the creation of a new person.
- I quickly added a swagger to the project with the `swagger-ui-express` package, in order to see the endpoints specifications and the schemasin a more friendly way.
- I used `axios` to make the http requests to the contact service, because it is the library that I am more familiar with. In order to manage timeouts, I create the instance setting the timeout to 5 seconds. So if it is not responding before, it will throw an error.
- I used DTOs to transport the data between the controllers and the services. In order to avoid to have the domain entities polluted with data layer concerns.
- I used a simple error handler to manage the errors in the same way in all the project.

## Proposed improvements:

- Add tests. I would start by integration/e2e tests. Even the service is very simple, persistence it is his major responsibility. I consider it is a better way to make less tests and more robust. Once the persistence are covered, I would add unit tests for the more complex business logics.
- Add a response interceptor to the axios instance to manage cross-cutting errors. For example to avoid manage the timeout error in each request without having to repeat the code.

## Things that works and not:

The main functionality is working. It is mean that you can create new orders through the http server and changes in persons are reflected in the orders via the queue listener.
Also it is being managed the timeout error in the contact service requests.
I don't mind nothing related with the that not works.

## Security:

- Securize the http server with basic authentication and https.
- Securize the other infrastructure services, like the database, with user and password. Or https and basic authentication for the contact service.
- Manage the secrets outside the codebase.

## RUN THE PROJECT

### Prerequisites

```
Docker and Docker Compose
```

### Run the services

Execute the following command to run the services:

```bash
docker compose up -d
```

## TEST PLAN

### Create a new order

```bash
# TODO: Add an existing person id to the soldToID, billToID and shipToID fields.
curl -X POST http://localhost:8081/api/v1/order \
-H "Content-Type: application/json" \
-d '{
  "orderDate": "2024-11-30",
  "soldToID": "",
  "billToID": "",
  "shipToID": "",
  "orderValue": 50,
  "taxValue": 1.2,
  "currencyCode": "EUR",
  "items": [
    {
      "itemID": "1",
      "productID": "1",
      "quantity": 50,
      "itemPrice": 1
    }
  ]
}'
```

- Should return 201 Created.
- Should create the order in the database.

### Update a person

```bash
# TODO: Change ${personId} by the person id used in the order creation test.
curl -X PATCH http://localhost:8080/api/v1/person/${personId} \
-H "Content-Type: application/json" \
-d '{
  "firstName": "John",
  "lastName": "Doe"
}'
```

- Should return 200 OK.
- Should update the person in the database.
- Should receive a message in the queue `personevents-updated` and update the person information in the affected orders.

### Delete a person

```bash
# TODO: Change ${personId} by the person id used in the order creation test.
curl -X DELETE http://localhost:8080/api/v1/person/${personId}
```

- Should return 204 No Content.
- Should delete the person in the database.
- Should receive a message in the queue `personevents-deleted` and delete all the orders related to the person to preserve the integrity of the data.
