import defaultSettings from "@ant-design/pro-layout/lib/defaultSettings";
import { defineConfig } from "umi";
import menuData  from '../src/component/menuData'
export default defineConfig({
  history: {
    type: 'hash'
  },
  base:'./',
  publicPath:'./',
  hash: true,
  antd: {},
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',  
  },
  mfsu: {},  
  fastRefresh: {},
  webpack5: {},
  routes: menuData,
});