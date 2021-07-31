import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ToggleBtn from "vue-toggle-btn";

Vue.component("vue-toggle-btn", ToggleBtn);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
