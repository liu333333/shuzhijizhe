<template>
	<div class="homepage" :class="[isFullPage ? 'fullpage' : '']">
		<div class="title-nav-bg" :class="['title-nav-bg', itemArrayObj.itemArray.length > 0 ? 'title-shadow' : '']" v-if="isFullPage">
			<div class="title-text" v-if="itemArrayObj.itemArray.length > 0 && !isShow">
				{{ itemArrayObj.itemArray[itemArrayObj.itemArray.length - 1].title }}
			</div>
			<div class="history-btn" @click="historyBtn">
				<el-icon><Clock /></el-icon> 历史
			</div>
		</div>
		<div class="kong" v-if="isShow && isFullPage"></div>
		<div class="content" v-if="!isShow">
			<div class="content-item" v-for="(item, index) in itemArrayObj.itemArray" :key="index">
				<div class="ans">
					<div class="ans-text-box">
						<div class="ans-file-list">
							<div class="ans-file-item" v-for="(fileitem, i) in item.filearray" :key="i">
								<img src="@/assets/file-icon-up.png" alt="" /> {{ fileitem.name || fileitem.filename }}
							</div>
						</div>
						<div class="ans-title">
							{{ item.title }}
						</div>
					</div>
				</div>
				<div class="ask">
					<div :ref="setItemRef(index)" v-if="item.compiledMarkdown" class="response-content" v-html="item.compiledMarkdown"></div>

					<!-- 加载状态 -->
					<div v-if="item.loading" class="loading-container">
						<el-icon class="is-loading"><Loading /></el-icon>
						<span>正在生成回答...</span>
					</div>
					<div class="yqts" v-if="!item.loading">本问答由 AI 生成，仅供参考，注意甄别！</div>
					<div class="ag" v-if="!item.loading">
						<div class="copy-box" @click="copyText(item.textcopy)">
							<el-tooltip content="复制" placement="top">
								<el-icon class="down-word"><CopyDocument /></el-icon>
							</el-tooltip>
						</div>
						<div class="copy-box" @click="downWord(index, item.title, item.htmlcopy)">
							<el-tooltip content="下载word" placement="top">
								<el-icon class="down-word"><Download /></el-icon>
							</el-tooltip>
						</div>
						<div class="copy-box">
							<el-tooltip class="box-item" content="语音播放" placement="top">
								<el-icon class="down-word" @click="voicePlay(index, item.title, item.textcopy)" v-if="isPlaying"><VideoPause /></el-icon>
								<el-icon class="down-word" @click="voicePlay(index, item.title, item.textcopy)" v-else><Service /></el-icon>
							</el-tooltip>
						</div>
						<!-- <div class="copy-box" @click="regenerateContent(index, item.content)">
							<el-tooltip content="重新生成" placement="top">
								<el-icon class="down-word"><RefreshLeft /></el-icon>
							</el-tooltip>
						</div> -->
					</div>
					<!-- 光标效果 -->
					<!-- <div v-if="isStreaming && responseText" class="typing-cursor">|</div> -->
				</div>
			</div>
		</div>
		<div class="form-box">
			<el-form :model="form" class="form-class">
				<el-form-item v-if="isfilesList">
					<div class="files-list" ref="filesList">
						<div class="files-box" ref="filesBox">
							<div class="files-item" v-for="(item, index) in form.local_files" :key="index">
								<img src="@/assets/file-icon-up.png" alt="" /> {{ item.name }} <el-icon @click="fileDel(item.uid)"><CircleCloseFilled /></el-icon>
							</div>
						</div>
						<el-tooltip class="box-item" effect="light" content="向下滚动" placement="top" v-if="bottomJt">
							<el-icon class="tips-zs" @click="goBottom"><Bottom /></el-icon>
						</el-tooltip>
					</div>
				</el-form-item>
				<el-form-item>
					<el-input
						v-model="form.query"
						:class="['text-input', isfilesList ? 'mheigth' : '']"
						type="textarea"
						resize="none"
						placeholder="请问需要什么帮助"
					>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-tooltip content="点击下拉选择模型~" placement="top">
						<el-dropdown trigger="click" @command="handleSelect">
							<!-- 触发按钮 -->
							<el-button circle class="trigger-btn">
								<img :src="models[form.type - 1].icon2" alt="" />
							</el-button>

							<!-- 下拉菜单 -->
							<template #dropdown>
								<el-dropdown-menu class="model-dropdown">
									<el-dropdown-item v-for="item in models" :key="item.value" :command="item.value" :class="{ 'is-active': form.type === item.value }">
										<img v-if="form.type === item.value" :src="item.icon3" alt="" />
										<img v-else :src="item.icon" alt="" />
										<span class="model-text">{{ item.label }}</span>
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</el-tooltip>
					<div class="send-box">
						<el-upload
							v-model:file-list="fileList"
							class="upload-btn"
							action="#"
							:auto-upload="false"
							multiple
							:limit="10"
							:show-file-list="showfilelist"
							:on-change="handleFileChange"
							:accept="'.pdf,.PDF,.doc,.docx'"
						>
							<el-tooltip content="可上传附件类型：.pdf,.doc,.docx,.xlsx,.xls" placement="top" effect="dark">
								<el-icon><Link /></el-icon>
							</el-tooltip>
						</el-upload>
						<el-button v-if="!isStop" class="send-btn" :loading="loading" @click="fetchData">
							<el-icon v-if="!loading"><Promotion /></el-icon>
							发送
						</el-button>
						<el-tooltip v-if="isStop" content="停止生成" placement="top" effect="dark">
							<div @click="stopChat" class="stop-box">
								<div class="stop-in"></div>
							</div>
						</el-tooltip>
					</div>
				</el-form-item>
			</el-form>
		</div>
		<!-- <div class="module-box" v-if="isShow">
			<div class="module-item bwxz" @click="go('/news')">多种场景，润色校对，一键成文</div>
			<div class="module-item szr" @click="go()">形象定制，文本驱动，视频动效</div>
			<div class="module-item fxpg" @click="go('/jj')">场景适配，风险透视，深度分析</div>
			<div class="module-item yztw" @click="go('/zc')">政策解析，要点提炼，智出洞见</div>
			<div class="module-item ljfxfx" @click="go('/jj')">廉政分析，党纪研判，处置献策</div>
			<div class="module-item fzl" @click="go('/fl')">案情梳理，法律咨询，智能办案</div>
		</div> -->
		<el-drawer v-model="drawer" title="历史" direction="rtl" :before-close="handleClose">
			<div class="history-list" v-infinite-scroll="historyLoad" infinite-scroll-distance="100">
				<el-card style="width: 100%" shadow="hover" v-for="(item, index) in historyArray" :key="index" @click="toCreatItem(item.id)">
					<div>{{ item.name }}</div>
					<p class="formatTime">{{ formatTime(item.created_at * 1000) }}</p>
				</el-card>
				<div v-if="loadingMore" class="loading-text">加载中...</div>
				<div v-if="!has_more" class="no-more-text">没有更多数据了</div>
			</div>
		</el-drawer>
	</div>
