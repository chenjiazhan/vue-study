let Vue;

class VueRouter {
  constructor(options) {
    // 1.处理选项
    this.$options = options;

    // 2.需要响应式的路由链接
    this.current = window.location.hash.slice(1) || '/';
    // 将 matched 变为响应式数据
    Vue.util.defineReactive(this, 'matched', []);
    // match方法可以递归遍历路由表，获得匹配关系数组
    this.match();
    // 监听路由变化，重新获取匹配关系数组
    window.addEventListener("hashchange", this.onHashChange.bind(this));
  }

  onHashChange() {
    this.current = window.location.hash.slice(1);
    this.matched = [];
    this.match();
  }

  match(routes) {
    routes = routes || this.$options.routes;
    // 递归遍历
    for (const route of routes) {
      if (route.path === '/' && this.current === '/') {
        this.matched.push(route);
        return;
      }
      if (route.path !== '/' && this.current.indexOf(route.path) != -1) {
        this.matched.push(route);
        if (route.children) {
          this.match(route.children);
          return;
        }
      }
    }
  }
}

// 插件要求实现install(Vue)
VueRouter.install = function(_Vue) {
  Vue = _Vue;
  // 任务1：挂载$router
  // 利用全局混入延迟调用后续代码
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        // 此时的上下文this是当前组件实例
        Vue.prototype.$router = this.$options.router;
      }
    },
  });

  // 任务2：注册两个全局组件
  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    render(h) {
      return h("a", { attrs: { href: "#" + this.to } }, this.$slots.default);
    },
  });

  Vue.component("router-view", {
    render(h) {
      // 标记当前router-view深度
      this.$vnode.data.routerView = true;
      let depth = 0;
      let parent = this.$parent;
      while (parent) {
        const vnodeData = parent.$vnode && parent.$vnode.data;
        if (vnodeData) {
          if (vnodeData.routerView) {
            // 说明当前depth是一个router-view
            depth++;
          }
        }
        parent = parent.$parent;
      }
      let component = null;
      const router = this.$router.matched[depth];
      if (router) {
        component = router.component;
      }
      return h(component);
    }
  })
};

export default VueRouter;
