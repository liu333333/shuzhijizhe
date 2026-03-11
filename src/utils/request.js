import axios from 'axios'
import qs from 'qs'
import { ElMessage, ElMessageBox } from 'element-plus'
import store from '@/store'

// axios实例
const service = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 61000,
	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

// 请求拦截器
service.interceptors.request.use(
	(config) => {
		const userStore = store.userStore
		if (userStore?.token) {
			config.headers.Authorization = userStore.token
		}

		// 追加时间戳，防止GET请求缓存
		if (config.method?.toUpperCase() === 'GET') {
			// console.log(config,'config.params,config.data----');
			// , t: new Date().getTime() 
			for(let key in config.params){
				if(!config.params[key] && config.params[key] !== 0){
					delete config.params[key]
				}
			}
			config.params = { ...config.params}
		}
		if(config.data){
			for(let key in config.data){
				if(!config.data[key] && config.data[key] !== 0){
					delete config.data[key]
				}
			}
		}
		if (Object.values(config.headers).includes('application/x-www-form-urlencoded')) {
			config.data = qs.stringify(config.data)
		}
		if (Object.values(config.headers).includes('multipart/form-data')) {
			var formData = new FormData();
			for(let k in config.data){
				formData.append(k,config.data[k]);
			}
			config.data = formData
		}
		
		// if (config.method?.toUpperCase() === 'PUT') {
		// 	config.data = qs.stringify(config.data)
		// }
		// console.log(config,'config');
		store.appStore.setAxiosPool(config.url)
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	response => {
		store.appStore.delAxiosPool(response.config.url)
		// console.log(response);
		
		if (response.status !== 200) {
			return Promise.reject(new Error(response.statusText || 'Error'))
		}

		const res = response.data
		// 响应成功
		if (res.code === 2000 || res.code === 400) {
			return res
		}else if(res.code == 4001){
			// ElMessage.error(res.msg)
			store.userStore.setToken('')
			location.reload()
		}else if(res.code == 4000){
			return res
		}else if(res.code=='token_valid'){
			return res
		}else{
			ElMessage.error(res.msg)
		}
		
		return Promise.reject(new Error(res.msg || 'Error'))
	},
	error => {
		if (error && error.response && error.response.status) {
			errorHandle(error.response.status,error.response)
		}else{
            // ElMessage.error('页面授权失效，请重新登录');
			// store.userStore.setToken('')
			// location.reload()
			ElMessage.error(error.message)
		}
		return Promise.reject(error)
	}
)

const errorHandle = (status,response) => {
    // 状态码判断
    switch (status) {
        // 406 重定向 权限不足
		
        case 4001:
			if(response && response.data){
				const res = response.data
				// 没有权限，如：未登录、登录过期等，需要跳转到登录页
				ElMessageBox.confirm(res.msg, '提示', {
					confirmButtonText: '确定',
					showCancelButton:false,
					type: 'warning'
				})
				.then(() => {
					store.userStore.setToken('')
					location.reload()
				})
				.catch(() => {})
				return Promise.reject(res)
			}else{
				ElMessageBox.confirm('页面授权失效，请重新登录！', '提示', {
					confirmButtonText: '确定',
					showCancelButton:false,
					type: 'warning'
				})
				.then(() => {
					store.userStore.setToken('')
					location.reload()
				})
			}
            break;
		
        case 404:
			ElMessage.error('请求不存在');
            break;
        // 404请求不存在
        case 4000:
            ElMessage.error('请求失败');
            break;
        case 502:
            ElMessage.error('后台系统正在上线');
            break;
		case 504:
            ElMessage.error('请求超时，请稍后再试');
            break;
        default:
            ElMessage.error('服务开了小差，请稍后再试');
    }
};

// 导出 axios 实例
export default service
