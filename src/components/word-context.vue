<template>
  <div class="word-context">
    <div>
      <figure class="image__wrapper">
        <img class="image" :src="context.contextualText" />
      </figure>
      <p>{{ context.contextualImage }}</p>
    </div>
    <slot name="trigger" v-bind="{ open }">
      <div>
        <button class="ext-btn" @click="open = !open">See definition</button>
      </div>
    </slot>
    <transition>
      <word-definition v-show="open" :definition="definition" :saved="true" />
    </transition>
  </div>
</template>

<script>
export default {
  name: "WordContext",
  components: {
    "word-definition": () => import("./word-definition.vue"),
  },
  props: {
    context: {
      contextualText: String,
      contextualImage: String,
    },
    definition: Object,
  },
  data: () => ({
    open: false,
  }),
};
</script>
