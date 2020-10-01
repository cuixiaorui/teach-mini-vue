let activeEffect;

class Dep {
  constructor(value) {
    this._value = value;
    this.subscribers = new Set();
  }

  get value() {
    this.depend();
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.notice()
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

const dep = new Dep(10);

let b;

watchEffect(() => {
  b = dep.value * 10;
  console.log(b);
  // dep.depend();
});

dep.value = 20;
// dep.notice();
