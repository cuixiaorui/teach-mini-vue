// let a = 10;
// let b = a * 10;

// 1. a 变化之后 b 也需要更新

// a = 20;
// b = a * 10;

// console.log(b);

// 2. 封装 b 的更新规则
// let a = 10;
// let b;
// const update = () => {
//   b = a * 10;
// };

// update();

// a = 20;
// update();
// console.log(b)

// 3. 隐藏 update
// let update;
// let state;
// const setChangeState = (_update) => {
//   update = _update;
// };

// const setState = (newState) => {
//   state = newState;
//   update();
// };

// let b;
// setStateChanged(() => {
//   b = state.a * 10;
//   console.log(b);
// });

// // 调用代码
// setState({ a: 20 });

// 4. 上面的代码进行封装一下

let currentEffect;

class Dep {
  constructor() {
    this.effects = new Set();
  }

  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect);
    }
  }

  notice() {
    this.effects.forEach((effect) => {
      effect();
    });
  }
}

// watchEffect
const watchEffect = (effect) => {
  currentEffect = effect;
  effect();
  currentEffect = null;
};

const dep = new Dep();

let state = {
  a: 10,
};

let b;

watchEffect(() => {
  b = state.a * 10;
  console.log(b);
  dep.depend();
});

state.a = 20;
dep.notice();
