<template>
	<div class="repair_infor">
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
			<el-button type="primary" size="small" @click="search">查询</el-button>
		</div>
		<div class="repair_list" v-loading="loading">
			<div class="repair_item" v-for="item in datas">
				<div class="item_li">
					<div class="li_header">
						<span>服务单号：{{item.caseNum}}</span>
						<span>{{item.CName}}</span>
						<span>{{item.createTime}}</span>
					</div>
					<div class="li_content">
						<a>报修内容：</a>
						<span class="repair_cause">{{item.bugDescribe}}</span>
						<div class="repair_but">
								<span>{{item.status}}</span>
							<span class="repair_details" @click="repair_details(item.id)">详情</span>
						</div>
					</div>
					<div class="li_foot">
						<a>问题分类：{{item.catalogsNames}}</a>
						
						<span>报修渠道：{{item.caseFrom}}</span>
					</div>
				</div>
			</div>
			<el-pagination background layout="prev, pager, next" :total="total" :page-size='pagesize' :current-page.sync="page" @current-change='changepage'>
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { repair } from '../../../static/public/public.js'
	export default {
		data() {
			return {
				company_name: '', //公司名称
				contacts: '', //联系人
				phone: '', //注册手机号
				conpany_num: '', //企业会员号
				page: 1, //当前页
				total: 0, //总数据
				pagesize: 5, //每页条数
				datas: [], //请求的数据
				loading:true
			}
		},
		methods: {
			get_data(e) {
				let caseListCo = this.qs.stringify({
					companyName: this.company_name,
					contactName: this.contacts,
					memberNum: this.conpany_num,
					phone: this.phone,
					pageNum: e,
					pageSize: this.pagesize
				});
				repair('list_myCharge', caseListCo)
					.then((val) => {
						console.log(val)
						if(val.data.status == '0' && val.data.data !== null) {
							this.total = val.data.data.total;
							this.datas = val.data.data.list;
							this.loading = false;
						}else{
							this.loading = false;
							this.datas = [];
						}

					}).catch(err=>{
					if(err.response.data.status == 403){
						this.$message.error('当前操作您没有权限');
					}
				})
			},
				repair_details(e) {
				console.log(e)
				let miss = JSON.parse(localStorage.getItem('user_infor')).permissions;
				if(miss.caseedit) {
					this.$router.push({
						name: 'repair_details',
						params: {
							id: e
						}
					})
				} else {
					this.$message.error('当前操作您没有权限');
				}

			},
			changepage(e) {
				this.get_data(e)
			},
			search() {
				this.page = 1;
				this.get_data(1)
			}
		},
		created() {
			this.get_data(1)
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
	
	.repair_list {
		.repair_item {
			background-color: #FFFFFF;
			padding: 15px;
			margin-top: 20px;
			.item_li {
				background-color: #FFFFFF;
				border: 1px solid #e9e9e9;
				overflow: hidden;
				.li_header {
					overflow: hidden;
					width: 100%;
					height: 30px;
					background-color: #f3fafe;
					line-height: 30px;
					span {
						float: left;
						font-size: 13px;
						&:first-child {
							padding-left: 20px;
						}
						&:nth-child(2) {
							color: #00a4f9;
							margin-left: 40px;
						}
						&:last-child {
							float: right;
							font-size: 12px;
							padding-right: 20px;
						}
					}
				}
				.li_content {
					width: 100%;
					font-size: 12px;
					height: 70px;
					line-height: 70px;
					float: left;
					overflow: hidden;
					a {
						padding-left: 20px;
						float: left;
					}
					.repair_cause {
						height: 28px;
						line-height: 28px;
						padding: 1px 9px;
						border: 1px solid #e9e9e9;
						border-radius: 5px;
						background-color: #f4f4f4;
						color: #666666;
						float: left;
						margin-top: 18px;
					}
					.repair_but {
						width: 300px;
						float: right;
						color: #ff9f08;
						span {
							&:first-child {
								padding-right: 30px;
							}
							&:last-child {
							color: #FFFFFF;
								padding: 5px 15px;
								background-color: #ff9f08;
								border-radius: 5px;
								float: right;
								line-height: 17px;
								margin-right: 26px;
								margin-top: 19px;
								height: 17px;
								cursor: pointer;
							}
						}
					}
				}
				.li_foot {
					overflow: hidden;
					margin-top: 70px;
					background-color: #f7f7f7;
					border-top: 1px solid #e9e9e9;
					font-size: 12px;
					height: 30px;
					line-height: 30px;
					a {
						float: left;
						padding-left: 20px;
						width: 500px;
						display: inline-block;
						text-align: left;
						&:nth-child(2) {
							padding: 0 !important;
						}
					}
					span {
						float: left;
						margin-left: 100px;
					}
				}
			}
		}
	}
</style>