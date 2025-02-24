<script setup lang="ts">
import JSON5 from "json5";
import * as Vue from "vue";
import { defineAsyncComponent, nextTick, ref, shallowRef } from "vue";
import { loadModule } from "vue3-sfc-loader";

const previewComp = shallowRef();
const dom = ref();

interface DemoPreviewProps {
  vue?: string;
  html?: string;
}

const props = defineProps<{ json5: string; id?: string }>();
const config = JSON5.parse(props.json5) as DemoPreviewProps;

const codeTypes: string[] = [];
if (config.html) {
  codeTypes.push("html");
}

if (config.vue) {
  codeTypes.push("vue");
}

const vuePreview = () => {
  const options = {
    moduleCache: {
      vue: Vue,
    },
    async getFile(url) {
      const res = await fetch(url);
      if (!res.ok)
        throw Object.assign(new Error(url + " " + res.statusText), { res });
      return await res.text();
    },
    addStyle(textContent) {
      const style = Object.assign(document.createElement("style"), {
        textContent,
      });
      const ref = document.head.getElementsByTagName("style")[0] || null;
      document.head.insertBefore(style, ref);
    },
  };
  previewComp.value = defineAsyncComponent(() =>
    loadModule(config.vue, options)
  );
};
console.log("codeTypess", codeTypes);
if (codeTypes.includes("vue")) {
  vuePreview();
}

nextTick(() => {
  if (props.id) {
    document.getElementById(props.id).replaceWith(dom.value);
  }
});
</script>

<template>
  <!-- 预览部分 -->
  <section ref="dom">
    <div v-for="codeType in codeTypes">
      <iframe v-if="codeType === 'html'" :src="config.html"></iframe>
      <component :is="previewComp" v-else-if="codeType === 'vue'"></component>
    </div>
  </section>
</template>

<style scoped></style>
