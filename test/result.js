const url = require('url');
const path = require('path');
const assert = require('assert');

const CmaccEditor = require('../src/index.js');

describe('result', function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  const opts = {
    base: __dirname
  };

  describe('variable exist', function () {

    const ref = 'file://' + path.join(__dirname, '../data', 'Index.cmacc');

    const editor = new CmaccEditor(ref);

    it('mutation', () => {
      editor.addMutation('world', 'Test')
      return editor.getValue('world').then((value) => {
        assert.equal(value, 'Test')
      });
    });

    it('result', () => {
      return editor.getResult().then((value) => {
        assert.equal(value, '$ world = \'Test\'\n\n# hello {{world}}')
      });
    });
  });

  describe('variable new', function () {

    const ref = 'file://' + path.join(__dirname, '../data', 'Index.cmacc');

    const editor = new CmaccEditor(ref);

    it('mutation', () => {
      editor.addMutation('world2', 'Test')
      return editor.getValue('world2').then((value) => {
        assert.equal(value, 'Test')
      });
    });

    it('result', () => {
      return editor.getResult().then((value) => {
        assert.equal(value, '$ world2 = \'Test\'\n\n$ world = \'World\'\n\n# hello {{world}}')
      });
    });
  });


});