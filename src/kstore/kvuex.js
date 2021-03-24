let Vue

class Store {
  // 1. 选项处理
  constructor(options) {
    this._mutations = options.mutations;
    this._actions = options.actions;
    this._getters = options.getters

    // 2. 将state变成响应式数据
    this._vm = new Vue({
      data: {
        $$state: options.state
      },
      computed: {
        getters: function() {
          let getterProxy = Object.create(null)
          Object.keys(options.getters).forEach(type => {
            const currenGetter = options.getters[type]
            Object.defineProperty(getterProxy, type, {
              get: () => currenGetter(options.state)
            })
          })
          return getterProxy
        }
      }
    })

    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
    this.getters = this._vm.getters
  }

  get state() {
    console.log(this._vm);
    return this._vm._data.$$state
  }

  set state(v) {
    console.error('please use replaceState to reset state');
  }

  commit(type, payload) {
    const entry = this._mutations[type];
    if (!entry) {
      console.error('unkwnow mutation type');
      return
    }
    entry(this.state, payload)
  }

  dispatch(type, payload) {
    const entry = this._actions[type];
    if (!entry) {
      console.log('unkwnow action type');
      return;
    }
    entry(this, payload);
  }
}

function install(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default {Store, install};