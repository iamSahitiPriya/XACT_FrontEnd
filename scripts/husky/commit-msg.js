/* eslint-disable @typescript-eslint/no-var-requires */
const read = require('@commitlint/read');

const regex = /^\[#OPPR-(\w+-)*\d+\] ((\w+(, \w+)*)|(\w+)) \| .+$/g;
const messageFormat =
  '[#Jira story number] Person 1, Person 2..., Person n | Commit message' +
  '\n\nor\n\n' +
  '[#Jira story number] Person 1 | Commit message';

const messageFormatExample =
  '[#OPPR-123] Name1, Name2 | Commit Message' +
  '\n\nor\n\n' +
  '[#OPPR-123] Name1 | Commit Message';

const invalidFormatMessage =
  '***********************************************\n\n' +
  `${'Invalid commit message format\n\n' +
    'Valid Commit Message Format:\n'}${messageFormat}\n\n` +
  `Example:\n${messageFormatExample}\n\n` +
  'TIP: Use [#OPPR-0] if Jira story is not present' +
  '\n\n***********************************************';

read({ edit: true })
  .then(messages => {
    /* eslint-disable no-console */
    console.log(messages);
    const title = messages[0].split('\n')[0];
    if (!regex.test(title)) {
      throw invalidFormatMessage;
    }
  })
  .catch(err => {
    setTimeout(() => {
      const fgGreen = '\x1b[32m';
      throw new Error(console.log(fgGreen, err));
    });
  });
