<template>
  <div class="write-container">
    <div class="write-header">
      <div class="history-btn">历史稿件</div>
    </div>
    
    <div class="write-title">
      <h1>AI写稿</h1>
      <p>多种场景，润色校对，一键成文</p>
    </div>
    
    <div class="scene-tabs">
      <div 
        v-for="scene in scenes" 
        :key="scene.id"
        class="scene-tab"
        :class="{ active: activeScene === scene.id }"
        @click="switchScene(scene.id)"
      >
        {{ scene.name }}
      </div>
    </div>
    
    <div class="prompt-box">
      <div class="form-box">
			<el-form :model="form" class="form-class">
				<el-form-item v-if="isfilesList" class="files-input-c">
					<div class="files-list" ref="filesList">
						<div class="files-box" ref="filesBox">
							<!-- <span class="tips-text">已上传文件：{{ formData.local_files.length }}</span> -->
							<div class="file-item-enhanced" v-for="(item, index) in formData.local_files" :key="index">
								<div class="file-icon">
									<!-- <img src="@/assets/file-icon-up.png" alt="文件图标" class="file-icon-img" /> -->
									<el-icon><Document /></el-icon>
								</div>
								<div class="file-info">
									<div class="file-name">{{ item.name }}</div>
								</div>
								<el-button 
									size="small" 
									class="file-remove-btn"
									@click="fileDel(item.uid)"
								>
									<el-icon><CircleCloseFilled /></el-icon>
								</el-button>
							</div>
						</div>
						<el-tooltip class="box-item" effect="light" content="向下滚动" placement="top" v-if="bottomJt">
							<el-icon class="tips-zs" @click="goBottom"><Bottom /></el-icon>
						</el-tooltip>
					</div>
				</el-form-item>
				<el-form-item class="div-input text-input-c">
					<div 
						ref="editableDiv"
						:class="['text-input', isfilesList ? 'mheigth' : '']"
						:contenteditable="wContenteditable"
						@input="handleInput"
						@focus="handleFocus"
						@blur="handleBlur"
						@keydown.delete="handleDelete"
					>
						<span class="tips-text">帮我写一篇新闻消息，文章标题是</span>
						<span ref="editable1" contenteditable='true' class="tips-text-input blue-tips" tabindex="0" :data-placeholder="placeholder1" @focus="logFocus" @blur="logBlur"></span>
						<span class="tips-text">，文章篇幅</span>
						<span contenteditable='true' class="tips-text-input blue-tips" tabindex="0" :data-placeholder="placeholder2" @focus="logFocus" @blur="logBlur"></span>
						<span class="tips-text">，风格</span>
						<select class="tips-select blue-tips" v-model="styleValue" @change="styleValueChange">
							<option value="">请选择</option>
							<option value="正式">正式</option>
							<option value="轻松">轻松</option>
							<option value="专业">专业</option>
							<option value="权威">权威</option>
							<option value="犀利">犀利</option>
							<option value="客观">客观</option>
						</select>
						<span class="tips-text">，消息概述为</span>
						<span contenteditable='true' class="tips-text-input blue-tips" tabindex="0" :data-placeholder="placeholder4" @focus="logFocus" @blur="logBlur"></span>
						<span class="tips-text">，事件描述为</span>
						<span contenteditable='true' class="tips-text-input blue-tips" tabindex="0" :data-placeholder="placeholder4" @focus="logFocus" @blur="logBlur"></span>
						<span class="tips-text">，新闻价值与社会影响为</span>
						<span contenteditable='true' class="tips-text-input blue-tips" tabindex="0" :data-placeholder="placeholder4" @focus="logFocus" @blur="logBlur"></span>
						<span class="tips-text">，其他要求</span>
						<span contenteditable='true' class="tips-text-input blue-tips" tabindex="0" :data-placeholder="placeholder4" @focus="logFocus" @blur="logBlur"></span>
						<span class="tips-text">。</span>
					</div>
					<!-- <div 
						v-else
						ref="editableDiv"
						:class="['text-input', isfilesList ? 'mheigth' : '']"
						:contenteditable="wContenteditable"
						@input="handleInput"
						@focus="handleFocus"
						@blur="handleBlur"
						@keydown.delete="handleDelete"
					>
						<img src="@/assets/gjfx-input-icon.png" alt="">
						<span class="tips-text tips-text-input" :data-placeholder="placeholder"></span>
					</div> -->
				</el-form-item>
			</el-form>
		</div>
      <div class="prompt-buttons">
        <div class="prompt-buttons-left">
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
                    <el-button>
                        <el-icon><Link /></el-icon>添加参考文档
                    </el-button>
                </el-tooltip>
            </el-upload>
            <el-button class="prompt-btn" :type="formData.deepThink ? 'primary' : 'default'"  @click="deepThink">深度思考</el-button>
            <el-button class="prompt-btn" :type="formData.online ? 'primary' : 'default'" @click="searchOnline">联网搜索</el-button>
        </div>
        <el-button class="send-btn" :loading="loading" @click="fetchData" type="primary">
            <el-icon v-if="!loading"><Promotion /></el-icon>
            开始写稿
        </el-button>
        <el-tooltip v-if="isStop" content="停止生成" placement="top" effect="dark">
            <div @click="stopChat" class="stop-box">
                <div class="stop-in"></div>
            </div>
        </el-tooltip>
      </div>
      
      <!-- 参考资料区域 -->
      <div class="reference-section">
        <div class="structure-reference">
          <div class="reference-header">
            <span class="reference-title">结构参考 1/1</span>
            <el-button size="small" type="primary" plain class="add-button">+</el-button>
          </div>
          <div class="reference-item">
            <div class="reference-tabs">
              <el-button size="small" type="primary" plain @click="switchStructureTab('local')">本地</el-button>
              <el-button size="small" plain @click="switchStructureTab('case')">案例</el-button>
            </div>
            
            <!-- 本地参考上传区域 -->
            <div v-if="structureTab === 'local'" class="reference-content">
              <el-upload
                v-model:file-list="structureLocalFiles"
                class="structure-upload"
                action="#"
                :auto-upload="false"
                :on-change="handleStructureFileChange"
                accept=".pdf,.PDF,.doc,.docx,.xlsx,.xls"
				:show-file-list="false"
              >
                <el-button size="small" type="primary" plain>
                  <el-icon><Upload /></el-icon>上传附件
                </el-button>
              </el-upload>
              <div class="file-list-container" v-if="structureLocalFiles.length > 0">
                <div 
                  v-for="file in structureLocalFiles" 
                  :key="file.uid"
                  class="file-item-enhanced"
                >
                  <div class="file-icon">
					<el-icon><Document /></el-icon>
                    <!-- <img src="@/assets/file-icon-up.png" alt="文件图标" class="file-icon-img" /> -->
                  </div>
                  <div class="file-info">
                    <div class="file-name">{{ file.name }}</div>
                  </div>
                  <el-button 
                    size="small" 
                    class="file-remove-btn"
                    @click="removeStructureFile(file.uid)"
                  >
                    <el-icon><CircleCloseFilled /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
            
            <!-- 案例参考选择区域 -->
            <div v-else-if="structureTab === 'case'" class="reference-content">
              <el-select 
                v-model="selectedStructureCase" 
                placeholder="选择案例" 
                size="small"
                style="width: 200px"
              >
                <el-option 
                  v-for="caseItem in structureCases" 
                  :key="caseItem.id" 
                  :label="caseItem.title" 
                  :value="caseItem.id"
                >
                  <span style="font-size: 12px">{{ caseItem.title }} ({{ caseItem.wordCount }}字)</span>
                </el-option>
              </el-select>
            </div>
            
            <div class="reference-word-count">{{ structureWordCount }} 字</div>
            <el-button size="small" class="remove-button">
              <el-icon><CircleCloseFilled /></el-icon>
            </el-button>
          </div>
        </div>
        
        <div class="content-reference">
          <div class="reference-header">
            <span class="reference-title">内容参考 {{ contentReferences.length }}/10</span>
            <el-button size="small" type="primary" plain class="add-button" @click="addContentReference">+</el-button>
          </div>
          
          <div 
            v-for="(ref, index) in contentReferences" 
            :key="index"
            class="reference-item"
          >
            <div class="reference-tabs">
              <el-button 
                size="small" 
                :type="ref.tab === 'local' ? 'primary' : 'default'" 
                plain
                @click="switchContentTab(index, 'local')"
              >
                本地
              </el-button>
              <el-button 
                size="small" 
                :type="ref.tab === 'case' ? 'primary' : 'default'" 
                plain
                @click="switchContentTab(index, 'case')"
              >
                案例
              </el-button>
            </div>
            
            <!-- 本地参考上传区域 -->
            <div v-if="ref.tab === 'local'" class="reference-content">
              <div class="local-upload-container">
                <div class="upload-area">
                  <el-upload
                    v-model:file-list="ref.localFiles"
                    class="content-upload"
                    action="#"
                    :auto-upload="false"
                    :on-change="(file, fileList) => handleContentFileChange(index, file, fileList)"
                    accept=".pdf,.PDF,.doc,.docx,.xlsx,.xls"
					:show-file-list="false"
                  >
                    <el-button size="small" type="primary" plain>
                      <el-icon><Upload /></el-icon>上传附件
                    </el-button>
                  </el-upload>
                </div>
                
                <div class="file-list-container" v-if="ref.localFiles.length > 0">
                  <div 
                    v-for="file in ref.localFiles" 
                    :key="file.uid"
                    class="file-item-enhanced"
                  >
                    <div class="file-icon">
						<el-icon><Document /></el-icon>
                      <!-- <img src="@/assets/file-icon-up.png" alt="文件图标" class="file-icon-img" /> -->
                    </div>
                    <div class="file-info">
                      <div class="file-name">{{ file.name }}</div>
                    </div>
                    <el-button 
                      size="small" 
                      class="file-remove-btn"
                      @click="removeContentFile(index, file.uid)"
                    >
                      <el-icon><CircleCloseFilled /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 案例参考选择区域 -->
            <div v-else-if="ref.tab === 'case'" class="reference-content">
              <el-select 
                v-model="ref.selectedCase" 
                placeholder="选择案例" 
                size="small"
                style="width: 200px"
              >
                <el-option 
                  v-for="caseItem in contentCases" 
                  :key="caseItem.id" 
                  :label="caseItem.title" 
                  :value="caseItem.id"
                >
                  <span style="font-size: 12px">{{ caseItem.title }} ({{ caseItem.wordCount }}字)</span>
                </el-option>
              </el-select>
            </div>
            
            <div class="reference-word-count">{{ ref.wordCount }} 字</div>
            <el-button size="small" class="remove-button" @click="removeContentReference(index)">
              <el-icon><CircleCloseFilled /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="recent-articles">
      <h3>最近稿件</h3>
      <div class="articles-grid">
        <div 
          v-for="(article, index) in recentArticles" 
          :key="index"
          class="article-card"
        >
          <h4>{{ article.title }}</h4>
          <p>{{ article.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { ElButton, ElInput, ElSelect, ElOption, ElForm, ElFormItem, ElUpload } from 'element-plus'
import { Loading, Link, Promotion, Clock, Bottom, CircleCloseFilled, VideoPause, Service, CopyDocument, Download, Upload, Document } from '@element-plus/icons-vue'

const showfilelist = ref(false)
const isfilesList = ref(false)
const filesBox = ref(null)
const filesList = ref(null)
const filesListArrayId = ref([])
const filesListArrayAllId = ref([])
const wContenteditable = ref(true)
const bottomJt = ref(false)
const editableDiv = ref(null);

onMounted(() => {
	nextTick(() => {
		updateQuery();
	});
});

const fileDel = id => {
    formData.local_files = formData.local_files.filter(item => item.uid !== id)
    filesListArrayId.value.push(id)
    isfilesList.value = formData.local_files.length > 0 ? true : false
    nextTick(() => {
        if (filesBox.value) {
            bottomJt.value = filesBox.value.offsetHeight > 60
        }
    })
}

const handleFileChange = (file, fileList) => {
	debugger
	// 1. 检查文件大小（限制 1MB）
	if (file) {
		const maxSize = 10 * 1024 * 1024 // 10MB
		const sizeValid = file.size <= maxSize
		if (!sizeValid) {
			ElMessage.error(`${file.name} 超过 10MB 限制！`)
			// 移除超限文件
			fileList = fileList.filter(f => f.uid !== file.uid)
			return
		}
	}
	if (filesListArrayId.value.length > 0) {
		filesListArrayId.value.forEach((item, index) => {
			fileList = fileList.filter(f => f.uid !== item)
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
	formData.value.local_files = []
	fileList.forEach((item, index) => {
		// 保留完整的文件对象，包含uid属性
		formData.value.local_files.push({
			name: item.name,
			uid: item.uid,
			raw: item.raw
		})
		filesListArrayAllId.value.push(item.uid)
	})
	isfilesList.value = formData.value.local_files.length > 0 ? true : false
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

const handleInput = (e) => {
	placeholder.value = ''
	if(!e.target.innerText) {
		placeholder.value = '请输入稿件分析的具体要求。示例：请帮我对稿件内容进行分析，要求客观公正，对稿件评分、标签、原创性等多维度分析。'
	}
  	text.value = e.target.innerText;
	updateQuery()
};

// 更新查询文本，排除下拉框的所有选项
const updateQuery = () => {
	if (!editableDiv.value) return;
	
	// 克隆div元素，以便安全操作
	const clone = editableDiv.value.cloneNode(true);
	
	// 移除克隆中的下拉框元素，并替换为选中的值
	const selectElements = clone.querySelectorAll('select');
	selectElements.forEach((select, index) => {
		// 获取对应下拉框的选中值
		let selectedValue = '';
		if (index === 0) {
			selectedValue = styleValue.value || '';
		}
		// 创建一个新的文本节点来替换下拉框
		const textNode = document.createTextNode(selectedValue);
		select.parentNode.replaceChild(textNode, select);
	});
	
	// 获取处理后的文本
	formData.query = clone.innerText;
};

// 当风格下拉框值变化时，更新查询文本
const styleValueChange = () => {
	updateQuery();
};
const text = ref('');
const text1 = ref('')
const text2 = ref('')
const text3 = ref('')
const placeholder1 = ref('【请输入标题】')
const placeholder2 = ref('【请输入字数】')
const placeholder3 = ref('【请选择】')
const placeholder = ref('请输入稿件分析的具体要求。示例：请帮我对稿件内容进行分析，要求客观公正，对稿件评分、标签、原创性等多维度分析。')
const placeholder4 = ref('【请输入】')
const styleValue = ref('')

const fetchData = () => {
	debugger
	const form = new FormData()
	form.append('type', formData.value.type)
	// form.append('conversation_id', isactive.value == 'creation' ? formData.conversation_id :'')
	form.append('conversation_id', formData.value.conversation_id)
	form.append('query', formData.value.query)
	
	// 添加结构参考案例id
	if (structureTab.value === 'case' && selectedStructureCase.value) {
		form.append('structure_case_id', selectedStructureCase.value)
	}
	
	// 添加内容参考案例id
	const contentCaseIds = contentReferences.value
		.filter(ref => ref.tab === 'case' && ref.selectedCase)
		.map(ref => ref.selectedCase)
	if (contentCaseIds.length > 0) {
		contentCaseIds.forEach((id, index) => {
			form.append(`content_case_ids[${index}]`, id)
		})
	}
	
	if (formData.value.local_files.length > 0) {
		formData.value.local_files.forEach((item, index) => {
			form.append('local_files', item.raw)
		})
	}
  console.log('获取数据')
}
const logFocus = () => {
	wContenteditable.value = false
};
const logBlur = () => {
	wContenteditable.value = true
}

// 获取焦点
const handleFocus = () => {
	wContenteditable.value = true
  console.log('获取焦点');
};

// 失去焦点
const handleBlur = () => {
  console.log('失去焦点');
};

// 处理删除键（可选）
const handleDelete = (e) => {
  if (!text.value) {
    console.log('无内容可删除');
  }
};

// 外部控制焦点
const focus = () => {
  editableDiv.value?.focus();
};

// 结构参考相关
const structureTab = ref('local')
const structureLocalFiles = ref([])
const structureCases = ref([
  { id: 1, title: '新闻消息结构模板', wordCount: 864 },
  { id: 2, title: '新闻发布稿结构模板', wordCount: 1200 },
  { id: 3, title: '政策解读结构模板', wordCount: 1500 }
])
const selectedStructureCase = ref('')
const structureWordCount = ref(864)

// 内容参考相关
const contentReferences = ref([])
const contentCases = ref([
  { id: 1, title: '经济新闻案例', wordCount: 500 },
  { id: 2, title: '科技新闻案例', wordCount: 600 },
  { id: 3, title: '社会新闻案例', wordCount: 700 },
  { id: 4, title: '体育新闻案例', wordCount: 400 },
  { id: 5, title: '娱乐新闻案例', wordCount: 350 }
])

// 切换结构参考标签
const switchStructureTab = (tab) => {
  structureTab.value = tab
  if (tab === 'case' && selectedStructureCase.value) {
    const selectedCase = structureCases.value.find(c => c.id === selectedStructureCase.value)
    if (selectedCase) {
      structureWordCount.value = selectedCase.wordCount
    }
  }
}

// 处理结构参考文件上传
const handleStructureFileChange = (file, fileList) => {
  structureLocalFiles.value = fileList
  // 模拟计算字数
  structureWordCount.value = Math.floor(Math.random() * 500) + 500
}

// 移除结构参考文件
const removeStructureFile = (uid) => {
  structureLocalFiles.value = structureLocalFiles.value.filter(file => file.uid !== uid)
  if (structureLocalFiles.value.length === 0) {
    structureWordCount.value = 0
  }
}

// 添加内容参考
const addContentReference = () => {
  if (contentReferences.value.length < 10) {
    contentReferences.value.push({
      tab: 'local',
      localFiles: [],
      selectedCase: '',
      wordCount: 0
    })
  }
}

// 移除内容参考
const removeContentReference = (index) => {
  contentReferences.value.splice(index, 1)
}

// 切换内容参考标签
const switchContentTab = (index, tab) => {
  contentReferences.value[index].tab = tab
  if (tab === 'case' && contentReferences.value[index].selectedCase) {
    const selectedCase = contentCases.value.find(c => c.id === contentReferences.value[index].selectedCase)
    if (selectedCase) {
      contentReferences.value[index].wordCount = selectedCase.wordCount
    }
  }
}

// 处理内容参考文件上传
const handleContentFileChange = (index, file, fileList) => {
  contentReferences.value[index].localFiles = fileList
  // 模拟计算字数
  contentReferences.value[index].wordCount = Math.floor(Math.random() * 300) + 200
}

// 移除内容参考文件
const removeContentFile = (index, uid) => {
  contentReferences.value[index].localFiles = contentReferences.value[index].localFiles.filter(file => file.uid !== uid)
  if (contentReferences.value[index].localFiles.length === 0) {
    contentReferences.value[index].wordCount = 0
  }
}

const scenes = [
  { id: 'news', name: '新闻消息' },
  { id: 'press', name: '新闻发布稿' },
  { id: 'policy', name: '政策解读' },
  { id: 'comment', name: '事件评论' },
  { id: 'speech', name: '讲话稿' }
]

const activeScene = ref('news')

const formData = ref({
  deepThink: true,
  online: true,
  type: 1,
  value: '',
  conversation_id: '',
  query: '',
  local_files: []
})

const deepThink = () => {
  console.log('深度思考')
  formData.value.deepThink = !formData.value.deepThink
}

const searchOnline = () => {
  console.log('联网搜索')
  formData.value.online = !formData.value.online
}


const switchScene = (sceneId) => {
  activeScene.value = sceneId
}

const recentArticles = ref([
  {
    title: '稿件标题稿件标题稿件标题',
    content: '稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文...'
  },
  {
    title: '稿件标题稿件标题稿件标题',
    content: '稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文...'
  },
  {
    title: '稿件标题稿件标题稿件标题',
    content: '稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文...'
  }
])
</script>

<style scoped>
.write-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.write-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.login-tip {
  background-color: #fff3cd;
  color: #856404;
  padding: 5px 15px;
  border-radius: 4px;
  font-size: 14px;
}

.history-btn {
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}

.write-title {
  text-align: center;
  margin-bottom: 40px;
}

.write-title h1 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
}

.write-title p {
  font-size: 16px;
  color: #666;
}

.scene-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #e8e8e8;
}

.scene-tab {
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.scene-tab:hover {
  color: #1890ff;
}

.scene-tab.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
  font-weight: bold;
}

.prompt-box {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 40px;
}

.prompt-form {
  margin-bottom: 20px;
}

.form-row {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.el-form-item {
  margin-bottom: 0px;
}

.prompt-buttons {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.prompt-buttons-left {
    display: flex;
    gap: 12px;
    width: 300px;
}

.prompt-btn {
  /* border: 1px solid #d9d9d9;
  background-color: #fff;
  color: #666;
  margin-left: 0; */
}

.start-btn {
  margin-left: auto;
}

.reference-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.structure-reference {
  margin-bottom: 20px;
}

.reference-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reference-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.add-button {
  min-width: 28px;
  padding: 0;
  height: 28px;
  line-height: 26px;
}

.reference-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.reference-tabs {
  display: flex;
  gap: 8px;
  margin-right: 10px;
}

.reference-word-count {
  margin: 0 auto;
  font-size: 14px;
  color: #666;
}

.remove-button {
  color: #999;
  padding: 0;
  min-width: 28px;
  height: 28px;
  line-height: 26px;
}

.content-reference {
  margin-top: 15px;
}

.content-reference .reference-header {
  border-top: 1px dashed #e8e8e8;
  padding-top: 15px;
  margin-top: 15px;
  margin-bottom: 0;
}

.reference-content {
  flex: 1;
  margin: 0 20px;
}

.structure-upload,
.content-upload {
  margin-bottom: 10px;
}

.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
}

.file-item {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.file-remove {
  margin-left: 5px;
  padding: 0;
  min-width: 20px;
  height: 20px;
  line-height: 18px;
}

.file-item span {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-list-container {
  margin-top: 8px;
}

.file-item-enhanced {
  display: flex;
  align-items: center;
  background-color: #e6e8f8;
  border-radius: 5px;
  padding: 4px 8px;
  margin-right: 10px;
  margin-bottom: 8px;
  font-size: 12px;
  color: rgba(51, 51, 51, 0.8);
  float: left;
}

.file-icon {
  margin-right: 6px;
}

.file-icon-img {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-remove-btn {
  margin-left: 4px;
  padding: 0;
  min-width: 16px;
  height: 16px;
  line-height: 14px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-remove-btn:hover {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
}

.recent-articles h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.article-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.article-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.article-card h4 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-card p {
  font-size: 14px;
  line-height: 1.5;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .scene-tabs {
    flex-wrap: wrap;
  }
  
  .prompt-buttons {
    flex-wrap: wrap;
  }
  
  .start-btn {
    margin-left: 0;
    width: 100%;
  }
}
.form-box {
		width: 100%;
		height: auto;
		border-radius: 14px;
		padding: 10px;
		box-sizing: border-box;
		.form-class {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.div-input {
				line-height: 11px;
			}
			:deep(.el-form-item__content) {
				/* justify-content: flex-end; */
				.files-list {
					width: 933px;
					padding-right: 20px;
					box-sizing: border-box;
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
								flex-wrap: wrap;
								padding-top: 10px;
								box-sizing: border-box;
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
					cursor: text;
					font-size: 16px;
					max-height: 70px;
    				overflow-y: auto;
					overflow-x: hidden;
					text-align: justify;
						cursor: text;
						img {
							width: 84px;
							height: 32px;
							margin-right: 10px;
							vertical-align: bottom;
						}
						.tips-text {
							color: #858585;
							font-size: 18px;
						}
						.tips-text-input {
							color: #3559FF;
							font-size: 18px;
							min-height: 1em;
							outline: none;
						}
						.tips-select {
								color: #3559FF;
								font-size: 18px;
								border: none;
								border-bottom: 1px solid #3559FF;
								background: transparent;
								outline: none;
								cursor: pointer;
								margin: 0 5px;
							}
							.tips-text-input:empty:before {
								content: attr(data-placeholder);
								color: #858585;
					}
					.blue-tips {
						width: auto;
						display: inline-block;
					}
					.blue-tips:empty:before {
					content: attr(data-placeholder);
					color: #3559FF;
					}
					.aixg-input-tag {
						padding: 6px 15px;
						color: #75643F;
						font-weight: bold;
						border-radius: 7.15px;
						background: #FFF9EC;
						margin-right: 20px;
					}
				}
				.mheigth {
					.el-textarea__inner {
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
			.text-input-c {
				:deep(.el-form-item__content){
					justify-content: space-between;
				}
			}
		}
	}
	.files-input-c {
		width: 100%;
	}
</style>