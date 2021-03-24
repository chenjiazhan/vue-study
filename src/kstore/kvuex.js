let Vue

class Store {
  // 1. 选项处理
  constructor(options) {
    this._mutations = options.mutations;
    this._actions = options.actions;
    this._getters = options.getters

    // 第二种定义getter方法
    // const computed = {}
    // this.getters = {}
    // const store = this

    // // doubleCounter(state) {}
    // Object.keys(this._getters).forEach(key => {
    //   // 获取用户定义的getter
    //   const fn = store._getters[key]
    //   // 转换为computed可以使用的无参数形式
    //   computed[key] = function() {
    //     return fn(store.state)
    //   }
    //   // 为getters定义只读属性
    //   Object.defineProperty(store.getters, key, {
    //     get: () => store._vm[key]
    //   })
    // })

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
    // 如果使用第二种方法，就不需要在这里重新赋值
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