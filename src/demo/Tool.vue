<script setup lang="ts">
import { ref, toRef, watch } from "vue";
import pretty from "pretty";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  code: {
    type: String,
    required: false,
  },
  codeType: {
    type: String,
    required: true,
  },
});

const showCode = toRef(props.show);

function copyCode() {
  // 复制代码逻辑
  navigator.clipboard.writeText(props.code);
}

async function codesandbox() {
  const api = "https://codesandbox.io/api/v1/sandboxes/define?json=1";
  const params = props.codeType === "html" ? getHtmlParams() : getVueParams();
  await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((x) => x.json())
    .then((data) => {
      window.open(`https://codesandbox.io/embed/${data.sandbox_id}`);
    });
}

function getHtmlParams() {
  return {
    files: {
      "index.html": {
        content: props.code,
      },
    },
  };
}

function getVueParams() {
  return {
    files: {
      "src/index.vue": {
        content: props.code,
      },
      "package.json": {
        content: JSON.stringify(
          {
            version: "0.0.0",
            private: true,
            dependencies: {
              vue: "latest",
            },
            devDependencies: {
              typescript: "latest",
              "@vue/cli-plugin-babel": "latest",
            },
          },
          null,
          2
        ),
      },
      "tsconfig.json": {
        content: JSON.stringify(
          {
            compilerOptions: {
              target: "es5",
              lib: ["dom", "dom.iterable", "esnext"],
              allowJs: true,
              skipLibCheck: true,
              esModuleInterop: true,
              allowImportingTsExtensions: true,
              allowSyntheticDefaultImports: true,
              strict: true,
              forceConsistentCasingInFileNames: true,
              module: "esnext",
              moduleResolution: "node",
              resolveJsonModule: true,
              isolatedModules: true,
              noEmit: true,
            },
            include: ["src"],
          },
          null,
          2
        ),
      },
      "index.html": {
        content: vueIndexHtml(),
      },
      "src/main.ts": {
        content: `import { createApp } from 'vue'
import App from './index.vue'
createApp(App).mount('#app')`,
      },
    },
  };
}

function vueIndexHtml() {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="app"></div>`, "text/html");
  return pretty(`<!DOCTYPE html>\n${doc.documentElement.outerHTML}`, {
    ocd: true,
  });
}

const emits = defineEmits(["update:show"]);

function handleShowClick() {
  showCode.value = !showCode.value;
  emits("update:show", showCode.value);
}
</script>

<template>
  <div class="button-container">
    <button @click="handleShowClick">{{ !showCode ? "展开" : "收起" }}</button>
    <button @click="copyCode">复制</button>
    <button @click="codesandbox">codesandbox</button>
  </div>
</template>

<style scoped>
.button-container {
  display: flex; /* 水平排列 */
  gap: 10px; /* 按钮之间的间距 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

button {
  padding: 10px 15px; /* 按钮内边距 */
  border: none; /* 去除边框 */
  border-radius: 5px; /* 圆角边框 */
  background-color: #007bff; /* 背景色 */
  color: white; /* 字体颜色 */
  cursor: pointer; /* 鼠标悬停效果 */
}

button:hover {
  background-color: #0056b3; /* 悬停时的背景色 */
}
</style>