</template>
<script setup name="AiAsk">
import { ElMessage } from 'element-plus'
import { reactive, ref, watch, nextTick } from 'vue'
import store from '@/store'
import axios from 'axios'
import { marked } from 'marked'
import { Loading } from '@element-plus/icons-vue'
import { syHistoryList, syHistoryRecords ,stopChatMessages} from '@/api/ai'
import { Document, Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, Packer } from 'docx'
import { saveAs } from 'file-saver'
import { useRouter } from 'vue-router';
import deepseekicon from '@/assets/deepseek-icon.png'
import deepseekicon2 from '@/assets/deepseek-icon2.png'
import deepseekicon3 from '@/assets/deepseek-icon3.png'
import qianwenicon from '@/assets/qianwen-icon.png'
import qianwenicon2 from '@/assets/qianwen-icon2.png'
import qianwenicon3 from '@/assets/qianwen-icon3.png'
import doubaoicon from '@/assets/doubao-icon.png'
import doubaoicon2 from '@/assets/doubao-icon2.png'
import doubaoicon3 from '@/assets/doubao-icon3.png'

// 定义事件
const emit = defineEmits(['update:isFullPage'])

const isStop = ref(false)
const taskId = ref("");
const stopChat = async () => {
	try {
		const res = await stopChatMessages({task_id:taskId.value})
		if (res.code == 2000) {
			isStop.value = false;
			loading.value = false
			itemArrayObj.itemArray[itemArrayObj.itemArray.length - 1].loading = false
		}else{

		}
	}finally {
		loading.value = false
	}
}

const handleClose = () => {}


const router = useRouter();
const go = (url)=>{
	if(!url) {
		ElMessage.warning('功能开发中，敬请期待~') 
		return false
	}
	router.push(url);
}

