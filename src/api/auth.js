import service from '@/utils/request'

export const save = (data) => {
	return service.post('/admin/resource/add', data,{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
export const update = (data) => {
	return service.post('/admin/resource/edit', data,{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
export const detail = (data) => {
	return service.post('/smart/auth/'+data, '',{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
// 权限树
export const authTree = (data) => {
	return service.post('/admin/resource/trees',{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
// 权限树-根据角色查询
export const roleAuthTree = (data) => {
	return service.post('/admin/resource/role-resource-tree',data,{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

// 权限状态更改
export const roleStatus = (data) => {
	return service.post('/admin/resource/changestauts/'+data ,{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
