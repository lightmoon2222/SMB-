<template>
	<div class="user_set">
		<div class="cus_list">
			<div class="cus_search">
				<span><a></a>查询</span>
			</div>
			<div class="cus_infor">

				<span>用户名：<el-input v-model.trim="user" ></el-input></span>
				<span>姓名：<el-input v-model.trim="name" ></el-input></span>
				<div class="invoice_status">状态：
					<el-select v-model="value" placeholder="请选择">
						<el-option v-for="item in voice_type" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<el-button type="primary" size="small" @click="query_user">查询</el-button>
		</div>
		<div class="cus_item">
			<template>
				<span class="new_user" @click="crea_user">新建用户</span>
				<el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
					<el-table-column prop="id" label="编号" width="70">
					</el-table-column>
					<el-table-column prop="username" label="用户名" width="150">
					</el-table-column>
					<el-table-column prop="realname" label="姓名" width="150">
					</el-table-column>
					<el-table-column prop="rolesVos" label="角色组">
						<template slot-scope="scope">
							<el-tag v-for="(item,key) in scope.row.rolesVos" :key='key' disable-transitions>{{item.rolename}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="lastLoginTime" label="最后登录时间" width="170">
					</el-table-column>
					<el-table-column label="二维码" width="80">
						<template slot-scope="scope" v-if="scope.row.status == 1">
							<div>
								<img src="../../assets/image/qgcode.png" @click="show_code(scope.row.username)">
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" width="150">
						<template slot-scope="scope">

							<el-tag type="success" v-if="scope.row.status == 1" disable-transitions>启用</el-tag>
							<el-tag type="danger" v-else disable-transitions>禁用</el-tag>

						</template>
					</el-table-column>
					<el-table-column label="操作" width="89">
						<template slot-scope="scope">
							<a @click="user_addet(scope.row.id)">编辑</a>
						</template>
					</el-table-column>
				</el-table>

				<!--二维码dialog-->
				<el-dialog title="查看二维码" :visible.sync="code_flag" width="30%" center>
					<span>
						<img id="qgcode" :src="img_src">
					</span>
					<span slot="footer" class="dialog-footer">
			    <el-button @click="code_flag = false">取 消</el-button>
			    <el-button type="primary" @click="code_flag = false">确 定</el-button>
 					 </span>
				</el-dialog>

				<!--用户信息dialog-->
				<el-dialog title="用户" :visible.sync="user_flag" width="40%" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
					<el-form :model="form" :rules="rules2" ref="form">
						<el-form-item label="用户名：" prop="user">
							<el-input v-model.trim="form.user" placeholder="必填项" autocomplete="off" /></el-input>
						</el-form-item>
						<el-form-item label="真实姓名：" prop="name">
							<el-input v-model.trim="form.name" placeholder="必填项" autocomplete="off" /></el-input>
						</el-form-item>
						<el-form-item label="密码：" prop="pass">
							<el-input v-model.trim="form.pass" placeholder="必填项,最少6位" autocomplete="off" type="password" /></el-input>
							<el-button size="small" type="primary" @click="form.pass=1234567809">默认密码</el-button>
						</el-form-item>
						<el-form-item label="微信：" prop="wechat">
							<el-input v-model.trim="form.wechat" placeholder="非必填项" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="手机号：" prop="phone">
							<el-input v-model.trim="form.phone" placeholder="非必填项" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="邮箱：" prop="email" class="money">
							<el-input v-model.trim="form.email" placeholder="非必填项" autocomplete="off" /></el-input>
						</el-form-item>
						<el-form-item label="状态：" class="user_state">
							<el-radio v-model="user_state" label="1">启用</el-radio>
							<el-radio v-model="user_state" label="0">禁用</el-radio>
						</el-form-item>
					</el-form>
					<div class="juris">
						<span class="fu">权限：</span>
						<el-transfer :titles="sur_list" v-model="user_check" :data="user_list"></el-transfer>
					</div>
					<span slot="footer" class="dialog-footer">
			    <el-button @click="resetForm('form')">取 消</el-button>
			    <el-button type="primary" @click="submitForm('form')">提交</el-button>
 					 </span>
				</el-dialog>

			</template>
			<el-pagination background layout="prev, pager, next" :total="total" :page-size='pagesize' :current-page.sync="page" @current-change='changepage'>
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { list_users, qrcode, reg, email_reg, query_roles, crt_user, info_user, upt_user } from '../../../static/public/public.js'
	export default {
		data() {
			//用户名验证
			var check = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('信息不能为空'));
				} else {
					callback();
				}
			};
			//手机号验证
			var check2 = (rule, value, callback) => {
				if(value) {
					if(!reg.test(value)) {
						return callback(new Error('手机号码输入有误'));
					} else {
						callback();
					}
				} else {
					callback();
				}
			};
			//邮箱验证
			var check3 = (rule, value, callback) => {
				if(value) {
					if(!email_reg.test(value)) {
						return callback(new Error('邮箱输入有误'));
					} else {
						callback();
					}
				} else {
					callback();
				}
			};
			//密码验证
			var check4 = (rule, value, callback) => {
				if(value.length < 6) {
					return callback(new Error('密码输入格式有误'));
				} else {
					callback();
				}
			};
			return {
				user: '', //用户名
				name: '', //姓名
				voice_type: [{
					value: '1',
					label: '启用'
				}, {
					value: '0',
					label: '禁用'
				}, {
					value: '',
					label: '所有状态'
				}],
				value: '', //状态
				tableData: [],
				pagesize: 10,
				total: 0, //总数据条数
				page: 1, //当前页码
				code_flag: false, //二维码dialog
				user_flag: false, //用户dialog
				form: {
					user: '', //用户名
					name: '', //真实姓名
					pass: '', //密码
					wechat: '', //微信
					phone: '', //手机号
					email: '', //邮箱
				},
				sur_list: ['所有角色名称', '已选角色名称'],
				rules2: {
					user: [{
						validator: check,
						trigger: 'blur'
					}],
					pass: [{
						validator: check4,
						trigger: 'change'
					}],
					phone: [{
						validator: check2,
						trigger: 'blur'
					}],
					email: [{
						validator: check3,
						trigger: 'blur'
					}],
					name: [{
						validator: check,
						trigger: 'blur'
					}]
				},
				user_list: [], //所有角色列表
				user_check: [], //选择的角色列表
				left_checklist: [], //穿梭框左边选择的列表  用于提交或者取消dialog以后 清除记录用
				user_state: '1', //用户状态 1为启用 0为禁用  默认为启用
				userdia_flag: false, //判断新建角色还是编辑原有角色 true为新建 false为编辑
				user_id: 0, //编辑用户的id  编辑已有用户的时候 需要传递给后台
				img_src:'',//src
				loading:true
			}
		},
		methods: {
			get_data(e) {
				let companiesListCo = this.qs.stringify({
					realname: this.name,
					username: this.user,
					status: this.value,
					pageNum: e,
					pageSize: this.pagesize
				});
				list_users(companiesListCo)
					.then((val) => {
						console.log(val)
						if(val.data.status == "SELECT_502") {
							this.tableData = [];
						} else {
							this.total = val.data.data.total;
							this.tableData = val.data.data.list;
							this.loading = false;
						}
					})
			},
			//查询操作
			query_user() {
				this.page = 1;
				this.get_data(1)
			},
			//页数变更操作
			changepage(e) {
				this.get_data(e)
			},
			//点击二维码显示用户专属二维码
			show_code(e) {
				console.log(e)
				this.code_flag = true;
				this.img_src = "http://release.ms.allits.com.cn/apis/smb/users/qrcode?width=200&height=200&format=png&userName="+e

			},
			//用户dialog  新建操作
			crea_user() {
				this.user_flag = true;
				this.userdia_flag = true;
			},
			//提交用户dialog
			submitForm(formName) {
				console.log(this.user_check)
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let list = this.qs.stringify({
							username: this.form.user,
							realname: this.form.name,
							password: this.form.pass,
							weChat: this.form.wechat,
							phone: this.form.phone,
							email: this.form.email,
							status: this.user_state,
							roleids: this.user_check,
							id: this.user_id
						});
						if(this.userdia_flag) {
							//新建角色
							crt_user(list)
								.then((val) => {
									console.log(val)
									if(val.data.status == '200') {
										this.user_flag = false;
										this.user_check = [];
										this.$refs[formName].resetFields();
										this.$message.success('新建用户成功');
										this.get_data(this.page)
									} else if(val.data.status == "RGT_206") {
										this.$message.warning('该手机号已经注册过了');
									} else if(val.data.status == "RGT_208") {
										this.$message.warning("该用户名已经注册过");
									}
								})
						} else {
							//编辑原有角色
							console.log('bianji')
							console.log(list)
							upt_user(list)
								.then((val) => {
									console.log(val)
									if(val.data.status == '200') {
										this.user_flag = false;
										this.user_check = [];
										this.$refs[formName].resetFields();
										this.$message.success('编辑用户成功');
								
										this.get_data(this.page)
									}
								})
						}

					} else {
						console.log('有错')
						return false;
					}
				});
			},
			//取消按钮
			resetForm(formName) {
				this.user_check = [];
				this.user_flag = false;
				this.$refs[formName].resetFields();
			},
			//编辑用户
			user_addet(e) {
				console.log(e)
				this.user_id = e;
				this.userdia_flag = false;
				info_user(e)
					.then((val) => {
						console.log(val)
						let arr = [];
						val.data.data.rolesVos.forEach((item) => {
							arr.push(item.id)
						})
						console.log(arr)
						this.user_check = arr;
						this.user_flag = true;
						this.form.user = val.data.data.username,
							this.form.name = val.data.data.realname,
							this.form.phone = val.data.data.phone,
							this.form.wechat = val.data.data.weChat,
							this.form.email = val.data.data.email,
							this.user_state = (val.data.data.status).toString()
					})
			}
		},
		created() {
			this.get_data(1);
			query_roles()
				.then((val) => {
					this.user_list = val.data.data;
					console.log(this.user_list)
				}).catch(err=>{
					if(err.response.data.status == 403){
						this.$message.error('当前操作您没有权限');
					}
				})
		}
	}
