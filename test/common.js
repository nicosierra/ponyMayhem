const chai = require('chai');
const chaiSorted = require('chai-sorted');
const chaiAsPromised = require('chai-as-promised');
const Sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiSorted);
chai.use(chaiAsPromised);

module.exports = { chai, sinon: Sinon };
