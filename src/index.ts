import {docsifyFunnyPlugin} from "./funnyPlugins.ts";

globalThis.$docsify = globalThis.$docsify || {};
globalThis.$docsify.plugins = (globalThis.$docsify.plugins || []).concat(
    docsifyFunnyPlugin
);