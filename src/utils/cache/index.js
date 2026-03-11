import { SessionStorage, Storage } from '@/utils/storage'
import CacheKey from '@/utils/cache/key'

// 缓存
class Cache {
	getSign = () => {
		return Storage.getItem(CacheKey.SignKey) || ''
	}

	setSign = (value) => {
		Storage.setItem(CacheKey.SignKey, value)
	}

	getToken = () => {
		return Storage.getItem(CacheKey.TokenKey) || ''
	}

	setToken = (value) => {
		Storage.setItem(CacheKey.TokenKey, value)
	}

	getSidebarOpened = () => {
		return Storage.getItem(CacheKey.SidebarOpenedKey) || true
	}

	setSidebarOpened = (value) => {
		Storage.setItem(CacheKey.SidebarOpenedKey, value)
	}

	getLanguage = () => {
		return Storage.getItem(CacheKey.LangKey) || 'zh-CN'
	}

	setLanguage = (value) => {
		Storage.setItem(CacheKey.LangKey, value)
	}

	getComponentSize = () => {
		return Storage.getItem(CacheKey.ComponentSizeKey) || 'default'
	}

	setComponentSize = (value) => {
		Storage.setItem(CacheKey.ComponentSizeKey, value)
	}

	getTheme = () => {
		return SessionStorage.getItem(CacheKey.ThemeKey) || {
			// 默认主题配置
			primaryColor: '#4361ee',
			sidebarBgColor: '#f8f9fa',
			topBarBgColor: '#ffffff'
		}
	}

	setTheme = (value) => {
		SessionStorage.setItem(CacheKey.ThemeKey, value)
	}

	removeTheme = () => {
		SessionStorage.removeItem(CacheKey.ThemeKey)
	}
}

export default new Cache()
