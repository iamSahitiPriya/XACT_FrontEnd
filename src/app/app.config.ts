
import { environment } from './../environments/environment';
export default {
  oidc: {
    clientId: environment.CLIENT_ID,
    issuer: environment.ISSUER,
    redirectUri: 'http://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email'],
    testing: {
      disableHttpsCheck: environment.OKTA_TESTING_DISABLEHTTPSCHECK
    }
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8000/api/messages',
  },
};
