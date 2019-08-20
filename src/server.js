const cors = require("cors");
const express = require("express");
const graphQlHTTP = require("express-graphql");

const schema = require("./graphql/schema");

const app = express();

app.use(cors());
app.use(function(req, res, next) {
  setTimeout(next, 1000);
});
app.use(
  "/graphql",
  graphQlHTTP({
    graphiql: true,
    schema
  })
);

app.listen(4000);
