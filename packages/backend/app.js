require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { postgraphile } = require("postgraphile");
const { express: voyagerMiddleware } = require('graphql-voyager/middleware');
const app = express()

const postgresConfig = {
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const options = {
  origin: process.env.ORIGIN,
};

app.use(cors(options));

// Enable pre-flight requests for all routes
app.options('*', cors(options));

app.use(postgraphile(
  postgresConfig,
  process.env.POSTGRAPHILE_SCHEMA, {
    graphiql: true,
    watchPg: true,
    watchPg: true,
      ignoreRBAC: false, // Reflect the GRANTs in the generated GraphQL schema
      retryOnInitFail: true,
      dynamicJson: true,
      graphiql: true,
      classicIds: false,
      nodeIdFieldName: '_nodeId',
      enhanceGraphiql: true,
      showErrorStack: true,
      disableDefaultMutations: false,
      extendedErrors: ["errcode"],
      legacyRelations: "omit",
      graphileBuildOptions: {
        // connectionFilterAllowedFieldTypes: ["String", "Int"],
        connectionFilterAllowedOperators: [
          "isNull",
          "equalTo",
          "notEqualTo",
          "distinctFrom",
          "notDistinctFrom",
          "lessThan",
          "lessThanOrEqualTo",
          "greaterThan",
          "greaterThanOrEqualTo",
          "in",
          "notIn",
          "startsWith",
          "includesInsensitive"
        ],
      },
      extendedErrors: [
        "severity",
        "code",
        "detail",
        "hint",
        "position",
        "internalPosition",
        "internalQuery",
        "where",
        "schema",
        "table",
        "column",
        "dataType",
        "constraint",
        "file",
        "line",
        "routine"
      ],
    jwtPgTypeIdentifier: `${process.env.POSTGRAPHILE_SCHEMA}.jwt`,
    jwtSecret: process.env.JWT_SECRET,
    pgDefaultRole: process.env.POSTGRAPHILE_DEFAULT_ROLE
  }))

const graphqlPath = '/graphql';
app.use(function (err, req, res, next) {
  res.send('Error! ', err.message, ' ', (req.app.get('env') === 'development' ? err : {}));
});

app.use('/voyager', voyagerMiddleware({ endpointUrl: `${graphqlPath}` }));
app.listen(process.env.PORT);