import { defineConfig } from 'vitepress'
import { set_sidebar } from "../utils/auto_sidebar.mjs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [["link", { rel: "icon", href: "/logo.svg" }]],
  title: "My Awesome Project",
  description: "A VitePress Site",
  base: "/docs-website/",
  themeConfig: {
    outlineTitle: "文章目录",
    outline: [2, 6],
    logo: '/logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { 
        text: '前端',
        items: [
          { text: 'JavaScript', link: '/backend/JavaScript' }
        ]
       },
      { 
        text: '后端',
        items: [
          { text: 'nodejs', link: '/front_end/nodejs' }
        ]
      }
    ],
    // 搜索栏
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档"
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              selectKeyAriaLabel: "切换",
            }
          }
        }
      }
    },

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],
    sidebar: { 
      "/front_end/nodejs": set_sidebar("/front_end/nodejs"),
      "/backend/JavaScript": set_sidebar("/backend/JavaScript"),
    },
    sidebar: false, // 关闭侧边栏
    aside: "left", // 设置右侧侧边栏在左侧显示
    socialLinks: [
      { icon: 'github', link: 'https://github.com/nbkelasi' }
    ],
    footer:{
      copyright:"Copyright @ 2025-present zx"
    }
  }
})
