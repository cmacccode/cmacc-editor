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

  describe('variable', function () {

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
        assert.equal(value, '$ world = Test\n\n# hello {{world}}')
      });
    });
  });


});