const itemRefs = reactive({})

const setItemRef = index => el => {
	itemRefs[`inputRef${index}`] = el
}

const isPlaying = ref(false)
const voicePlay = (index, name , textMd) => {
	// 去除 text 里的所有标签
	// 获取div中的HTML内容
	//   const text = itemRefs[`inputRef${index}`].textContent || itemRefs[`inputRef${index}`].innerText;
	// const htmlContent = itemRefs[`inputRef${index}`].innerHTML
	// console.log(htmlContent)
	// const textMd = htmlContent.match(/<think>(.*?)<\/think>(.*)/s)
	const textMdText = textMd
	if (isPlaying.value) {
		window.speechSynthesis.cancel()
		isPlaying.value = false
	} else {
		const utterance = new SpeechSynthesisUtterance(textMdText)
		window.speechSynthesis.speak(utterance)
		isPlaying.value = true
		utterance.onend = () => {
			isPlaying.value = false
		}
		utterance.onerror = () => {
			isPlaying.value = false
		}
	}
}

const copied = ref(false)
// 复制
const copyText = async textcopy => {
	if (!textcopy) {
		ElMessage.error('复制失败！！')
		return false
	}
	try {
		await navigator.clipboard.writeText(textcopy)
		ElMessage.success('复制成功！')
	} catch (err) {
		ElMessage.error('复制失败！')
	}
}
// 下载word
const downWord = async (index, name , htmlcopy) => {
	try {
		// 获取div中的HTML内容
		// const htmlContent = itemRefs[`inputRef${index}`].innerHTML
		// const textMd = htmlContent.match(/<think>(.*?)<\/think>(.*)/s)
		// 创建一个新的Document实例
		const doc = new Document({
			sections: [
				{
					children: await htmlToDocx(htmlcopy)
				}
			]
		})
		// 生成文档并下载
		const blob = await Packer.toBlob(doc)
		// const blob = new Blob([buffer], {
		// 	type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		// });
		saveAs(blob, name + '.docx')
	} catch (err) {
		ElMessage.error('下载失败！')
	}
}
// 将HTML转换为docx格式
const htmlToDocx = async html => {
	const parser = new DOMParser()
	const doc = parser.parseFromString(html, 'text/html')

	const children = []
	// 遍历DOM节点并转换为docx元素
	for (const node of doc.body.childNodes) {
		if (node.nodeType === Node.ELEMENT_NODE) {
			switch (node.tagName.toLowerCase()) {
				case 'h1':
					children.push(
						new Paragraph({
							text: node.textContent,
							heading: HeadingLevel.HEADING_1
						})
					)
					break
				case 'h2':
					children.push(
						new Paragraph({
							text: node.textContent,
							heading: HeadingLevel.HEADING_2
						})
					)
					break
				case 'p':
					children.push(
						new Paragraph({
							children: [new TextRun(node.textContent)]
						})
					)
					break
				case 'ul':
				case 'ol':
					for (const li of node.querySelectorAll('li')) {
						children.push(
							new Paragraph({
								text: li.textContent,
								bullet: { level: 0 }
							})
						)
					}
					break
				case 'table':
					const rows = []
					for (const tr of node.querySelectorAll('tr')) {
						const cells = []
						for (const td of tr.querySelectorAll('th, td')) {
							cells.push(
								new TableCell({
									children: [new Paragraph(td.textContent)]
								})
							)
						}
						rows.push(new TableRow({ children: cells }))
					}
					children.push(new Table({ rows }))
					break
				default:
					children.push(
						new Paragraph({
							children: [new TextRun(node.textContent)]
						})
					)
			}
		}
	}

	return children
}

