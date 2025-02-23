<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";

const props = defineProps({
  markdown: String
})
const data = ref<CardItem[]>([])

interface CardItem {
  title?: string
  content: string[]
  detail?: string
}

props.markdown?.split("\n").forEach((item) => {
  if (item === "" || item.startsWith("#") || !item.startsWith("*")) {
    return
  }
  const contents = [item.match(/\((.*?)\)/)?.[1]].filter(x => x !== undefined)
  let title = item.match(/\[(.*?)\]/)?.[1] || ''
  let detail = ''
  if (title.startsWith('. ')) {
    detail = title.slice(2)
    if (detail) {
      title = ''
    }
  }
  const cardItem = {
    title: title,
    content: contents,
    detail: detail
  }
  data.value.push(cardItem)
})

const dom = ref()

function jump(index: number) {
  const aList = dom.value[index].querySelectorAll('a')
  if (aList.length > 1) {
    return;
  }
  window.open(aList[0].href, "_blank");
}

const bindButtonEvent = () => {
  const cardDomList = document.querySelectorAll('div[id^="card_"]')
  if (cardDomList) {
    cardDomList.forEach((cardDom, index) => {
      cardDom.addEventListener('click', () => {
        jump(index)
      })
    })

  }
};

onMounted(() => {
  nextTick(() => {
    bindButtonEvent();
  })
});

</script>

<template>
  <div class="grid-container">
    <div ref="dom" :id="'card_'+index" v-for="(item,index) in data" class="card">
      <div v-if="item.title">{{ item.title }}</div>
      <div v-else class="detail-content">{{ item.detail }}</div>
      <div>
        <p v-if="item.content.length>1" v-for="per in item.content">
          <a :href="per" target="_blank">{{ per }}</a>
        </p>
        <p v-else>
          <a :href="item.content[0]" target="_blank"></a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

.grid-container {
  width: 100%;
  height: 100%;
  display: grid;
  gap: 16px; /* 网格间距 */
}

.card {
  background: linear-gradient(135deg, #68b88e, #45a27b); /* 渐变背景 */
  text-align: center;
  padding: var(--padding-vertical) 0;
  font-size: var(--font-size);
  border-radius: var(--border-radius); /* 确保引用变量 */
  color: var(--text-color);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 更深的阴影 */
  transition: transform 0.2s, box-shadow 0.2s; /* 添加过渡效果 */
  min-height: 100px; /* 添加最小高度 */
  overflow-y: auto; /* 内容过多时可滚动 */
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

div.card > p:first-child {
  margin: 8px 0 12px;
  font-size: var(--font-size);

}

div.card > p:not(:first-child) {
  margin: 12px 0 4px;
  font-size: var(--sub-font-size);
}

div.card > div {
  height: auto;
}

div.card > div > p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 12px 12px 0 12px;
  font-size: var(--sub-font-size);
}

.card:hover {
  transform: translateY(-5px); /* 鼠标悬停时上移 */
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3); /* 鼠标悬停时增加阴影 */
  cursor: pointer;
}

.detail-content {
  font-size: 14px;
}
</style>