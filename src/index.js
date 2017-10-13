const cmacc = require('cmacc-compiler');

class editor {

  constructor(ref, opts) {
    this.ref = ref;
    this.opts = opts || {};
    this.mutations = [];
  }

  get ast() {
    return cmacc.compile(this.ref, this.opts).then((ast) => {
      const res = this.mutations.map((mutation) => {
        const split = mutation.path.split('.');
        const last = split.pop();
        const sub = split.reduce((a, b) => a[b], ast);
        if (!multipleLines(mutation.value)) {
          sub[last] = mutation.value
        } else {
          const opts = {
            loaders: this.opts.loaders,
            base : sub[last]['$file'],
          }
          return cmacc.compile(mutation.value, opts)
            .then((value) => {
              sub[last]['$md'] = value['$md']
            })

        }
      });
      return Promise.all(res)
        .then(() => {
          return ast
        })
    });
  }

  addMutation(path, value) {
    this.mutations.push({path, value});
  }

  resetMutation(path) {
    this.mutations = this.mutations.filter((x) => {
      return x.path !== path
    });
  }

  getNode(path) {
    return cmacc.compile(this.ref, this.opts).then((ast) => {
      const split = path.split('.');
      const res = split.reduce((a, b) => a[b], ast);
      return res;
    });
  }

  getResult() {
    return this.getValue().then((ast) => {
      let data = ast['$data'];
      return this.mutations.reduce((acc, mutation) => {
        const regex = new RegExp(`\\$ ${mutation.path} = .*`)
        if(acc.match(regex)){
          return acc.replace(regex, `$ ${mutation.path} = '${mutation.value}'`)
        }else{
          return `$ ${mutation.path} = '${mutation.value}'\n\n` + acc
        }
      },data);
    });
  }

  getValue(path) {

    if(!path)
      return cmacc.compile(this.ref, this.opts);

    const mutations = this.mutations.filter((x) => {
      return x.path == path
    });

    if (mutations.length > 0) {
      const res = mutations[mutations.length - 1]
      return Promise.resolve(res.value)
    }

    return cmacc.compile(this.ref, this.opts).then((ast) => {
      const split = path.split('.');
      const res = split.reduce((a, b) => a[b], ast);

      if (typeof res === 'object') {
        return res['$data']
      }

      if (typeof res === 'string') {
        return res
      }

    })
  }

  render(debug) {
    return this.ast.then(ast => {
      return cmacc.render(ast)
    }).then(res => {
      return cmacc.remarkable.render(res, debug)
    })
  }

}

function multipleLines(value) {
  return (/\r|\n/.exec(value))
}


module.exports = editor;