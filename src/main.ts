import { createApp } from 'vue'
import './style.css'
// import App from './App.vue'
import FavoritesCard from './FavoritesCard.vue'
// const filePath = "/src/assets/test.json"
// createApp(App,{filePath}).mount('#app')
const markdown = `
# Card
* [技术文章摘抄](https://learn.lianglianglee.com/)
* [Rust 程序设计语言](https://rustwiki.org/zh-CN/book/)
* [Go语言圣经](https://golang-china.github.io/gopl-zh/)
* [V语言学习笔记](https://lydiandylin.gitbook.io/vlang)
* [深入架构原理与实践](https://www.thebyte.com.cn/)
* [Open Github社区](https://open.itc.cn/)
* [linux_kernel_wiki](https://github.com/0voice/linux_kernel_wiki)
* [Linux 性能工具图谱](https://www.brendangregg.com/linuxperf.html)
* [. 如何阅读《深入理解计算机系统》这本书?【二哥的Java进阶之路】](https://javabetter.cn/xuexijianyi/read-csapp.html,)
* [. 如何阅读《深入理解计算机系统》这本书？【知乎】](https://www.zhihu.com/question/20402534)
* [Linux Changes](https://kernelnewbies.org/LinuxChanges)
* [Linux 内核揭秘【英文版】](https://github.com/0xAX/linux-insides)
* [Linux 内核揭秘【中文版】](https://docs.hust.openatom.club/linux-insides-zh)
* [linux-syscall-table](https://filippo.io/linux-syscall-table/)
* [现代 JavaScript 教程](https://zh.javascript.info/)
* [TypeScript手册](https://bosens-china.github.io/)
* [vue3资源](https://vue3js.cn/)
* [Vue3 入门指南与实战案例](https://vue3.chengpeiquan.com/)
`
createApp(FavoritesCard,{markdown}).mount('#favorite')
