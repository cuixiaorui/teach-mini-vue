let activeEffect;

class Dep {
  constructor() {
    this.subscribers = new Set();
  }

  depend() {
    if (currentEffect) {
      this.subscribers.add(currentEffect);
    }
  }

  notice() {
    this.subscribers.forEach((effect) => {
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

// weak -> key -> 对象
const targetMap = new WeakMap();

const getDep = (target, key) => {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  // 以 key 去取 dep
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }

  return dep;
};

const reactive = (raw) => {
  return new Proxy(raw, {
    get(target, key, receiver) {
      const dep = getDep(target, key);
      dep.depend();
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      // dep.notice()
      const dep = getDep(target, key);
      const result = Reflect.set(target, key, value, receiver);
      dep.notice();
      return result;
    },
  });
};

let state = reactive({
  count: 0,
});

watchEffect(() => {
  console.log(state.count);
});

state.count++;
