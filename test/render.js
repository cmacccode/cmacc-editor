const url = require('url');
const path = require('path');
const assert = require('assert');

const CmaccEditor = require('../src/index.js');

describe('render', function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  const opts = {
    base: __dirname
  };

  describe('render', function () {

    const ref = 'file://' + path.join(__dirname, '../data', 'Index.cmacc');

    const editor = new CmaccEditor(ref);

    it('ast', () => {
      return editor.render().then((html) => {
        assert.equal(html, '<h1>hello World</h1>\n')
      });
    });
  });


  describe('mutation', function () {

    const ref = 'file://' + path.join(__dirname, '../data', 'Index.cmacc');

    const editor = new CmaccEditor(ref);

    editor.addMutation('world', 'Test');

    it('ast', () => {
      return editor.render().then((html) => {
        assert.equal(html, '<h1>hello Test</h1>\n')
      });
    });
  });


});