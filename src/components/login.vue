<template>
	<div>

		<div class="login_model">
			<div class="login_img">
				<img src="../assets/image/login_image.jpg">
			</div>
			<div class="login_input">
				<span>登录</span>
				<el-input v-model.trim="username" placeholder="请输入用户名"></el-input>
				<el-input v-model.trim="password" placeholder="请输入密码" type="password"></el-input>
				<el-input v-model.trim="gacode" placeholder="请输入验证码" type="password"></el-input>
				<span class="loging" @click="login">登录</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { login } from '../../static/public/public.js'
	export default {
		data() {
			return {
				username: '', //用户名
				password: '', //密码
				gacode: '', //谷歌验证码

			}
		},
		methods: {
			message(e){
				this.$message({
						message:e,
						type: 'error'
					});
			},
			login() {
				if(this.username == '' || this.password == '' || this.gacode == '') {
					this.message('必填项输入信息有误')
				} else {
					let data = this.qs.stringify({
						username:this.username,
						password:this.password,
						gacode:this.gacode
					});
					login(data)
						.then((val) => {
							console.log(val)
							if(val.data.status == 'SMB_LOGIN_1'){
								this.message('验证码错误')
							}else if(val.data.status == "LGN_203"){
								this.message("未查找到该用户")
							}else if(val.data.status == "LGN_209"){
								this.message("密码输入有误")
							}else if (val.data.status == "200"){
								localStorage.setItem('user_infor',JSON.stringify(val.data.data));
								localStorage.setItem('token',val.data.token);
//								console.log(JSON.parse(localStorage.getItem('user_infor')))
								this.$router.push({
									 name: 'Workbench'
								})
							}else if(val.data.status == 'SMB_LOGIN_2'){
								this.message("该账号无SMB管理后台登录权限")
							}
						})
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.login_model {
		width: 570px;
		height: 350px;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
		box-shadow: 0px 2px 10px #E4E5E6;
		border-radius: 10px;
		.login_img {
			width: 50%;
			float: left;
			img {
				width: 100%;
				height: 350px;
				border-top-left-radius: 10px;
				border-bottom-left-radius: 10px;
			}
		}
		.login_input {
			width: 50%;
			float: left;
			span {
				margin-top: 40px;
				display: block;
			}
			.el-input {
				font-size: 13px;
				width: 230px;
				margin-top: 23px;
			}
			.loging {
				width: 230px;
				height: 30px;
				background-color: #00a4f9;
				color: #FFFFFF;
				display: block;
				margin: 0 auto;
				border-radius: 15px;
				font-size: 13px;
				line-height: 30px;
				margin-top: 40px;
				cursor: pointer;
			}
		}
	}
</style>