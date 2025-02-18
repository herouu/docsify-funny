import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig((mode) => {
    return {
        plugins: [vue()],
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode.mode)
        },
        build: {
            lib: {
                entry: 'src/index.ts', // 插件入口文件
                name: 'docsify-funny-plugin', // 插件名称
                formats: ['umd'], // 打包格式，这里选择 UMD 格式，方便在不同环境使用
                fileName: () => `docsify-funny-plugin.js`
            },
            rollupOptions: {
                // 确保外部化处理那些你不想打包进库的依赖
                external: [],
                output: {
                    // 在 UMD 构建模式下为这些外部化的依赖提供全局变量
                    globals: {}
                }
            }
        }
    }
})
