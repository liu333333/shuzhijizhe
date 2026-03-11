import { defineStore } from "pinia"
import { useNewLoginApi,getmenus,sendsms } from "@/api/login"
import { useUserInfoApi, resetCode, listByDep, page, user_info, save, update } from "@/api/user"
import cache from "@/utils/cache"
// import Socket from "@/utils/websocket"

export const userStore = defineStore("userStore", {
	state: () => ({
		user: {
			id: '',
			username: '',
			isLogin: ''
		},
		token: cache.getToken(),
		sign: cache.getSign(),
		project: {
			id: ''
		},
		buttonPermissions: [],
		siteId: '',
		siteList: []
	}),
	persist: {
		//  固化插件
		enabled: true, // 开启存储
		strategies: [
			// 指定存储的位置以及存储的变量都有哪些，该属性可以不写，
			//在不写的情况下，默认存储到 sessionStorage 里面,默认存储 state 里面的所有数据。
			{ storage: localStorage, paths: ['token', 'sign', 'user', 'project', 'buttonPermissions'] }
			// paths 是一个数组，如果写了 就会只存储 count 变量，当然也可以写多个。
		]
	},
	actions: {
		setUser(val) {
			this.user = val
		},
		setProject(val) {
			this.project = val
		},
		setToken(val) {
			this.token = val
			cache.setToken(val)
		},
		setSign(val) {
			this.sign = val
			cache.setSign(val)
		},
		// 用户登录
		async loginAction(loginForm) {
			const res = await useNewLoginApi(loginForm)
			return new Promise((resolve, reject) => {
				this.setToken('Bearer '+res.data.token)
				this.setSign(res.sign)
				resolve(res)
			})
		},
		// 获取验证码
		async sendsms(loginForm) {
			const res = await sendsms(loginForm)
			return new Promise((resolve, reject) => {
				// this.setToken('Bearer '+res.data.token || '')
				// this.setSign(res.sign || '')
				resolve(res)
			})
		},
		// 重置密码校验
		async resetCode(loginForm) {
			const res = await resetCode(loginForm)
			return new Promise((resolve, reject) => {
				resolve(res)
			})
		},
		// 用户登录
		async getmenus() {
			const res = await getmenus()
			console.log(res);
			
			// this.buttonPermissions = res.obj.buttonPermissions
			this.setUser({ username: res.data.username })
			return new Promise((resolve, reject) => {
				resolve(res)
			})
		},
		async listByDep() {
			const res = await listByDep("")
			return new Promise((resolve, reject) => {
				resolve(res)
			})
		},
		async page(obj) {
			const res = await page(obj)
			return new Promise((resolve, reject) => {
				resolve(res)
			})
		},
		async user_info(obj) {
			const res = await user_info(obj)
			return new Promise((resolve, reject) => {
				resolve(res)
			})
		},
		async save(obj) {
			const res = await save(obj)
			return new Promise((resolve, reject) => {
				resolve(res)
			})
		},
		async update(obj) {
			const res = await update(obj)
			return new Promise((resolve, reject) => {
				resolve(res)
			})
		},
		// 获取用户信息
		async getUserInfoAction() {
			if (this.user?.id) {
				const res = await useUserInfoApi(this.user.id)
				this.setUser(res.data.user)
				this.setProject(res.data.project)
			} else {
				this.setUser({
					id: "",
					username: ""
				})
			}
		},
		// 用户退出
		async logoutAction() {
			// await useLogoutApi(this.user.id)
			// // 移除 token
			this.setUser({
				id: "",
				username: ""
			})
			this.setProject({
				id: ""
			})
			this.setToken(null)
			this.setSign(null)
			localStorage.clear()
			sessionStorage.clear()
		},
		// 开启websocket链接
		// async openwebsocket() {
		// 	// ,openCb:()=>{wbSocket.send('/pj/socket/app/singleLogout')}
		// 	const wbSocket = new Socket({ url: `wss://fzyjj.dahe.cn/pj/websocket/${this.token}` })
		// 	wbSocket.onmessage((data) => {
		// 		// const str = JSON.stringify(data)
		// 		console.log("server data:", data)
		// 		// 您的账号已在其他终端登录 需要跳转到登录页
		// 		ElMessageBox.confirm("您的账号已在其他终端登录！", "提示", {
		// 			confirmButtonText: "确定",
		// 			showCancelButton: false,
		// 			type: "warning"
		// 		})
		// 			.then(() => {
		// 				this.setToken("")
		// 				this.setSign("")
		// 				this.logoutAction()
		// 				location.reload()
		// 			})
		// 			.catch(() => { })
		// 	})
		// }
	}
})
