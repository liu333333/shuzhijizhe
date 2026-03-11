import { defineStore } from 'pinia'
import cache from '@/utils/cache'

export const appStore = defineStore('appStore', {
	state: () => ({
		// sidebar 是否展开
		sidebarOpened: cache.getSidebarOpened(),
		// 国际化
		language: cache.getLanguage(),
		// 组件大小
		componentSize: cache.getComponentSize(),
		// 主题
		theme: cache.getTheme(),
		// 成果形式：    论文、调研报告、著作、专题
		// 
		invoicingType:[
			{value:'0',label:'专票'},
			{value:'1',label:'普票'},
			{value:'2',label:'电子专票'},
			{value:'3',label:'电子普票'},
		],
		// 绩效状态0：未提交；1：待审核；2：已通过；3：不通过
		achievementStatus:[
			{value:'0',label:'未提交'},
			{value:'1',label:'待审核'},
			{value:'2',label:'已通过'},
			{value:'3',label:'不通过'},
		],
		// 状态 0:作废；1：待开票；2：开票待确认；3：开票已确认；
		kaipiaoStatus:[
			{value:'0',label:'作废'},
			{value:'1',label:'开票'},
			{value:'2',label:'开票中'},
			{value:'3',label:'已开票'},
		],
		/* del(100,"已删除"),
init(0,"草稿"),
rejected(1,"不通过"),
pendingApproval(10,"待审核"),
approving(20,"正在审核"),
pass(30,"审核通过"); */
		hetongStatus:[
			{value:'100',label:'已删除',type:0},
			{value:'0',label:'草稿',type:0},
			{value:'1',label:'不通过',type:0},
			{value:'10',label:'待审核',type:1},
			{value:'20',label:'正在审核',type:2},
			{value:'30',label:'审核通过',type:2},
		],
		/* 月份（1-12） */
		month:[
			{value:'1',label:'1月'},
			{value:'2',label:'2月'},
			{value:'3',label:'3月'},
			{value:'4',label:'4月'},
			{value:'5',label:'5月'},
			{value:'6',label:'6月'},
			{value:'7',label:'7月'},
			{value:'8',label:'8月'},
			{value:'9',label:'9月'},
			{value:'10',label:'10月'},
			{value:'11',label:'11月'},
			{value:'12',label:'12月'},
		],
		/* DELETE("0", "DELETE", "删除"),
    NEW("1", "NEW", "草稿"),
    BACK("2", "NEW", "退回"),
    WAIT_SUBMIT("3", "WAIT_SUBMIT", "待审核"),
    WAIT_SCORE("4", "WAIT_SCORE", "待打分"),
    ALREADY_SCORE("5", "ALREADY_SCORE", "已打分"); */
/* type 0 个人  1  审核  2打分 */
		NewsStatusConfig:[
			{value:'0',label:'删除',type:0},
			{value:'1',label:'草稿',type:0},
			{value:'2',label:'不通过',type:1},
			{value:'3',label:'待审核',type:2},
			{value:'4',label:'待打分',type:3},
			{value:'5',label:'已打分',type:3},
		],
		NewsMediaType:[
			{value:'0',label:'微信公众号',type:1},
			{value:'1',label:'微博',type:1},
			{value:'2',label:'海报',type:1},
			{value:'3',label:'视频号',type:1},
			{value:'4',label:'单条微博',type:1},
			{value:'5',label:'今日头条',type:1},
			{value:'6',label:'抖音',type:1},
			{value:'7',label:'微头条',type:1},
			{value:'8',label:'人民号',type:1},
			{value:'9',label:'快手',type:1},
			{value:'10',label:'日报',type:2},
			{value:'11',label:'周报',type:2},
			{value:'12',label:'月报',type:2},
			{value:'13',label:'季度报告',type:2},
			{value:'14',label:'年报',type:2},
			{value:'15',label:'专报',type:2},
		],
		AchievementMajor:[
		],
		// 奖励等级
		jldjoptions:[
		],
		// 奖项名称
		jxnameoptions:[
		], 
		// 单位类型 行政机关 事业单位 高校 科研院所 行业协会 企业 其他
		companytypeoptions:[
		],
		// 成果应用,采纳情况
		businessType:[
		],
		// 申报状态
		/* 0待提交，1待审核，20审核不通过，21审核通过，31入围，41获奖 */
		searchsbztoptions:[
		],
		searchsbztoptions1:[
		],
		sbztoptions:[
		],

		administrativeLevel:[
		],
		professionalLevel:[
		],
		projects:[],//奖项等级
		AxiosPool:{},//正在访问的请求池


	}),
	persist: { //  固化插件
	  enabled: true, // 开启存储
		strategies: [ // 指定存储的位置以及存储的变量都有哪些，该属性可以不写，
			//在不写的情况下，默认存储到 sessionStorage 里面,默认存储 state 里面的所有数据。
			{ storage: localStorage, paths: ["AchievementType"] },
			// paths 是一个数组，如果写了 就会只存储 count 变量，当然也可以写多个。
		]
	},
	actions: {
		setSidebarOpened() {
			this.sidebarOpened = !this.sidebarOpened
			cache.setSidebarOpened(this.sidebarOpened)
		},
		setLanguage(locale) {
			this.language = locale
			cache.setLanguage(locale)
		},
		setComponentSize(size) {
			this.componentSize = size
			cache.setComponentSize(size)
		},
		setTheme(theme) {
			this.theme = theme
			cache.setTheme(theme)
		},
		setAchievementMajor(data) {
			this.AchievementMajor = data
		},
		setProfessional(data) {
			this.professionalLevel = data
		},
		setAdministrative(data) {
			this.administrativeLevel = data
		},
		setprojects(data) {
			this.projects = data
		},
		setAxiosPool(name){
			this.AxiosPool[name] = true
			// console.log(this.AxiosPool,'-AxiosPool---');
		},
		delAxiosPool(name){
			// console.log(this.AxiosPool,'-1AxiosPool---');
			delete this.AxiosPool[name]
			// console.log(this.AxiosPool,'-delAxiosPool---');
		},
	}
})
