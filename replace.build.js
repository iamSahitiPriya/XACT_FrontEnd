var replace = require('replace-in-file');
var environmentVar = process.argv[2];
var clientID = process.argv[3];
var issuer = process.argv[4];

const options1 = {
  files: 'src/environments/environment.'+environmentVar+'.ts',
  from: /{CLIENT_ID}/g,
  to: clientID,
  allowEmptyPaths: false,
};

const options2 = {
  files: 'src/environments/environment.'+environmentVar+'.ts',
  from: /{ISSUER}/g,
  to: issuer,
  allowEmptyPaths: false,
};

try {
  let changedFiles = replace.sync(options1).replace.sync(options2);
  console.log('Client ID & Issuer is set'+clientID+" - "+issuer);
}
catch (error) {
  console.error('Error occurred:', error);
}
