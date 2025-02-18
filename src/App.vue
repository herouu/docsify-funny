<script setup lang="ts">
import lottie from 'lottie-web'
import {nextTick, onMounted, ref} from "vue";


const props = defineProps({
  filePath: String,
  id: String
})

const lottieDivRef = ref<any>();

onMounted(() => {
  genLottie(props.filePath || '')
})

function genLottie(file: string): void {
  const element = lottieDivRef.value
  lottie.loadAnimation({
    container: element, // the dom element that will contain the animation
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: file
  })
  nextTick(() => {
    const ele = document.getElementById(props.id!)
    if (ele) {
      document.getElementById(props.id!)!.replaceWith(element)
    }
  })
}


</script>

<template>
  <div ref="lottieDivRef">
  </div>
</template>

<style scoped>

</style>
