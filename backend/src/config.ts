// The config object that gets passed around to instantiate the server
export type Config = {
  storageBackend: "s3" | "local";
  themis_url: string | null;
  port: string | number;
  nodeEnv: string;
  storage: {
    [key: string]: any;
  };
  s3storage: S3StorageConfig;
  clone_server_endpoint?: string;
};

export type S3StorageConfig = {
  s3: {
    params: {
      // required s3 bucket name
      Bucket: string;
    };
    // required key
    accessKeyId?: string;
    // required secret
    secretAccessKey?: string;
  };
  artifactPrefix: string;
  s3PathDelimiter: string;
};

function deprecate(env: NodeJS.ProcessEnv, oldVar: string, newVar: string) {
  if (env[oldVar]) {
    console.warn(`${oldVar} is deprecated, please use ${newVar}`);
  }
}

function populateLocalStorageOptions(env: NodeJS.ProcessEnv) {
  let baseDirectory = process.env.COMMUTER_LOCAL_STORAGE_BASEDIRECTORY;

  if (!baseDirectory) {
    baseDirectory = process.cwd();
    console.warn("Running in the current working directory, ", baseDirectory);
  }

  return {
    local: {
      baseDirectory
    }
  };
}

function populateS3Options(env: NodeJS.ProcessEnv): S3StorageConfig {
  deprecate(env, "COMMUTER_BASEPATH", "COMMUTER_S3_BASE_PREFIX");
  deprecate(env, "COMMUTER_PATH_DELIMITER", "COMMUTER_S3_PATH_DELIMITER");

  if (!env.COMMUTER_BUCKET) {
    throw "S3 Bucket Name Missing";
  }

  const s3PathDelimiter =
    env.COMMUTER_S3_PATH_DELIMITER || env.COMMUTER_PATH_DELIMITER || "/";

  const config: S3StorageConfig = {
    s3: {
      params: {
        // required s3 bucket name
        Bucket: env.COMMUTER_BUCKET
      },
      // required key
      accessKeyId: env.COMMUTER_S3_KEY,
      // required secret
      secretAccessKey: env.COMMUTER_S3_SECRET
    },
    artifactPrefix: env.COMMUTER_S3_ARTIFACT_PREFIX || "papermill",
    s3PathDelimiter
  };

  return config;
}

function instantiate(): Config {
  const storageBackend = (
    process.env.COMMUTER_STORAGE_BACKEND || "local"
  ).toLowerCase();

  if (storageBackend !== "local" && storageBackend !== "s3") {
    throw new Error(`Unknown storageBackend ${storageBackend}`);
  }

  const config: Config = {
    port: process.env.PORT || process.env.COMMUTER_PORT || 4000,
    nodeEnv: process.env.NODE_ENV || "test",
    themis_url: process.env.THEMIS_URL || null,
    storageBackend: storageBackend,
    storage: populateLocalStorageOptions(process.env),
    s3storage: populateS3Options(process.env),
    clone_server_endpoint: process.env.CLONE_ENDPOINT || "http://localhost:8888"
  };

  return config;
}

module.exports = instantiate();
