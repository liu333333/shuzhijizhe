<template>
	<div class="login-container">
		<div class="login_left">
			<img class="yhy" src="@/assets/login/yhy-img.png" alt="">
			<img class="wz-title" src="@/assets/login/wz-title.png" alt="">
			<img class="logo-new" src="@/assets/login/dahe_logo.png" alt="">
		</div>
		<div class="login-form">
			<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @keyup.enter="onLogin"  hide-required-asterisk="true">
				<h1>数智记者</h1>
				<el-form-item prop="mobile" label="手机号">
					<el-input v-model="loginForm.mobile" :placeholder="请输入手机号"> </el-input>
				</el-form-item>
				<el-form-item prop="code" label="验证码">
					<div class="code-box">
						<el-input v-model="loginForm.code" :placeholder="`请输入验证码`" > </el-input>
						<!-- <div class="sms-class" @click="sendSmsCode">{{ isCounting ? countdownText : '获取验证码' }}</div> -->
						<el-button
                    class="sms-class"
                    :disabled="getsmsFlag"
                    @click="sendSmsCode"
                    :loading="getsmsFlag"
                    >{{ isCounting ? countdownText : '获取验证码' }}</el-button
                  >
					</div>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onLogin()" :loading="loading" class="login-button">立即登录</el-button>
				</el-form-item>
			</el-form>
			<div class="footer_login">
				<p><a href="https://www.dahe.cn/" target="_blank" rel="noopener noreferrer">版权所有：大河网</a></p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref} from 'vue'
import store from '@/store'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus/es'

const router = useRouter()
const loginFormRef = ref(null)

const loginForm = ref({
	mobile: '',
	code: '',
})
const checkPhone = function (rule, value, callback) {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        var reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
const loginRules = ref({
	mobile: [{ validator: checkPhone, trigger: 'blur' }],
	code: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }],
})
const isValidPhoneNumber = (phone) => {
      const phoneRegex = /^(1[3-9]\d{9})$/; // 中国大陆手机号正则表达式
      return phoneRegex.test(phone);
    }
// 获取短信验证码
const countdown = ref(0);
const countdownTime = 60; // 倒计时时间，单位为秒
const isCounting = ref(false);
const getsmsFlag = ref(false);
const countdownText = ref('');


const sendSmsCode = () => {
	if(!isValidPhoneNumber(loginForm.value.mobile)){
		ElMessage.error({
			message: '请输入正确手机号！',
			duration: 1000,
		})
		getsmsFlag.value = false
		return false
	}
	getsmsFlag.value = true
  // 获取验证码
  store.userStore
			.sendsms({mobile:loginForm.value.mobile,smstype:"login"})
			.then(async (res) => {
				if(res.code == 2000){
					ElMessage.success({
						message: res.msg,
						duration: 1000,
					})
				// 开始倒计时
  				startCountdown();
				}else{
					ElMessage.error({
						message: res.msg,
						duration: 1000,
					})
					getsmsFlag.value = false
				}
			})
			.catch(() => {
				getsmsFlag.value = false
			})
};
 
const startCountdown = () => {
  isCounting.value = true;
  getsmsFlag.value = true
  countdown.value = countdownTime;
  countdownText.value = `${countdown.value} 秒后重发`;
 
  const intervalId = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value -= 1;
      countdownText.value = `${countdown.value} 秒后重发`;
    } else {
      clearInterval(intervalId);
      isCounting.value = false;
	  getsmsFlag.value = false
      countdownText.value = '获取验证码';
    }
  }, 1000);
}



const loading = ref(false)
const onLogin = () => {
	let obj = loginForm.value
	loginFormRef.value.validate((valid) => {
		if (!valid) {
			return false
		}
		loading.value = true
		// 用户登录
		store.userStore
			.loginAction(obj)
			.then(async (res) => {
				loading.value = false
				if(res.code == 2000) {
					logininit(res.data.token)
					ty()
				}else{
					ElMessage.error({
						message: res.msg,
						duration: 1000,
					})
				}
				
			})
			.catch(() => {
				loading.value = false
			})
	})
}
const logininit = async (obj) => {
	// 权限
	let menu_res = await store.userStore.getmenus(obj)
	let role = menu_res?.data.permissions
	if (!role) {
		role = []
	}
	store.routerStore.setrole([...role])
}

