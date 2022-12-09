const registerCypressGrep = require('cypress-grep')
registerCypressGrep()

// if you want to use the "import" keyword
import registerCypressGrep from 'cypress-grep'
registerCypressGrep()


Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
