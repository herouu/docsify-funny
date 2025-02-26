<script setup lang="ts">
import JSON5 from "json5";
import * as Vue from "vue";
import { defineAsyncComponent, nextTick, ref, shallowRef } from "vue";
import { loadModule } from "vue3-sfc-loader";
import hljs from "highlight.js";
import Tool from "./Tool.vue";

const previewComp = shallowRef();
const dom = ref();

interface CodeTypes {
  type: String;
  showCode: boolean;
  copyCode: string;
  highlightCode: String;
}

const displayHeightLightCode = ref();
const vueDisplayCode = ref();

const showCode = ref(false);
const showCodeVue = ref(false);

const copyCode = ref();
const copyVueCode = ref();

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
      copyVueCode.value = text;
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
    displayHeightLightCode.value = hljs.highlightAuto(res).value;
    copyCode.value = res;
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
    <div v-for="codeType in codeTypes" class="box-container">
      <div v-if="codeType === 'html'">
        <iframe class="box-container-iframe"></iframe>
        <tool
          :handleShowClick="() => (showCode = !showCode)"
          :show="showCode"
          :code="copyCode"
        ></tool>
        <div class="code-container" v-if="showCode">
          <pre><code v-html="displayHeightLightCode"></code></pre>
        </div>
      </div>
      <div v-else-if="codeType === 'vue'">
        <component
          class="vue-box-preview"
          style="border: none"
          :is="previewComp"
        ></component>
        <tool
          :handleShowClick="() => (showCodeVue = !showCodeVue)"
          :show="showCodeVue"
          :code="copyVueCode"
        ></tool>
        <div class="code-container" v-if="showCodeVue">
          <pre><code v-html="vueDisplayCode"></code></pre>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 增加每个区域之间的间距 */
  padding: 0; /* 增加整体的内边距 */
  background-color: #f9f9f9; /* 设置背景色 */
}

.box-container-iframe {
  height: auto;
  border: none;
  padding: 10px;
}

.box-container {
}

.vue-box-preview {
  padding: 0 10px;
}

.box-container div {
  border-top: 1px solid #ddd;
}

.box-container > div > div {
  padding: 10px;
}

.box-container > div {
  border: 1px solid #ddd; /* 添加边框 */
}

iframe {
  width: 100%;
  height: 300px; /* 固定高度以适应内容 */
  border: none;
}

.code-container {
  padding: 10px; /* 增加内边距 */
  overflow: auto; /* 滚动条 */
}

pre {
  margin: 0; /* 去除默认的外边距 */
}
</style>
