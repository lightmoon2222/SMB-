<template>
	<div class="cus">
		<div class="cus_list">
			<div class="cus_search">
				<span><a></a>查询</span>
			</div>
			<div class="cus_infor">

				<span>公司名称：<el-input v-model.trim="company_name" ></el-input></span>
				<span>联系人：<el-input v-model.trim="contacts" ></el-input></span>
				<span>注册手机号：<el-input v-model.trim="phone" ></el-input></span>
				<span>企业会员号：<el-input v-model.trim="conpany_num" ></el-input></span>

			</div>
			<el-button type="primary" size="small" @click="find_user">查询</el-button>
		</div>
		<div class="cus_item">
			<template>
				<el-table :data="tableData" stripe style="width: 100%"  v-loading="loading">
					<el-table-column prop="memberNum" label="企业会员号" width="120">
					</el-table-column>
					<el-table-column prop="cname" label="公司名称" width="300">
					</el-table-column>
					<el-table-column prop="activeName" label="联系人" width="150">
					</el-table-column>
					<el-table-column prop="activePhone" label="联系电话" width="150">
					</el-table-column>
					<el-table-column prop="contactPhone" label="注册手机号" width="150">
					</el-table-column>
					<el-table-column prop="orderMonthlyInfos" label="包月状态">
						<template slot-scope="scope" v-if="scope.row.orderMonthlyInfos">
							<span  v-for="(item,index) in scope.row.orderMonthlyInfos">
								<img :src='"../../assets/image/logo"+(index+1)+".png"'>{{item.number}}
								
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="注册时间" width="180">
					</el-table-column>
					<el-table-column label="管理" width="89">
						<template slot-scope="scope">
						<a @click="cus_details(scope.row.id)">详情</a>
						</template>
					</el-table-column>
				</el-table>

			</template>
			<el-pagination background layout="prev, pager, next" :total="total" :page-size='10' :current-page.sync="page" @current-change='changepage'>
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { user_lis } from '../../../static/public/public.js'
	export default {
		data() {
			return {
				company_name: '', //公司名称
				contacts: '', //联系人
				phone: '', //注册手机号
				conpany_num: '', //企业会员号
				tableData: [],
				total: 10, //总条数
				page: 1, //当前页码
				 loading: true,
				orderMonthlyInfos:[],//包月设备信息

			}
		},
		methods: {
			cus_details(e) {
				this.$router.push({
					 name: 'cusinfor',
					params:{
						id:e
					}
				})
			console.log(e)
			},
			changepage(e){
				this.user_list(e)
			},
			find_user(){
					this.page = 1;
				this.user_list(this.page)
			},
			user_list(e) {
				let companiesListCo = this.qs.stringify({
					companyName: this.company_name,
					contactName: this.contacts,
					phone: this.phone,
					memberNum: this.conpany_num,
					pageNum: e,
					pageSize: 10
				});
				user_lis(companiesListCo)
					.then((val) => {
						console.log(val)
						if(val.data.status == "0008"){
							this.tableData = [];
						}else{
							this.loading = false;
							this.total = val.data.data.total;
							this.tableData = val.data.data.list;
							this.orderMonthlyInfos = val.data.data.list.orderMonthlyInfos;
							console.log(this.orderMonthlyInfos)
						}
					}).catch(err=>{
					if(err.response.data.status == 403){
						this.$message.error('当前操作您没有权限');
					}
				})
			}
		},
		created(){
			this.user_list(1);
			
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
	}
</style>