</script>

<style scoped lang="less">
#qgcode{
	display: block;
	margin: 0 auto;
}
	.cus_list {
		background-color: #ffffff;
		overflow: hidden;
		padding: 10px 0 10px 10px;
		.cus_search {
			width: 100%;
			margin: 0 auto;
			background-color: #ffffff;
			overflow: hidden;
			padding-top: 10px;
			span {
				width: 60px;
				float: left;
				font-size: 14px;
				font-weight: bold;
				position: relative;
				a {
					display: inline-block;
					width: 7px;
					height: 7px;
					background-color: rgb(102, 177, 255);
					line-height: 20px;
					position: absolute;
					top: 6px;
					left: 7px;
				}
			}
		}
		.cus_infor {
			padding-top: 10px;
			padding-left: 5px;
			overflow: hidden;
			span {
				width: 25%;
				float: left;
				font-size: 13px;
				display: inline-block;
				height: 100%;
				text-align: left;
				&:first-child {
					margin-left: 0 !important;
				}
				.el-input {
					width: 170px;
				}
			}
			.invoice_status {
				float: left;
				font-size: 13px;
				.el-select {
					width: 170px;
					margin-left: -4px;
				}
			}
		}
		button {
			float: right;
			margin-top: 20px;
			margin-right: 30px;
			width: 74px;
			height: 30px;
		}
	}
	
	.cus_item {
		background-color: #ffffff;
		width: 100%;
		margin-top: 20px;
		font-size: 12px !important;
		.new_user {
			float: right;
			padding: 10px 30px 10px 10px;
			cursor: pointer;
			color: #00a4f9;
		}
	}
</style>