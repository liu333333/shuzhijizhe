import service from '@/utils/request'

export const save = (data) => {
	return service.post('/admin/role/add', data,{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
export const update = (data) => {
	return service.post('/admin/role/edit', data,{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
export const role_list = (data) => {
	return service.post('/admin/role/list', data,{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
export const detail = (data) => {
	return service.post('/admin/role/detail', data,{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
// 用户分页列表-根据角色id查询
export const pageUserRole = (data) => {
	return service.post('/admin/user/page-user-role', data,{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
// 删除角色下用户
export const delUserRole = (data) => {
	return service.post('/admin/user/del-by-user-role', data,{
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