const isShow = ref(true)
const drawer = ref(false)
const isFullPage = ref(false) // 全屏聊天
const historyBtn = () => {
	drawer.value = true
	// historyLoad()
}
const historyForm = reactive({
	last_id: '',
	pagesize: 10
})
const has_more = ref(true)
const loadingMore = ref(false)
const historyArray = ref([])
const historyLoad = async () => {
	console.log('触发加载')
	if (loadingMore.value || !has_more.value) return
	loadingMore.value = true
	try {
		const res = await syHistoryList(historyForm)
		if (res.code == 2000) {
			historyArray.value = [...historyArray.value, ...res.data.data]
			has_more.value = res.data.has_more
			if (res.data.data.length > 0) {
				historyForm.last_id = res.data.data[res.data.data.length - 1].id
			}
		}
	} finally {
		loadingMore.value = false
	}
}
const formatTime = time => {
	return new Date(time).toLocaleString()
}
// onMounted(() => {
//     historyLoad()
// })
const toCreatItem = async id => {
	const res = await syHistoryRecords({ conversation_id: id })
	if (res.code == 2000) {
		form.conversation_id = id
		itemArrayObj.itemArray = []
		drawer.value = false
		res.data.data.forEach((item, index) => {
			itemArrayObj.itemArray.push({
				compiledMarkdown: processThinkContent(marked.parse(item.answer)),
				title: item.query,
				loading: false,
				filearray: item.message_files,
				textcopy: processThinkContentOutText(marked.parse(item.answer)).replace(/<[^>]*>/g, ''),
				htmlcopy: processThinkContentOutText(marked.parse(item.answer))
			})
		})
		isShow.value = false
		// 确保滚动到底部
		nextTick(() => {
			scrollToBottom()
		})
	}
}

const form = reactive({
	type: 1,
	conversation_id: '',
	query: '',
	local_files: []
})

const models = [
	{
		value: 1,
		label: 'Deepseek',
		icon: deepseekicon,
		icon2: deepseekicon2,
		icon3: deepseekicon3
	},
	{ value: 2, label: '通义千问', icon: qianwenicon, icon2: qianwenicon2, icon3: qianwenicon3 },
	{ value: 3, label: '豆包', icon: doubaoicon, icon2: doubaoicon2, icon3: doubaoicon3 }
]

const handleSelect = command => {
	form.type = command
}

const showfilelist = ref(false)
const isfilesList = ref(false)
const bottomJt = ref(false)
const filesBox = ref(null)
const filesList = ref(null)
const filesListArrayId = ref([])
const filesListArrayAllId = ref([])

const fileDel = id => {
	form.local_files = form.local_files.filter(item => item.uid !== id)
	filesListArrayId.value.push(id)
	isfilesList.value = form.local_files.length > 0 ? true : false
	nextTick(() => {
		if (filesBox.value) {
			bottomJt.value = filesBox.value.offsetHeight > 60
		}
	})
}

const goBottom = () => {
	nextTick(() => {
		if (filesBox.value && filesList.value) {
			filesList.value.scrollTop = filesBox.value.offsetHeight
		}
	})
}

const handleFileChange = (file, fileList) => {
	// 1. 检查文件大小（限制 1MB）
	const maxSize = 10 * 1024 * 1024 // 1MB
	const sizeValid = file.size <= maxSize
	if (!sizeValid) {
		ElMessage.error(`${file.name} 超过 10MB 限制！`)
		// 移除超限文件
		fileList = fileList.filter(f => f.uid !== file.uid)
		return
	}

	if(filesListArrayId.value.length > 0) {
		filesListArrayId.value.forEach((item, index) => {
			fileList = fileList.filter(f => f.uid !== item)
			filesListArrayAllId.value.push(item.uid)
		})
	}
	// 2. 检查文件名是否重复
	const fileNameList = fileList.map(f => f.name)
	const hasDuplicate = fileNameList.some((name, index) => fileNameList.indexOf(name) !== index)
	if (hasDuplicate) {
		ElMessage.error(`${file.name} 文件名重复，请修改后重新上传！`)
		// 移除重复文件（保留第一个，移除后续重复文件）
		const uniqueFileList = fileList.filter((f, i, arr) => i === arr.findIndex(item => item.name === f.name))
		fileList = uniqueFileList
	}
	form.local_files = []
	fileList.forEach((item, index) => {
		form.local_files.push(item.raw)
	})
	isfilesList.value = form.local_files.length > 0 ? true : false
	nextTick(() => {
		if (filesBox.value) {
			bottomJt.value = filesBox.value.offsetHeight > 60
		}
	})
}

// 问答
// 响应数据
const responseText = ref('')
const responseHtml = ref('')
const loading = ref(false)
const isStreaming = ref(false)
const itemArrayObj = reactive({
	itemArray: []
})
// 配置 marked
marked.setOptions({
	breaks: true,
	gfm: true
})

