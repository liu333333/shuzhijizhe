import service from '@/utils/request'

// // token校验
export const checktoken = (data) => {
	return service.post('/api/checktoken/', data)
}


// 模型
export const modelList = () => {
	return service.get('/api/stable/model/')
}
// 当前模型
export const getCurrModel = () => {
	return service.get('/api/stable/checkpoint/')
}
// 模型切换
export const modelUpdate = (data) => {
	return service.post('/api/stable/model/', data)
}

// 风格
export const loraList = () => {
	return service.get('/api/stable/lora/')
}
// control
export const control = () => {
	return service.get('/api/stable/control/')
}

// 文生图接口
export const creatImgByText = (data) => {
	return service.post('/api/tool/img/make/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
// 文生视频接口
export const creatVideoByText = (data) => {
	return service.post('/api/tool/text_to_video/make/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}

export const historyimg = (data) => {
	return service.get('/api/tool/img/?'+data)
}

export const historytexttovideo = (data) => {
	return service.get('/api/tool/text_to_video/?'+data)
}

// 照片识别
export const faceDetect = (data) => {
	return service.post('/api/tool/face_detect/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}

export const faceDetectGet = (data) => {
	return service.get('/api/tool/face_detect/?'+data)
}


//获取音色类型
export const ttsvoice = () => {
	return service.get('/api/tool/audio/voice/')
}

// 音频生成
export const creatttschat = (data) => {
	return service.post('/api/tool/audio/make/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
export const ttsaccessfile = (data) => {
	return service.get('/api/tool/audio/'+data+'/')
}

// 风评记录列表
export const yqfphistories = (data) => {
	return service.post('/api/yqfp/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
// 风评记录列表生成
export const yqfphistoriesrecords = (data) => {
	return service.post('/api/yqfp/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}

// 风评生成
export const yqfpcompletions = (data) => {
	return service.post('/api/yqfp/completions/', data,{
		headers:{ "Content-Type": "application/json" },
	})
}

// 音频历史记录
export const historyaudio = () => {
	return service.get('/api/tool/audio/')
}

//首页历史记录
export const syHistoryList = (data) => {
	return service.post('/api/home/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//首页查看历史记录
export const syHistoryRecords = (data) => {
	return service.post('/api/home/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//首页停止会话
export const stopChatMessages = (data) => {
	return service.post('/api/home/stop/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//制作停止会话
export const stopnewsChatMessages = (data) => {
	return service.post('/api/news/creation/stop/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//风评停止会话
export const yqfpstopChatMessages = (data) => {
	return service.post('/api/yqfp/stop/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
// 风评停止会话
export const ljfxstopChatMessages = (data) => {
	return service.post('/api/discipline/ljfx/stop/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
// 风评停止会话
export const zblzstopChatMessages = (data) => {
	return service.post('/api/discipline/zblz/stop/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
// 风评停止会话
export const jcfxstopChatMessages = (data) => {
	return service.post('/api/discipline/jcfx/stop/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
// 企业制度评停止会话
export const qyzdstopChatMessages = (data) => {
	return service.post('/api/assistant/qyzd/stop/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
// 稿件分析停止会话
export const analysisstopChatMessages = (data) => {
	return service.post('/api/news/analysis/stop/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
// 豫政通问停止会话
export const yztwstopChatMessages = (data) => {
	return service.post('/api/policy/yztw/stop/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
// 数据资产停止会话
export const sjzcstopChatMessages = (data) => {
	return service.post('/api/assistant/sjzc/stop/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
// 中医停止会话
export const zystopChatMessages = (data) => {
	return service.post('/api/assistant/zy/stop/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
// 法助理停止会话
export const fzlstopChatMessages = (data) => {
	return service.post('/api/assistant/fzl/stop/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}


//风控历史记录
export const yqfpHistoryList = (data) => {
	return service.post('/api/yqfp/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//风控查看历史记录
export const yqfpHistoryRecords = (data) => {
	return service.post('/api/yqfp/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//风控历史记录
// export const yqfphistories = (data) => {
// 	return service.post('/api/yqfp/histories/', data,{
// 		headers:{ 'Content-Type': 'multipart/form-data' }
// 	})
// }
//风控查看历史记录
export const yqfprecords = (data) => {
	return service.post('/api/yqfp/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//法助理历史记录
export const fzlhistories = (data) => {
	return service.post('/api/assistant/fzl/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//法助理查看历史记录
export const fzlrecords = (data) => {
	return service.post('/api/assistant/fzl/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//数据资产历史记录
export const sjzchistories = (data) => {
	return service.post('/api/assistant/sjzc/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//数据资产查看历史记录
export const sjzcrecords = (data) => {
	return service.post('/api/assistant/sjzc/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//中医助手历史记录
export const zyhistories = (data) => {
	return service.post('/api/assistant/zy/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//中医助手查看历史记录
export const zyrecords = (data) => {
	return service.post('/api/assistant/zy/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//企业制度历史记录
export const qyzdhistories = (data) => {
	return service.post('/api/assistant/qyzd/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//企业制度查看历史记录
export const qyzdrecords = (data) => {
	return service.post('/api/assistant/qyzd/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//廉洁风险分析历史记录
export const ljfxhistories = (data) => {
	return service.post('/api/discipline/ljfx/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//廉洁风险分析查看历史记录
export const ljfxrecords = (data) => {
	return service.post('/api/discipline/ljfx/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//招标廉政分析历史记录
export const zblzhistories = (data) => {
	return service.post('/api/discipline/zblz/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//招标廉政分析查看历史记录
export const zblzrecords = (data) => {
	return service.post('/api/discipline/zblz/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//监察案件历史记录
export const jcfxhistories = (data) => {
	return service.post('/api/discipline/jcfx/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//监察案件查看历史记录
export const jcfxrecords = (data) => {
	return service.post('/api/discipline/jcfx/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}

//AI写作历史记录
export const creationhistories = (data) => {
	return service.post('/api/news/creation/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//AI写作查看历史记录
export const creationrecords = (data) => {
	return service.post('/api/news/creation/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//稿件分析历史记录
export const analysishistories = (data) => {
	return service.post('/api/news/analysis/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//稿件分析查看历史记录
export const analysisrecords = (data) => {
	return service.post('/api/news/analysis/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}


//豫政通问历史记录
export const yztwhistories = (data) => {
	return service.post('/api/policy/yztw/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//豫政通问查看历史记录
export const yztwrecords = (data) => {
	return service.post('/api/policy/yztw/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//政策趋势历史记录
export const zcqshistories = (data) => {
	return service.post('/api/discipline/zcqs/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//政策趋势查看历史记录
export const zcqsrecords = (data) => {
	return service.post('/api/discipline/zcqs/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//政策领域历史记录
export const zclyhistories = (data) => {
	return service.post('/api/discipline/zcly/histories/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}
//政策领域查看历史记录
export const zclyrecords = (data) => {
	return service.post('/api/discipline/zcly/records/', data,{
		headers:{ 'Content-Type': 'multipart/form-data' }
	})
}