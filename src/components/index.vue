<template>
	<div class="hello">
		<el-container>
			<el-header>
				<a>SMB工作服务台</a>
				<div class="header_search">
					<el-input v-model="header_input" placeholder="请输入关键字" size="small"></el-input>
					<i class="el-icon-search"></i>
					<el-button type="info" class="search">搜索</el-button>
				</div>
				<el-button type="primary" size="small" style="float: left;margin-top: 9px;" @click="workspace">工作台</el-button>
				<div class="infor_user">

					<el-dropdown @command="handleCommand">
						<span class="el-dropdown-link">
     {{user_na}}<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="outlogin">退出登录</el-dropdown-item>

						</el-dropdown-menu>
					</el-dropdown>
					<img src="../assets/image/default.png">
				</div>
			</el-header>
			<el-container>
				<el-aside width="200px">
					<el-row class="tac">
						<el-col>
							<el-menu :default-active="$route.path" class="el-menu-vertical-demo" :default-openeds="openeds" router>
								<el-submenu index="1" style="padding-top: 10px;" v-if="permiss.custquery || permiss.orderquery">
									<template slot="title">
										<i class="el-icon-tickets"></i>
										<span>客户信息</span>
									</template>
									<el-menu-item-group>
										<el-menu-item index="/cuslist" v-if="permiss.custquery">客户列表</el-menu-item>
										<el-menu-item index="/orderrecord" v-if="permiss.orderquery">订单记录</el-menu-item>
									</el-menu-item-group>
								</el-submenu>

								<el-submenu index="2" class="bisstwo" v-if="permiss.casequery">
									<template slot="title">
										<i class="el-icon-location"></i>
										<span>交付</span>
									</template>
									<el-menu-item-group>
										<el-menu-item index='/repairinfor' class="baoxiu" v-if="permiss.casequery">报修信息
											<el-badge v-show="count.caseAllCount>0" :value="count.caseAllCount" class="item"></el-badge>
										</el-menu-item>
										<el-menu-item index="/list_myInit"  v-if="permiss.casequery">我发起的
											<el-badge v-show="count.caseMyInitCount>0" :value="count.caseMyInitCount" class="item"></el-badge>
										</el-menu-item>
										<el-menu-item index="/list_myCharge" v-if="permiss.casequery">我负责的
											<el-badge v-show="count.caseMyChargeCount>0" :value="count.caseMyChargeCount" class="item"></el-badge>
										</el-menu-item>
										<el-menu-item index="/list_wait" v-if="permiss.casequery">待接单的
											<el-badge v-show="count.caseWaitCount>0" :value="count.caseWaitCount" class="item"></el-badge>
										</el-menu-item>
										<el-menu-item index="/list_not" v-if="permiss.casequery">未派单的
											<el-badge v-show="count.caseNotCount>0" :value="count.caseNotCount" class="item"></el-badge>
										</el-menu-item>
									</el-menu-item-group>
								</el-submenu>

								<el-submenu index="3" v-if="permiss.financequery || permiss.billquery">
									<template slot="title">
										<i class="el-icon-location"></i>
										<span>财务信息</span>
									</template>
									<el-menu-item-group>
										<el-menu-item index="/accountflow" v-if="permiss.financequery">账户流水</el-menu-item>
										<el-menu-item index="/rechargeinfor" v-if="permiss.financequery">充值信息</el-menu-item>
										<el-menu-item v-if="permiss.billquery"  index="/invoiceinfor">发票信息</el-menu-item>
									</el-menu-item-group>
								</el-submenu>

								<el-submenu index="4" v-if="permiss.usermanage || permiss.rolemanage">
									<template slot="title">
										<i class="el-icon-setting"></i>
										<span>系统设置</span>
									</template>
									<el-menu-item-group>
										<el-menu-item index="/userset" v-if="permiss.usermanage">用户管理</el-menu-item>
										<el-menu-item index="/userinfor" v-if="permiss.rolemanage">角色管理</el-menu-item>
									</el-menu-item-group>
								</el-submenu>

							</el-menu>
						</el-col>

					</el-row>
				</el-aside>
				<el-main>
					<router-view>
					</router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import { deliver_token } from '../../static/public/public.js'
	export default {
		data() {
			return {
				header_input: '', //header的输入框
				openeds: ["1", "2", "3", "4"],
				count: {}, //标识数
				user_na: '', //登录姓名
				permiss:{},//权限信息

			}
		},
		methods: {
			workspace() {
				this.$router.push({
					path: '/Workbench'
				})
			},
			set_axios() {
				deliver_token(localStorage.getItem('token'))
					.then((val) => {
						console.log(val.data.data)
						this.count = val.data.data;

					});
			},
			handleCommand(command) {
				console.log(command)
				if(command == 'outlogin') {
					this.$confirm('确定要退出登录吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						localStorage.clear();
						this.$router.push({
							path: '/login'
						})
					}).catch(() => {

					});
				}
			}
		},
		created() {
			this.permiss = JSON.parse(localStorage.getItem('user_infor')).permissions;
			this.set_axios()
			setInterval(() => {
				this.set_axios()
			}, 300000)
			this.user_na = JSON.parse(localStorage.getItem('user_infor')).realname
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.el-dropdown-menu {
		top: 35px !important;
	}
	
	.hello {
		background-color: #f7f8f9;
		header {
			height: 50px !important;
			background-color: #ffffff;
			box-shadow: 0px 2px 8px #E4E5E6;
			line-height: 50px !important;
			.header_search {
				width: 400px;
				float: left;
				position: relative;
				.el-input {
					width: 290px !important;
					float: left;
					margin-left: 30px;
				}
				i {
					position: absolute;
					right: 65px;
					top: 17px;
					z-index: 1000;
				}
				.search {
					float: left;
					height: 32px;
					line-height: 7px;
					width: 60px;
					margin-top: 9px;
					background-color: #e1e1e1;
					border: 1px solid #e1e1e1;
					color: #666666;
					position: absolute;
					right: 25px;
					font-size: 13px;
					border-top-left-radius: 0;
					border-bottom-left-radius: 0;
				}
			}
			.infor_user {
				float: right;
				height: 50px;
				overflow: hidden;
				img {
					width: 34px;
					height: 34px;
					margin-top: 10px;
				}
				.el-dropdown-link {
					width: 75px;
					cursor: pointer;
					text-align: center;
					display: inline-block;
					position: relative;
					top: -10px;
					font-size: 13px;
				}
			}
			a {
				font-size: 25px;
				float: left;
				display: inline-block;
			}
		}
		aside {
			background-color: #FFFFFF;
			box-shadow: 0px -3px 5px #E4E5E6;
		}
	}
</style>