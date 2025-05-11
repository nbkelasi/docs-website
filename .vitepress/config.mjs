import { defineConfig } from "vitepress";
import { set_sidebar } from "../utils/auto_sidebar.mjs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/docs-website/",
  head: [["link", { rel: "icon", href: "/docs-website/logo.svg" }]],
  title: "My Awesome Project",
  description: "A VitePress Site",
  themeConfig: {
    outlineTitle: "文章目录",
    outline: [2, 6],
    logo: "/logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "前端",
        items: [
          { text: "html5", link: "/backend/html5" },
          { text: "JavaScript", link: "/backend/JavaScript" },
          { text: "Vue2", link: "/backend/vue2" },
          { text: "react", link: "/backend/react" },
          { text: "面试", link: "/backend/Interview_about" },
        ],
      },
      {
        text: "后端",
        items: [{ text: "nodejs", link: "/front_end/nodejs" }],
      },
      {
        text: "工具",
        items: [{ text: "git", link: "/tool_docs/git" }],
      },
    ],
    // 搜索栏
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              selectKeyAriaLabel: "切换",
            },
          },
        },
      },
    },
    sidebar: (path) => {
      // 根据路径动态返回侧边栏配置
      const sidebarConfig = {
        "/front_end/nodejs": set_sidebar("/front_end/nodejs"),
        "/backend/JavaScript": set_sidebar("/backend/JavaScript"),
        "/backend/html5": set_sidebar("/backend/html5"),
        "/backend/vue2": set_sidebar("/backend/vue2"),
        "/backend/react": set_sidebar("/backend/react"),
        "/backend/Interview_about": set_sidebar("/backend/Interview_about"),
        "/tool_docs/git": set_sidebar("/tool_docs/git"),
      };

      // 默认关闭侧边栏
      if (
        !Object.keys(sidebarConfig).some((prefix) => path.startsWith(prefix))
      ) {
        return false;
      }

      // 为匹配的路径启用侧边栏
      return sidebarConfig[path];
    },
    aside: "left", // 设置右侧侧边栏在左侧显示
    socialLinks: [{ icon: "github", link: "https://github.com/nbkelasi" }],
    footer: {
      copyright: "Copyright @ 2025-present zx",
    },
  },
});
