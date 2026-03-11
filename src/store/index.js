// import { userStore } from './modules/user'
// import { routerStore } from './modules/router'
// import { appStore } from './modules/app'
// import { tabsStore } from './modules/tabs'

const store = {}

// 动态获取目录名
const files = import.meta.globEager('./modules/*.(js|ts)');
/**
 * 注册app状态库
 */
export const registerStore = () => {
  // 动态注册
  Object.keys(files).forEach((fileName) => {
      const name = fileName.replace(/(modules\/)/g, '').replace(/\.\/|\.(js|ts)/g, '');
      store[name+'Store'] = files[fileName][name+'Store']();
  });
}


// export const registerStore = () => {
// 	store.userStore = userStore()
// 	store.routerStore = routerStore()
// 	store.appStore = appStore()
// 	store.tabsStore = tabsStore()
// }

export default store
