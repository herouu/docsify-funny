<script setup lang="ts">
import JSON5 from "json5";
import * as Vue from "vue";
import { defineAsyncComponent, nextTick, ref, shallowRef } from "vue";
import { loadModule } from "vue3-sfc-loader";
import hljs from "highlight.js";

const previewComp = shallowRef();
const dom = ref();
const displayCode = ref();
const vueDisplayCode = ref();

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
      const text = await res.text();
      vueDisplayCode.value = hljs.highlightAuto(text).value;
      return text;
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

if (codeTypes.includes("vue")) {
  vuePreview();
}

if (codeTypes.includes("html")) {
  getHtml(config.html);
}

async function getHtml(url: string) {
  const res = await fetch(url).then((res) => res.text());
  await nextTick(() => {
    let iframe = dom.value.querySelector("iframe");
    const iframeDocument =
      iframe.contentDocument || iframe.contentWindow.document;
    displayCode.value = hljs.highlightAuto(res).value;
    iframeDocument.write(res);
    iframeDocument.close();
  });
}

nextTick(() => {
  if (props.id) {
    const ele = document.getElementById(props.id);
    if (ele) {
      ele.replaceWith(dom.value);
    }
  }
});
</script>

<template>
  <!-- 预览部分 -->
  <section ref="dom">
    <div v-for="codeType in codeTypes">
      <div v-if="codeType === 'html'">
        <iframe style="width: 100%; height: auto; border: none"></iframe>
        <div class="code-container">
          <pre><code v-html="displayCode"></code></pre>
        </div>
      </div>
      <div v-else-if="codeType === 'vue'">
        <component :is="previewComp"></component>
        <div class="code-container">
          <pre><code v-html="vueDisplayCode"></code></pre>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
