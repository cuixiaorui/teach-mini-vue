import { reactive, watchEffect } from "./reactivity/index.js";

console.log(reactive);
console.log(watchEffect);

// 更新我们的视图
function render(context) {
  watchEffect(() => {
    // reset
    document.querySelector("#app").innerHTML = ``;

    // title
    const div = document.createElement("div");
    div.innerHTML = context.state.title;

    // btn
    const btn = document.createElement("button");
    btn.innerHTML = "click";
    btn.onclick = context.state.handleClick;

    document.querySelector("#app").append(div);
    document.querySelector("#app").append(btn);
  });
}

function setup() {
  const state = reactive({
    title: "heihei",
    handleClick() {
      console.log("heihei");
      state.title = "hahah";
    },
  });

  return {
    state,
  };
}

function mount() {
  render(setup());
}

mount();
