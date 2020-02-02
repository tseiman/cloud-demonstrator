"use strict";
// based on https://github.com/oauthjs/express-oauth-server/blob/master/examples/memory/model.js

/**
 * Constructor.
 */
function InMemoryCache() {
  this.clients = [
      { 
        clientId : 'dummy-client-id',
        clientSecret : 'dummy-client-secret',
        redirectUris : [''],
        grants: ['client_credentials'],
      }];
  this.tokens = [];
  this.users = [{ id : '1', username: 'demosuser', password: 'Pa$$w0rd' }];
}

/**
 * Dump the cache.
 */
InMemoryCache.prototype.dump = function() {
  console.log('clients', this.clients);
  console.log('tokens', this.tokens);
  console.log('users', this.users);
};

/*
 * Get access token.
 */
InMemoryCache.prototype.getAccessToken = function(bearerToken) {
//  console.log('called getAccessToken, bearerToken=', bearerToken);
  console.log('called OAuth getAccessToken');
  var tokens = this.tokens.filter(function(token) {
    return token.accessToken === bearerToken;
  });

  return tokens.length ? tokens[0] : false;
};

/**
 * Get refresh token.
 */
InMemoryCache.prototype.getRefreshToken = function(bearerToken) {
//  console.log('called getRefreshToken, bearerToken=', bearerToken);
  console.log('called OAuth getRefreshToken');
  var tokens = this.tokens.filter(function(token) {
    return token.refreshToken === bearerToken;
  });

  return tokens.length ? tokens[0] : false;
};

/**
 * Get client.
 */
InMemoryCache.prototype.getClient = function(clientId, clientSecret) {
//  console.log(`called InMemoryCache.getClient - clientId=${clientId}, clientSecret=${clientSecret}`);
  console.log(`called OAuth InMemoryCache.getClient - clientId=${clientId}`);
  var clients = this.clients.filter(function(client) {
    return client.clientId === clientId &&
           client.clientSecret === clientSecret;
  });
  //console.log('found clients: ' + clients.length);
  return clients.length ? clients[0] : false;
};

/**
 * Save token.
 */
InMemoryCache.prototype.saveToken = function(token, client, user) {
 // console.log('called saveToken', arguments);
 console.log(`called OAuth saveToken client=${client.clientId}, user=${user.username}`);
  var newToken = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    clientId: client.clientId,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    userId: user.id,

    //these are required in /node_modules/express-oauth-server/node_modules/oauth2-server/lib/models/token-model.js
    client: client,
    user:user,
    scope: null, //where are we taking scope from? maybe client?
  };
  this.tokens.push(newToken);
  return newToken;
};

/*
 * Get user.
 */
InMemoryCache.prototype.getUser = function(username, password) {
  var users = this.users.filter(function(user) {
    return user.username === username && user.password === password;
  });

  return users.length ? users[0] : false;
};

InMemoryCache.prototype.getUserFromClient = function(){
//  console.log('called prototype.getUserFromClient', arguments);
  console.log('called OAuth prototype.getUserFromClient', arguments[0].clientId);
  //todo: find correct user.
  return this.users[0];
}

InMemoryCache.prototype.saveAuthorizationCode = function(){
    console.log('how is this implemented!?', arguments);
}

/**
 * Export constructor.
 */
module.exports = InMemoryCache;