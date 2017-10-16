const url = require('url');
const path = require('path');
const assert = require('assert');

const Cmacc = require('cmacc-compiler');
const CmaccEditor = require('../src/index.js');

describe('mutations', function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  const opts = {
    base: __dirname
  };

  describe('cmacc', function () {

    const ref = 'file://' + path.join(__dirname, '../data', 'Link.cmacc');

    console.log(ref)

    const editor = new CmaccEditor(ref);

    it('ast', () => {
      return editor.ast.then((ast) => {
        assert.equal(ast.helloworld.world, 'World')
      });
    });

    it('add mutation', () => {
      const mutation = `$ world = 'World'\n\n# hello {{world}} 123`;
      editor.addMutation('helloworld', mutation)
      return editor.ast.then(ast => {
        assert.equal(ast.helloworld.world, 'World')
        return Cmacc.render(ast);
      }).then(md => {
        const html = Cmacc.remarkable.render(md);
        assert.equal(html, '<h1>hello World 123</h1>\n')
      });
    });

    it('remove mutation', () => {
      editor.resetMutation('helloworld')
      return editor.ast.then((ast) => {
        assert.deepEqual(editor.mutations, [])
        assert.equal(ast.helloworld.world, 'World')
        return Cmacc.render(ast);
      }).then(md => {
        const html = Cmacc.remarkable.render(md);
        assert.equal(html, '<h1>hello World</h1>\n')
      });
    });

  });

  describe('variable', function () {

    const ref = 'file://' + path.join(__dirname, '../data', 'Index.cmacc');

    console.log(ref)

    const editor = new CmaccEditor(ref);

    it('ast', () => {
      return editor.ast.then((ast) => {
        assert.equal(ast.world, 'World')
      });
    });

    it('add mutation', () => {
      editor.addMutation('world', 'Test')
        .then(() => {
          return editor.ast
        })
        .then((ast) => {
          assert.equal(ast.world, 'Test')
        });
    });

    it('remove mutation', () => {
      editor.resetMutation('world')
        .then(() => {
          return editor.ast
        }).then((ast) => {
        assert.equal(ast.world, 'World')
      });
    });

  });

});