const ty = () => {
	ElMessage.success({
		message: '操作成功',
		duration: 500,
		onClose: () => {
			router.push({ path: '/home' })
		}
	})
}
</script>

<style lang="scss" scoped>
@keyframes float {  
    0%, 100% {  
      transform: translate(0, 0) translateY(0); 
    }  
    50% {  
      transform: translate(0, 0) translateY(-20px);
    }  
}
.login-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100vh;
	background: url(@/assets/login/aside_bg.jpg) right center no-repeat;
	background-size: cover;
	.login_left {
		width: calc(100% - 590px);
		height: 100%;
		position: relative;
		display: flex;
		align-items: center;
		.yhy{
			width: 360px;
			height: 360px;
			position: absolute;
			left: 30px;
			top: 50px;
			transform: translate(0,0);
			animation: float 6s ease-in-out infinite;
		}
		.wz-title{
			width: 100%;
			height: auto;
			display: block;
		}
		.logo-new{
			position: absolute;
			right: 30px;
			top: 30px;
		}
	}
	.login-form {
		width: 582px;
		height: 100%;
		min-height: 730px;
		background: url(@/assets/login/bg-r.png) no-repeat left center;
		background-size: 100% 100%;
		z-index: 1;
		padding: 50px 70px;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		.el-form{
			height: calc(100% - 150px);
			h1 {
				text-align: center;
				color: #ffffff;
				font-size: 42px;
				font-weight: 700;
				line-height: normal;
				margin-bottom: 60px;
			}
			.el-form-item{
				display: block;
				font-size: 16px;
				margin-bottom: 50px;
				:deep(label){
					color: #ffffff;
					font-size: 18px;
					margin-bottom: 10px;
				}
				:deep(.el-input__wrapper){
					box-shadow: none;
					background: no-repeat;
					height: 40px;
					line-height: 40px;
					border-bottom: 1px solid #fff;
					border-radius: 0;
					padding: 0;
				}
				:deep(input){
					font-size: 16px;
					color: #d7dff5;
					&:-webkit-autofill,
					&:-webkit-autofill:hover,
					&:-webkit-autofill:focus{
						-webkit-text-fill-color: #d7dff5; 
						-webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0) inset;  /* 背景颜色 */
						border: none;  /* 边框颜色 */
						border-radius: 0;  /* 边框圆角 */
						box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0) inset;
						background-color: transparent;  /* 背景色透明 */
						transition: background-color 50000s ease-in-out 0s;  /* 过渡效果 */
					}
				}
				:deep(.el-input__icon){
					color: #d7dff5;
					font-size: 25px;
				}
				.code-box {
					width: 100%;
					display: flex;
					:deep(.el-input){
						width: 332px;
					}
					.sms-class {
						width: 110px;
						height: 40px;
						line-height: 40px;
						font-size: 16px;
						border: none;
    					border-radius: 0;
						border-bottom: 1px solid #fff;
						color: #ffffff;
						cursor: pointer;
						background: transparent;
					}
					:deep(.el-button.is-loading:before){
						background: transparent;
					}
				}
	
			}
		}
		.login-button {
			width: 100%;
			height: 64px;
			flex-shrink: 0;
			background: linear-gradient(89deg, #1A1E84 31.2%, #C837A0 115.12%);
			border: none;
			font-size: 22px;
			color: #fff;
		}

		
	}
	.footer_login{
		width: 443px;
		text-align: center;
		color: rgba(255, 255, 255, 0.5);
		font-size: 15px;
		position: absolute;
		bottom: 50px;
	}
}
</style>
