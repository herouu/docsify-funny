<script setup lang="ts">
const props = defineProps({
  handleShowClick: {
    type: Function,
    required: true,
  },
  show: {
    type: Boolean,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

function handleShowClick() {
  props.handleShowClick();
}

function copyCode() {
  // 复制代码逻辑
  navigator.clipboard.writeText(props.code);
}
</script>

<template>
  <div class="button-container">
    <button @click="handleShowClick">{{ !show ? "展开" : "收起" }}</button>
    <button @click="copyCode">复制</button>
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
