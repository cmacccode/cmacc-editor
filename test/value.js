const url = require('url');
const path = require('path');
const assert = require('assert');

const CmaccEditor = require('../src/index.js');

describe('value', function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  const opts = {
    base: __dirname
  };

  describe('variable', function () {

    const ref = 'file://' + path.join(__dirname, '../data', 'Index.cmacc');

    const editor = new CmaccEditor(ref);

    it('ast', () => {
      return editor.getValue('world').then((value) => {
        assert.equal(value, 'World')
      });
    });
  });

  describe('variable mutation', function () {

    const ref = 'file://' + path.join(__dirname, '../data', 'Index.cmacc');

    const editor = new CmaccEditor(ref);

    it('add mutation', () => {
      editor.addMutation('world', 'Test')
      return editor.ast.then((ast) => {
        assert.equal(ast.world, 'Test')
      });
    });

    it('ast', () => {
      return editor.getValue('world').then((value) => {
        assert.equal(value, 'Test')
      });
    });
  });


  describe('cmacc', function () {

    const ref = 'file://' + path.join(__dirname, '../data', 'Link.cmacc');

    const editor = new CmaccEditor(ref);

    it('ast', () => {
      return editor.getValue('helloworld').then((value) => {
        assert.equal(value, '$ world = \'World\'\n\n# hello {{world}}')
      });
    });
  });

  describe('cmacc mutation', function () {

    const ref = 'file://' + path.join(__dirname, '../data', 'Link.cmacc');

    const editor = new CmaccEditor(ref);

    it('add mutation', () => {
      editor.addMutation('helloworld', '$ world = \'World\'\n\n# hello {{world}}')
      return editor.ast
    });

    it('check mutation', () => {
      return editor.getValue('helloworld').then((value) => {
        assert.equal(value, '$ world = \'World\'\n\n# hello {{world}}')
      });
    });
  });
});