export function createComponent(Vue, component, selectorOrElement = undefined) {
  const vueComponent = new Vue({
    render: (h) => h(component),
  });
  if (selectorOrElement) {
    vueComponent.$mount(selectorOrElement);
  } else {
    vueComponent.$mount();
  }

  return vueComponent;
}
