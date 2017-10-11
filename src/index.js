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
        if(!multipleLines(mutation.value)){
          sub[last] = mutation.value
        }else{
          return cmacc.compile(mutation.value, this.opts)
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

  getValue(path) {

    const mutations = this.mutations.filter((x) => {
      return x.path == path
    });

    if(mutations.length > 0){
      const res = mutations[mutations.length - 1]
      return Promise.resolve(res.value)
    }

    return cmacc.compile(this.ref, this.opts).then((ast) => {
      const split = path.split('.');
      const res = split.reduce((a, b) => a[b], ast);

      if(typeof res === 'object') {
        return res['$data']
      }

      if(typeof res === 'string') {
        return res
      }

    })
  }

}

function multipleLines(value){
  return (/\r|\n/.exec(value))
}


module.exports = editor;