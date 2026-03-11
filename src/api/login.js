import service from "@/utils/request"
export const useLoginApi = (data) => {
	return service.post("/api/token/", data, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	})
}
export const useNewLoginApi = (data) => {
	return service.post("/api/auth/login/", data, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	})
}
export const sendsms = (data) => {
	return service.post("/api/auth/sendsms/", data, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	})
}
export const checktoken = (obj) => {
	return service.post("/api/auth/checktoken/", obj)
}

export const useLogoutApi = (obj) => {
	return service.get("/api/logout/"+ obj)
}

export const getmenus = () => {
	return service.get("/api/auth/user_info/")
}