// 处理深度思考内容的渲染
const processThinkContent = html => {
	// 将 <think> 标签转换为特定样式的容器
	return html.replace(
		/<think>([\s\S]*?)<\/think>/g,
		'<div class="think-container"><div class="think-label">深度思考</div><div class="think-content">$1</div></div>'
	)
}
const processThinkContentOutText = html => {
	// 将 <think> 标签转换为特定样式的容器
	return html.replace(/<think>([\s\S]*?)<\/think>/g, '')
}

// 监听响应文本变化
watch(responseText, newVal => {
	if (newVal) {
		console.log(newVal, '--------new val')
		// 将 markdown 转换为 HTML
		const rawHtml = marked.parse(newVal)
		// 处理深度思考内容

		// responseHtml.value = processThinkContent(rawHtml)
		// itemArrayObj.itemArray.unshift({
		// 	compiledMarkdown: form.query,
		// 	content: responseHtml.value
		// })
		itemArrayObj.itemArray[itemArrayObj.itemArray.length - 1].compiledMarkdown = processThinkContent(rawHtml)
		itemArrayObj.itemArray[itemArrayObj.itemArray.length - 1].title = form.query
		itemArrayObj.itemArray[itemArrayObj.itemArray.length - 1].loading = true
		itemArrayObj.itemArray[itemArrayObj.itemArray.length - 1].textcopy = processThinkContentOutText(rawHtml).replace(/<[^>]*>/g, '')
		itemArrayObj.itemArray[itemArrayObj.itemArray.length - 1].htmlcopy = processThinkContentOutText(rawHtml)
			// 确保滚动到底部
			nextTick(() => {
				scrollToBottom()
			})
	}
})

// 监听isFullPage变化，发射事件给父组件
watch(isFullPage, newVal => {
	emit('update:isFullPage', newVal)
})

// 滚动到底部
const scrollToBottom = () => {
	const container = document.querySelector('.content')
	if (container) {
		container.scrollTop = container.scrollHeight
	}
}

// 获取数据
let lastChunk = '' // 保存上次的chunk片段
const fetchData = async () => {
	isFullPage.value = true
	emit('update:isFullPage', true)
	if (loading.value) return
	if (!form.query) {
		ElMessage.error('请输入文本内容！')
		return
	}
	itemArrayObj.itemArray.push({
		compiledMarkdown: '',
		title: form.query,
		loading: true,
		filearray: form.local_files,
		textcopy: '',
		htmlcopy: ''
	})
	isShow.value = false
	loading.value = true
	isStop.value = true
	isStreaming.value = true
	responseText.value = ''
	const formData = new FormData()
	formData.append('type', form.type)
	formData.append('conversation_id', form.conversation_id)
	formData.append('query', form.query)
	if (form.local_files.length > 0) {
		form.local_files.forEach((item, index) => {
			formData.append('local_files', item)
		})
	}
	try {
		const response = await axios({
			method: 'POST',
			url: import.meta.env.VITE_API_URL + '/api/home/completions/',
			headers: {
				Authorization: store.userStore.token
			},
			data: formData,
			responseType: 'text',
			onDownloadProgress: progressEvent => {
				console.log('---------988888', progressEvent)
				if (!progressEvent.currentTarget) return

				// 获取当前响应文本（注意：这不是真正的流式，而是进度事件）
				const currentText = progressEvent.currentTarget.response || ''

				// 找出新增的部分（hack方式）
				let newData = currentText.substring(lastChunk.length)
				console.log(newData, '--------newData')
				lastChunk = currentText

				// 处理新增数据
				processStreamData(newData)
			}
		})
		if (response.data.code) {
			ElMessage.error(response.data.msg)
			loading.value = false
			isStop.value = false
			isStreaming.value = false
			itemArrayObj.itemArray[itemArrayObj.itemArray.length - 1].loading = false
		}
	} catch (error) {
		console.error('请求失败:', error)
		ElMessage.error('请求失败，请检查网络连接')
		loading.value = false
		isStop.value = false
		itemArrayObj.itemArray[itemArrayObj.itemArray.length - 1].loading = false
		isStreaming.value = false
	}
}

