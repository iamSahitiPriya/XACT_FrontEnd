import { environment } from './../environments/environment';
export default {
  oidc: {
    clientId: environment.CLIENT_ID,
    issuer: environment.ISSUER,
    redirectUri: environment.REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
    testing: {
      disableHttpsCheck: environment.OKTA_TESTING_DISABLEHTTPSCHECK
    }
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8000/api/messages',
  },
};
