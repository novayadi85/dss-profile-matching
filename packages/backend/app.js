require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { postgraphile } = require("postgraphile");
const { express: voyagerMiddleware } = require('graphql-voyager/middleware');
const { graphqlUploadExpress } = require("graphql-upload"); //graphql-upload@^10.0.0
const PostGraphileUploadFieldPlugin = require("postgraphile-plugin-upload-field");
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const multer = require('multer');
const os = require('os')
const path = require('path')
const fs = require('fs')
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


const UPLOAD_DIR_NAME = 'uploads';

// Serve uploads as static resources
app.use(`/${UPLOAD_DIR_NAME}`, express.static(path.resolve(UPLOAD_DIR_NAME)));

// Attach multipart request handling middleware
app.use(graphqlUploadExpress());

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
    appendPlugins: [PostGraphileUploadFieldPlugin, ConnectionFilterPlugin],
    graphileBuildOptions: {
      // connectionFilterAllowedFieldTypes: ["String", "Int"],
      uploadFieldDefinitions: [
        {
          match: ({ schema, table, column, tags }) =>
            column === "photo",
          resolve: resolveUpload
        }
      ],
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
        "includesInsensitive",
        "includes",
        "notIncludes",
        "like",
        "likeInsensitive",
        "contains",
        
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
    pgDefaultRole: process.env.POSTGRAPHILE_DEFAULT_ROLE,
  }))

const graphqlPath = '/graphql';
app.use(function (err, req, res, next) {
  res.send('Error! ', err.message, ' ', (req.app.get('env') === 'development' ? err : {}));
});

async function resolveUpload(upload) {
  const { filename, createReadStream } = upload;
  const stream = createReadStream();
  // Save file to the local filesystem
  const { filepath } = await saveLocal({ stream, filename });
  // Return metadata to save it to Postgres
  return filepath;
}

function saveLocal({ stream, filename }) {
  const timestamp = new Date().toISOString().replace(/\D/g, "");
  const id = `${timestamp}_${filename}`;
  const filepath = path.join(UPLOAD_DIR_NAME, id);
  const fsPath = path.join(process.cwd(), filepath);
  return new Promise((resolve, reject) =>
    stream
      .on("error", error => {
        if (stream.truncated)
          // Delete the truncated file
          fs.unlinkSync(fsPath);
        reject(error);
      })
      .on("end", () => resolve({ id, filepath }))
      .pipe(fs.createWriteStream(fsPath))
  );
}

app.use('/voyager', voyagerMiddleware({ endpointUrl: `${graphqlPath}` }));
app.listen(process.env.PORT);