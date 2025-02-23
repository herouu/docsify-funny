import type {DocsifyHooks} from "./types/docsify";
import {nanoid} from "nanoid";
import {createApp} from "vue";
import LottieSvg from "./LottieSvg.vue";
import FavoritesCard from "./FavoritesCard.vue";
import NotabilitySvg from "./NotabilitySvg.vue";
import './style.css'
import Table from "./Table.vue";

const docsifyFunnyPlugin = (hook: DocsifyHooks, vm: any) => {
    hook.beforeEach((markdown: string) => {
        // 获取路径
        console.log(vm.route)
        if (markdown.startsWith("# Card")) {
            const div = document.createElement('div')
            createApp(FavoritesCard, {markdown: markdown}).mount(div)
            return div.innerHTML
        }
        return markdown
    })

    function handleLottie(doc: Document) {
        const fileType = 'Lottie'
        const contentList = doc.querySelectorAll(`img[data-origin^='${fileType}>>']`);
        contentList.forEach((contentElement) => {
            const div = doc.createElement('div');
            const id = nanoid()
            div.setAttribute('id', id)
            div.setAttribute('type', fileType)
            const filePath = contentElement.getAttribute('src')?.replace(fileType + '>>', '') || ''
            div.setAttribute('file-path', filePath)
            if (!div) {
                return
            }
            if (filePath) {
                createApp(LottieSvg, {
                    filePath: filePath, id: id
                }).mount(div);
            }
            contentElement.replaceWith(div);
        });
    }

    function handleVideo(doc: Document) {
        const contentList = doc.querySelectorAll(`img[data-origin^='Bilibili>>'], img[data-origin^='Youtube>>']`);
        contentList.forEach((contentElement) => {
            const div = doc.createElement('div');
            const item = contentElement.getAttribute('data-origin') || ''
            const sp = item.split(">>")
            let iframe = ''
            const video = sp[1].trim()
            const platform = sp[0]
            const frameStyle = `width: 100%;height: 100%;`
            if (platform === "Bilibili") {
                iframe = `<iframe style="${frameStyle}" src="//player.bilibili.com/player.html?isOutside=true&${video}&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>`
            } else if (platform === "Youtube") {
                iframe = `<iframe style="${frameStyle}" src="https://www.youtube.com/embed/${video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
            }
            let replaceValue = `<div style="width:80%;height: auto;max-width: 720px; min-width: 240px;flex-grow: 0;margin: 10px;aspect-ratio: 16 / 9;">${iframe}</div>`;
            replaceValue = `<div style="display: flex;flex-wrap: wrap; justify-content: flex-start; align-items: stretch; ">${replaceValue}</div>`
            div.innerHTML = replaceValue
            contentElement.replaceWith(div)
        });
    }

    function handleNotability(doc: Document) {
        const fileType = 'Notability'
        const contentList = doc.querySelectorAll(`img[data-origin^='${fileType}>>']`);
        contentList.forEach((contentElement) => {
            const div = doc.createElement('div');
            const id = nanoid()
            div.setAttribute('id', id)
            const fileUrl = contentElement.getAttribute('src')?.replace(fileType + '>>', '') || ''
            if (fileUrl) {
                createApp(NotabilitySvg, {
                    fileUrl, id
                }).mount(div);
            }
            contentElement.replaceWith(div)
        });
    }


    function handleTable(doc: Document) {
        doc.querySelectorAll('pre[data-lang="table"]').forEach(item => {
            const div = doc.createElement('div')
            createApp(Table, {markdown: item.querySelector('code')?.innerText}).mount(div)
            item.replaceWith(div)
        })
    }

    hook.afterEach((html: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        handleNotability(doc);
        handleVideo(doc);
        handleLottie(doc);
        handleTable(doc)
        return doc.body.innerHTML;
    });
}


export {docsifyFunnyPlugin}