// 处理流式数据
// let content = ''
const processStreamData = chunk => {
	try {
		// 这里需要根据实际的流式数据格式进行解析
		// 假设数据是以换行符分隔的 JSON 字符串
		const lines = chunk.split('\n')
		lines.forEach(line => {
			if (line.trim() && line.startsWith('data: ')) {
				const dataStr = line.replace('data: ', '')
				if (JSON.parse(dataStr).event === 'message_end' || dataStr.includes('message_end')) {
					// 流结束
					loading.value = false
					isStop.value = false
					itemArrayObj.itemArray[itemArrayObj.itemArray.length - 1].loading = false
					isStreaming.value = false
					return
				}

				try {
					const data = JSON.parse(dataStr)
					// 根据实际API响应结构调整
					const content = data.choices?.[0]?.delta?.answer || data.answer || ''
					form.conversation_id = data.conversation_id
					taskId.value = data.task_id
					//   console.log(content)
					if (content) {
						responseText.value += content
					}
				} catch (e) {
					// 忽略解析错误
				}
			}
		})
	} catch (error) {
		console.error('数据处理错误:', error)
	}
}

// 清空响应
const clearResponse = () => {
	responseText.value = ''
	responseHtml.value = ''
	isStreaming.value = false
}
</script>

<style scoped lang="scss">
* {
	margin: 0;
	padding: 0;
}
.fl {
	float: left;
}

.fr {
	float: right;
}
.cl:after,
.clearfix:after {
	content: '\20';
	display: block;
	height: 0;
	clear: both;
	visibility: hidden;
}

