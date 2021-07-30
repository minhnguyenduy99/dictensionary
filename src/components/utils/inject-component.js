export function injectComponent(Vue, component, selectorOrElement = undefined) {
  const vueComponent = new Vue({
    render: (h) => h(component),
  }).$mount(selectorOrElement);

  document.body.appendChild(vueComponent.$el);
  return vueComponent;
}
