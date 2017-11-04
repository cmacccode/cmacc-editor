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
      editor.addMutation('world', 'Test').then(() => {
        return editor.getValue('world')
      }).then((value) => {
        assert.equal(value, 'Test')
      });
    });

    it('result', () => {
      return editor.getResult().then((res) => {
        assert.equal(res[0].content, '$ world = \'Test\'\n\n# hello {{world}}')
      });
    });
  });

  describe('variable new', function () {

    const ref = 'file://' + path.join(__dirname, '../data', 'Index.cmacc');

    const editor = new CmaccEditor(ref);

    it('mutation', () => {
      return editor.addMutation('world2', 'Test').then(() => {
        return editor.getValue('world2')
      }).then((value) => {
        assert.equal(value.content, 'Test')
        return;
      });
    });

    it('result', () => {
      return editor.getResult()
        .then((res) => {
          assert.equal(res[0].content, '$ world = \'World\'\n\n$ world2 = \'Test\'\n\n# hello {{world}}')
        });
    });
  });

  describe('long text', function () {

    const ref = 'file://' + path.join(__dirname, '../data', 'Long.cmacc');

    const editor = new CmaccEditor(ref);

    it('mutation', () => {
      return editor.addMutation('doc_Title.123', '123').then(() => {
        return editor.getValue('doc_Title.123')
      }).then((value) => {
        assert.equal(value.content, '123')
        return;
      });
    });

    it('result', () => {
      return editor.getResult()
        .then((res) => {
          assert.equal(res[0].content, `// This is the part of the process where we start shaping the prose object into something closer to the deal. In this example a Mutual NDA

// Parameters
// -----------

$ doc_Title = "Mutual NDA"

$ notice_Period_TimeSpan = "thirty (30) days"

// Document sections

$ intro = {}
$ intro.doc_Title = doc_Title

$ conf_Xnum = "1"

$ confid = {}
$ doc_Title.123 = '123'

$ confid.xnum = conf_Xnum`)
        });
    });
  });


});