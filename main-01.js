// 引入 vdom
import { reactive, watchEffect } from "./reactivity/index.js";
import { h } from "./vdom/index.js";

// 更新我们的视图

// <div>title</div>

const App = {
  render(context) {
    // return h(
    //   "div",
    //   {
    //     class: "red",
    //     id: "first",
    //   },
    //   context.state.title
    // );

    return h("div", null, [
      h("p", null, context.state.count),
      h(
        "button",
        {
          onClick: context.state.handleClick,
        },
        "click"
      ),
    ]);
    // return h("div", { class: "red" }, [
    //   h("p", null, "this is a p tag"),
    //   h("p", null, "this is a second p"),
    // ]);
  },

  setup() {
    const state = reactive({
      title: "heihei",
      count: 0,
      handleClick() {
        state.count++;
      },
    });

    return {
      state,
    };
  },
};

function mount(component, container) {
  let context = component.setup();
  component.isMounted = false;

  watchEffect(() => {
    // 优化
    // 对比两棵树
    // 之前的，和之前后的
    if (!component.isMounted) {
      // init
      component.isMounted = true;
      const subTree = component.render(context);
      component.subTree = subTree;
      patch(subTree, container);
    } else {
      // update
      const prevTree = component.subTree;
      const subTree = component.render(context);

      // todo 实现 diff 算法
      console.log(prevTree, subTree);
    }
  });
}

function patch(vdom, container) {
  // 初始化 subTree
  // element
  // 创建节点
  const el = document.createElement(vdom.tag);

  // 设置 props -》 暂时没有
  if (vdom.props) {
    // 对象
    Object.keys(vdom.props).forEach((key) => {
      const val = vdom.props[key];
      if (key.startsWith("on")) {
        //事件
        const eventName = key.slice(2).toLocaleLowerCase();
        el.addEventListener(eventName, val);
      } else {
        el.setAttribute(key, val);
      }
    });
  }

  // 设置 children
  // string
  if (Array.isArray(vdom.children)) {
    // 数组形式
    vdom.children.forEach((child) => {
      patch(child, el);
    });
  } else {
    el.textContent = vdom.children;
  }

  // 添加到容器内
  container.append(el);
}

mount(App, document.querySelector("#app"));
