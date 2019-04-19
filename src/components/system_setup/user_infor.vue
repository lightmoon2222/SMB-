<template>
	<div class="user_infor">
		<div class="cus_list">
			<div class="cus_search">
				<span><a></a>查询</span>
			</div>
			<div class="cus_infor">

				<span>名称：<el-input v-model.trim="user" ></el-input></span>

			</div>
			<el-button type="primary" size="small" @click="search">查询</el-button>
		</div>
		<div class="cus_item">
			<span @click="created_user">新建角色组</span>
			<template>
				<el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
					<el-table-column prop="id" label="编号" width="100">
					</el-table-column>
					<el-table-column prop="rolename" label="角色名称" width="150">
					</el-table-column>
					<el-table-column prop="introduce" label="描述">
					</el-table-column>
					<el-table-column prop="usernum" label="账号数" width="150">
					</el-table-column>
					<el-table-column label="类型" width="89">
						<template slot-scope="scope">
							<a @click="edit_user(scope.row.id)">编辑</a>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		<div class="user_dialog">
			<el-dialog title="角色组" :visible.sync="centerDialogVisible" width="30%" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
				<span>名称：<el-input v-model="user_name" placeholder="请输入内容"></el-input></span>
				<span><a>描述：</a><el-input  v-model="uesr_describe" type="textarea"  placeholder="请输入内容"></el-input></span>
				<div class="quanxian">
					<a>权限：</a>
					<div class="quan_list">
						<el-checkbox-group v-model="checkList">

							<el-checkbox v-for="(item,index) in juri_list" :key="index" :label="item.id">{{item.name}}</el-checkbox>

						</el-checkbox-group>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
    <el-button @click="conform">取 消</el-button>
    <el-button type="primary" @click="push_user">确 定</el-button>
  </span>
			</el-dialog>
			<el-pagination background layout="prev, pager, next" :total="total" :page-size='pagesize' :current-page.sync="page" @current-change='changepage'>
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { roles, list_permission, crt_role, info_role, upt_role } from '../../../static/public/public.js'
	export default {
		data() {
			return {
				user: '', //名称
				tableData: [{
						date: '1',
						name: '北京',
						price: '345.00',
						address: '1123123213',
						phone: '11',
						time: '2019-01-07 16:15:55',
						type: '充值'
					}, {
						date: '2',
						name: '制定',
						price: '345.00',
						address: '1123123213',
						phone: '12',
						time: '2019-01-07 16:15:55',
						type: '充值'
					},

				],
				centerDialogVisible: false,
				user_name: '', //创建新的角色组名字
				uesr_describe: '', //创建新的角色组描述
				checkList: [], //选择的权限
				total: 0, //总数据
				page: 1, //当前页
				pagesize: 10,
				juri_list: [], //获取的权限列表
				check_list: [], //传给后台的列表
				dia_flag: false, //判断新建角色组还是编辑旧的角色组  true为新建 false为编辑
				user_id: 0, //角色组主键id  用于编辑已有角色组操作传值
				loading:true

			}
		},
		watch: {
			checkList(newvalue, oldvalue) {
				let list = [];
				newvalue.forEach((item) => {
					list.push({
						permissionid: item,
						status: 1
					})
				})
				this.check_list = list;
			},
			deep: true
		},
		methods: {
			conform() {
				this.centerDialogVisible = false;
				this.checkList = [];
				this.user_name = '';
				this.uesr_describe = '';
				this.check_list = [];

			},
			//提交编辑信息 需要区分是新增角色组 还是编辑原有角色组
			push_user() {
				if(this.user_name == '') {
					this.$message.error('角色组名称必填哦');
				} else {
					let list = {
						rolename: this.user_name,
						introduce: this.uesr_describe,
						prRolePermissions: this.check_list
					};
					//新建角色组逻辑
					if(this.dia_flag) {
						crt_role(list)
							.then((val) => {
								console.log(val)
								if(val.data.status == '200') {
									this.conform();
									this.$message.success('新建角色组成功');
									this.get_data(this.page)
								} else if(val.data.status == "ROLE_101") {
									this.$message.warning('角色组名称重复');
								}
							})
					} else {
						//编辑原有角色组逻辑
						list.id = this.user_id;
						upt_role(list)
							.then((val) => {
								if(val.data.status == '200') {
									this.conform();
									this.$message.success('编辑角色组成功');
									this.get_data(this.page)
								}
							})
					}
				}
			},
			//翻页
			get_data(e) {
				let lis = this.qs.stringify({
					rolename: this.user,
					pageNum: e,
					pageSize: this.pagesize
				});
				roles(lis).then((val) => {
					console.log(val)
					if(val.data.status == "SELECT_502") {
						this.tableData = [];
					} else {
						this.total = val.data.data.total;
						this.tableData = val.data.data.list;
						this.loading = false;
					}

				})
				.catch(err=>{
					if(err.response.data.status == 403){
						this.$message.error('当前操作您没有权限');
					}
				})
			},

			changepage(e) {
				this.get_data(e)
			},
			//查询
			search() {
				this.page = 1;
				this.get_data(1)
			},
			//新建角色组
			created_user() {
				this.centerDialogVisible = true;
				this.dia_flag = true;
			},
			//获取所有权限
			get_userlist() {
				list_permission()
				
					.then((val) => {
						console.log(val)
						this.juri_list = val.data.data;
					})
			},
			//编辑角色组
			edit_user(e) {
				this.user_id = e;
				this.dia_flag = false;
				console.log(this.user_id);
				info_role(e)
					.then((val) => {
						console.log(val)
						this.centerDialogVisible = true;
						this.user_name = val.data.data.rolename;
						this.uesr_describe = val.data.data.introduce;
						val.data.data.rolePermissionVos.forEach((item) => {
							if(item.status == 1) {
								this.checkList.push(item.permissionid)
							}
						})
					})
			}
		},
		created() {
			this.get_data(1);
			this.get_userlist();
		}
	}
</script>

<style scoped lang="less">
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
		span {
			float: right;
			padding: 10px 30px 10px 10px;
			cursor: pointer;
			color: #00a4f9;
		}
	}
	
	.user_dialog {
		span {
			display: block;
			padding-top: 5px;
			font-size: 13px;
		}
		.login {
			font-weight: bold;
		}
		.quanxian {
			padding-top: 10px;
			.quan_list {
				width: 275px;
				margin-left: 41px;
				margin-top: -21px;
				div {
					padding-top: 15px;
					&:first-child {
						padding: 0;
					}
				}
			}
		}
	}
</style>