.cl,
.clearfix {
	zoom: 1;
}
.model-dropdown {
	:deep(.el-dropdown-menu__item) {
		line-height: 26px;
		img {
			margin-right: 5px;
		}
	}
	.is-active {
		.model-text {
			color: #4b85ff;
		}
	}
}
.homepage.fullpage {
	height: calc(100vh - 90px);
}
.homepage {
	width: 100%;
	// height: auto;
	height: calc(100%);
	// min-height: 840px;
	display: flex;
	// justify-content: space-between;
	justify-content: start;
	align-items: center;
	flex-direction: column;
	position: relative;
	.kong {
		width: 100%;
		height: 60px;
	}
	.title-nav-bg {
		width: 100%;
		height: 90px;
		background: url('@/assets/title-nav-bg.png') no-repeat center top;
		float: left;
		position: relative;
		top: 0;
		left: 0;
		.title-text {
			width: 973px;
			height: 100%;
			margin: 0 auto;
			line-height: 28px;
			font-size: 18px;
			font-weight: bold;
			color: #335867;
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			justify-content: center;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2; /* 限制显示的行数 */
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.history-btn {
			position: absolute;
			right: 20px;
			top: 20px;
			width: 97px;
			height: 42px;
			border-radius: 10px;
			background: #fff;
			font-size: 15px;
			color: #666666;
			text-align: center;
			line-height: 42px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			:deep(.el-icon) {
				margin-right: 10px;
			}
		}
	}
	.title-shadow {
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.04);
	}
	.hyy-box {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		// margin-top: 140px;
		// display: none;
		// position: absolute;
		.user-box {
			font-size: 50px;
			color: #121212;
			font-weight: bold;
		}
		.hyy-text {
			font-size: 34px;
			font-weight: bold;
			color: #121212;
			span {
				background: linear-gradient(90deg, #2868ff 0%, #ff8bf1 100%);
				background-clip: text;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
			}
		}
	}
	.form-box {
		width: 973px;
		// height: 230px;
		// background: url('@/assets/form-bg.png') no-repeat center top;
		height: auto;
		border: 1px solid #3559FF;
		border-radius: 14px;
		// background-size: 100%;
		padding: 10px;
		background: #fff;
		box-sizing: border-box;
		.form-class {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			:deep(.el-form-item__content) {
				justify-content: space-between;
				.files-list {
					width: 933px;
					height: 50px;
					padding-right: 20px;
					box-sizing: border-box;
					margin-top: 5px;
					overflow: auto;
					position: relative;
					.tips-zs {
						position: absolute;
						right: 0;
						top: 0;
						cursor: pointer;
						animation: float 1s ease-in-out infinite;
					}
					@keyframes float {
						0%,
						100% {
							transform: translate(0, 0) translateY(0);
						}
						50% {
							transform: translate(0, 0) translateY(10px);
						}
					}
					.files-box {
						width: 100%;
						height: auto;
						display: flex;
						align-items: center;
						flex-wrap: wrap;
						padding-top: 10px;
						box-sizing: border-box;
						.files-item {
							display: flex;
							align-items: center;
							border-radius: 5px;
							background: #e6e8f8;
							padding: 0 5px;
							margin-right: 10px;
							margin-bottom: 10px;
							color: rgba(51, 51, 51, 0.5);
							position: relative;
							.el-icon {
								position: absolute;
								right: -6px;
								top: -6px;
								border: 1px solid #fff;
								border-radius: 50%;
								cursor: pointer;
							}
						}
					}
				}
				.files-list::-webkit-scrollbar {
					width: 0px; /* 或任何非常小的值 */
					height: 0px;
					background: transparent; /* 透明背景 */
				}

				.files-list::-webkit-scrollbar-thumb {
					background: transparent; /* 滚动条的“滑块”也透明 */
				}
				.text-input {
					.el-textarea__inner {
						box-shadow: none;
						// height: 140px;
						height: auto;
					}
				}
				.mheigth {
					.el-textarea__inner {
						// height: 70px;
						height: auto;
					}
				}
				.send-box {
					display: flex;
					align-items: center;
					.send-btn {
						width: 90px;
						height: 40px;
						border-radius: 10px;
						background: #e7edff;
						color: #3559ff;
						font-size: 17px;
						font-weight: bold;
					}
					.stop-box {
						width: 30px;
						height: 30px;
						background: #4d6bfe;
						border-radius: 14px;
						cursor: pointer;
						display: flex;
						align-items: center;
						justify-content: center;
						.stop-in {
							width: 12px;
							height: 12px;
							background: #ffffff;
						}
					}
					.upload-btn {
						margin-right: 10px;
						height: 30px;
						.el-icon {
							font-size: 30px;
							color: #4c4c4c;
							font-weight: bold;
						}
					}
				}

				.trigger-btn {
					width: 40px;
					height: 40px;
					img {
						width: 30px;
						height: 30px;
					}
				}
			}
		}
	}
	.module-box {
		width: 100%;
		height: auto;
		margin-top: 36px;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		// display: none;
		.module-item {
			width: 413px;
			height: 140px;
			margin: 0 8px 16px;
			color: rgba(51, 51, 51, 0.6);
			font-size: 17px;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			padding: 23px 29px;
			box-sizing: border-box;
			cursor: pointer;
		}
		.bwxz {
			background: url('@/assets/bwxz-bg.png') no-repeat center top;
		}
		.szr {
			background: url('@/assets/szr-bg.png') no-repeat center top;
		}
		.fxpg {
			background: url('@/assets/fxpg-bg.png') no-repeat center top;
		}
		.yztw {
			background: url('@/assets/yztw-bg.png') no-repeat center top;
		}
		.ljfxfx {
			background: url('@/assets/ljfxfx-bg.png') no-repeat center top;
		}
		.fzl {
			background: url('@/assets/fzl-bg.png') no-repeat center top;
		}
	}
	.content {
		width: 973px;
		height: calc(100vh - 300px);
		display: flex;
		flex-direction: column;
		// justify-content: flex-end;
		flex: 1;
		margin-bottom: 20px;
		// padding-left: 20px;
		box-sizing: border-box;
		overflow-y: auto;
		position: relative;
		padding-top: 20px;
		.content-item {
			width: 100%;
			display: flex;
			flex-direction: column;
			margin-bottom: 50px;
			.ans {
				width: 100%;
				height: auto;
				display: flex;
				justify-content: flex-end;
				.ans-text-box {
					display: flex;
					flex-direction: column;
					align-items: end;
					.ans-file-list {
						width: 100%;
						height: auto;
						display: flex;
						align-items: center;
						justify-content: flex-end;
						flex-wrap: wrap;
						padding-top: 10px;
						box-sizing: border-box;
						.ans-file-item {
							display: flex;
							align-items: center;
							border-radius: 5px;
							background: #e6e8f8;
							padding: 5px 10px;
							margin-right: 10px;
							margin-bottom: 10px;
							color: rgba(51, 51, 51, 0.5);
							position: relative;
						}
						// .ans-file-item:last-child {
						// 	margin-right: 0;
						// }
					}
					.ans-title {
						width: auto;
						max-width: 390px;
						height: auto;
						border-radius: 20px;
						background: #4763e4;
						padding: 9px 15px;
						box-sizing: border-box;
						line-height: 28px;
						font-size: 16px;
						text-align: left;
						color: #fff;
					}
				}
			}
			.ask {
				width: 100%;
				margin-top: 10px;
				.response-content {
					width: 100%;
					height: auto;
					font-size: 16px;
					color: #333333;
					line-height: 28px;
					padding-top: 15px;
					line-height: 2.5;
					:deep(hr) {
						margin: 20px 0;
						height: 1px;
						border: none;
						background: gray;
					}
					:deep(h3) {
						margin-top: 10px;
					}
					:deep(h4) {
						margin-top: 10px;
					}
					:deep(table) {
						border-collapse: collapse;
						width: 100%;
						border: 1px solid #333333;
						box-sizing: border-box;
						overflow-x: auto;
					}
					:deep(th),
					:deep(td) {
						border: 1px solid #333333;
						padding: 8px;
						text-align: left;
						// white-space: nowrap;
						word-break: break-word; /* 允许长单词或URL换行 */
						overflow-wrap: break-word;
					}
					:deep(.think-container) {
						width: 100%;
						font-size: 13px;
						.think-label {
							font-weight: bold;
							color: #1890ff;
							margin-bottom: 8px;
							font-size: 14px;
							display: flex;
							align-items: center;
						}

						.think-label::before {
							content: '💭';
							margin-right: 6px;
						}
						.think-content {
							display: flex;
							flex-direction: column;
							gap: 10px;
							margin: 0;
							line-height: 2;
							// border-left: 2px solid #e5e5e5;
							margin-bottom: 10px;
							text-align: justify;
							color: #8b8b8b;
							padding: 10px 0;
							// margin-top: -40px;
						}
					}
					:deep(think) {
							display: flex;
							flex-direction: column;
							gap: 10px;
						margin: 0;
						line-height: 2;
						// border-left: 2px solid #e5e5e5;
						margin-bottom: 10px;
						text-align: justify;
						color: #8b8b8b;
						padding: 10px 0;
						font-size: 13px;
					}
					:deep(think)::before {
						content: '💭深度思考中~';
					}
					:deep(code) {
						background-color: #f4f4f5;
						padding: 2px 6px;
						border-radius: 3px;
						font-family: 'Courier New', monospace;
						color: #f56c6c;
					}

					:deep(pre) {
						background-color: #282c34;
						color: #abb2bf;
						padding: 16px;
						border-radius: 6px;
						overflow-x: auto;
						margin: 1em 0;
					}

					:deep(pre code) {
						background: none;
						color: inherit;
						padding: 0;
					}

					:deep(blockquote) {
						border-left: 4px solid #409eff;
						padding-left: 16px;
						margin: 1em 0;
						color: #606266;
						background-color: #f0f7ff;
					}
					:deep(ul),
					:deep(ol) {
						padding-left: 2em;
					}
				}
				.loading-container {
					display: flex;
					align-items: center;
					gap: 8px;
					color: #909399;
					padding: 10px 0;
				}
				.yqts {
					font-size: 14px;
					color: #808fd1;
					line-height: 28px;
					font-style: italic;
				}
				.ag {
					width: 100%;
					margin-top: 2px;
					display: flex;
					align-items: center;
					span {
						color: #1971eb;
						font-size: 12px;
						cursor: pointer;
					}
					.copy-box {
						width: 26px;
						height: 26px;
						padding: 6px;
						box-sizing: border-box;
						// float: right;
						margin-right: 10px;
						cursor: pointer;
						border-radius: 2px;
						.down-word {
							color: #3884ef;
							font-size: 18px;
						}
					}
					.copy-box:hover {
						background: #e1f3fd;
					}
				}
				.typing-cursor {
					display: inline-block;
					animation: blink 1s infinite;
					color: #409eff;
					font-weight: bold;
				}
				@keyframes blink {
					0%,
					50% {
						opacity: 1;
					}
					51%,
					100% {
						opacity: 0;
					}
				}
			}
		}
	}
	.content::-webkit-scrollbar {
		width: 5px;
		height: 10px;
	}
	.content::-webkit-scrollbar-thumb {
		background: transparent;
		border-radius: 10px;
		cursor: pointer;
		border: none;
	}
	.content:hover::-webkit-scrollbar-thumb {
		background: #c1c2c6;
		border-radius: 10px;
		cursor: pointer;
		border: none;
	}
	.content::-webkit-scrollbar-corner,
	.content::-webkit-scrollbar-track {
		background: transparent;
		border: none;
	}
	.history-list {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-right: 10px;
		:deep(.el-card) {
			margin-bottom: 10px;
			cursor: pointer;
			.formatTime {
				margin-top: 10px;
			}
		}
		.loading-text,
		.no-more-text {
			width: 100%;
			height: 40px;
			line-height: 40px;
			text-align: center;
		}
	}
}
</style>
