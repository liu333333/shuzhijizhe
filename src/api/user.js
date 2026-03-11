import service from '@/utils/request'

export const useUserInfoApi = (id) => {
	return service.get(`/pj/user/${id}`)
}

export const updatePasswordApi = (data) => {
	return service.put('/data/success.json', data)
}


// 用户列表-根据单位查询
export const listByDep = (data) => {
	return service.post('/smart/user/list-by-dep', data,{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
// 分页查询列表
export const page = (data) => {
	return service.post('/smart/user/page', data,{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}



// -------用户管理
//删除
export const userDel = (data)=>{
	return service.post(`/admin/user/del`,data)
}
// 添加
export const save = (data) => {
	return service.post(`/admin/user/add`, data)
}
// 详情
export const user_info = (data) => {
	return service.post(`/admin/user/detail`, data)
}
// 编辑
export const update = (data) => {
	return service.post(`/admin/user/edituser`, data)
}
// 重置密码检验
export const resetCode = (data) => {
	return service.post('/admin/user/resetpwd',data)
}
// 用户解锁
export const unlock = (data) => {
	return service.post('/admin/user/unlock',data)
}
//用户禁用启用
export const changeUserStatus = (data) => {
	return service.post('/admin/user/changestatus',data)
}
//根据当前用户获取站点
export const siteByuser = (data) => {
	return service.post('/admin/user/sitebyuser',data)
}
//根据站点获取栏目树
export const channelBySid = (data) => {
	return service.post('/admin/channel/treestatus',data)
}
//根据用户查当前所选站点的栏目分配
export const channelByUser = (data) => {
	return service.post('/admin/channel/channelpermissionlist',data)
}
//给用户分配栏目
export const setChannelByUser = (data) => {
	return service.post('/admin/channel/channelpermission',data)
}