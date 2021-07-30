<template>
  <div class="dict__definition">
    <div class="dict__content">
      <p>
        <span class="part-of-speech">({{ definition.partOfSpeech }})</span>
        <span>{{ definition.pronunciation }}</span>
      </p>
      <p class="definition">{{ definition.definition }}</p>
      <div v-if="hasExample" class="examples">
        <p>Examples:</p>
        <ul>
          <li v-for="example in definition.examples" :key="example.id">
            {{ example }}
          </li>
        </ul>
      </div>
    </div>
    <div class="dict__actions ext-test">
      <ext-expand
        v-model="contextOpen"
        title="Context"
        :headerClass="
          hasContext ? 'ext-color-light ext-background-primary' : ''
        "
      >
        <div class="ext-form">
          <div class="ext-input">
            <input type="text" v-model="currentContext.textual_context" />
            <label>Textual context</label>
          </div>
          <div class="ext-input">
            <input type="text" v-model.lazy="currentContext.visual_context" />
            <label>Image context</label>
          </div>
          <figure class="ext-image" v-if="currentContext.visual_context">
            <img :src="currentContext.visual_context" />
          </figure>
          <button
            class="ext-btn ext-btn-submit ext-primary ext-rounded"
            @click="$on_updateContext"
          >
            {{ hasContext ? "Update" : "Add" }}
          </button>
        </div>
      </ext-expand>
    </div>
  </div>
</template>

<script>
import { ExtExpand } from "./base";
export default {
  name: "WordDefinition",
  components: {
    ExtExpand,
  },
  props: {
    definition: {
      partOfSpeech: String,
      definition: String,
      examples: Array,
    },
    context: {
      textual_context: String,
      visual_context: String,
      default: () => {},
    },
  },
  data: () => ({
    currentContext: {
      textual_context: null,
      visual_context: null,
    },
    contextOpen: false,
  }),
  mounted: function () {
    this.context && (this.currentContext = this.context);
  },
  computed: {
    hasExample() {
      const count = this.definition.examples?.length;
      return count && count > 0;
    },
    hasContext() {
      return !!this.context;
    },
  },
  watch: {
    definition(val) {
      this.contextOpen = false;
    },
    context(val) {
      if (!val) {
        this.currentContext = {
          textual_context: null,
          visual_context: null,
        };
        return;
      }
      this.currentContext = val;
      this.$nextTick(() => {
        console.log(this.hasContext);
      });
    },
  },
  methods: {
    $on_updateContext() {
      this.$emit("update:context", this.currentContext);
      this.$emit("contextChanged", this.currentContext);
    },
  },
};
</script>

<style lang="scss">
@import "./scss/_form.scss";

.dict__definition {
  border: 3px solid var(--ext-primary-dark);

  .dict__content {
    width: 80%;
    padding: 5px;

    .part-of-speech {
      font-weight: bold;
      margin-right: 10px;
    }
  }

  .examples {
    > p {
      padding: 10px 0 0 0;
    }
    ul > li {
      font-style: italic;
    }
  }
}

.dict__actions {
  padding: 5px 0 0 0;
  margin: 0;

  .ext-image {
    display: flex;
    justify-content: center;
    img {
      max-width: 50%;
      filter: none;
    }
  }
}
</style>
