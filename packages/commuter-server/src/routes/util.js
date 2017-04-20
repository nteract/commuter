// @flow
exports.isDir = (path: string) => !path || (path && path.endsWith("/"));
