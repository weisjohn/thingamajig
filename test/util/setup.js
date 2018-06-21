// setup test environment
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiHttp = require('chai-http');

// Attach expect / sinon to global space
global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;

// Use sinonChai
chai.use(sinonChai);
chai.use(chaiHttp);
