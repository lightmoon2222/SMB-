<template>
	<div class="account_flow">
		<div class="cus_list">
			<div class="cus_search">
				<span><a></a>查询</span>
			</div>
			<div class="cus_infor">

				<span>公司名称：<el-input v-model="company_name" ></el-input></span>
				<span>流水号：<el-input v-model="serial " ></el-input></span>
				<span>
				<a>发生时间：</a>
				<el-date-picker v-model="value6" type="daterange" range-separator="-"  start-placeholder="开始日期" end-placeholder="结束日期"  value-format="yyyy-MM-dd">
				</el-date-picker>
		
			</span>

			</div>
			<el-button type="primary" size="small" @click="search">查询</el-button>
		</div>
		<div class="cus_item">
			<template>
				<el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
					<el-table-column prop="payNum" label="流水号">
					</el-table-column>
					<el-table-column prop="cname" label="公司名称" width="200">
					</el-table-column>
					<el-table-column prop="amount" label="金额变动" width="150">
					</el-table-column>
					<el-table-column prop="currentAmount" label="账户余额" width="100">
					</el-table-column>
					<el-table-column label="订单" width="150">
						<template slot-scope="scope" v-if="scope.row.orderId !== 0">
							<a @click="find_order(scope.row.orderId)">查看</a>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="发生时间" width="170">
					</el-table-column>
					<el-table-column prop="opreType" label="类型" width="89">
					</el-table-column>
				</el-table>
			</template>
			<el-pagination background layout="prev, pager, next" :total="total" :page-size='10' :current-page.sync="page" @current-change='changepage'>
			</el-pagination>
		</div>
		<el-dialog title="订单详情" :visible.sync="default_order" width="65%" center>
			<div class="order_form">
				<table align='center' style="border-collapse:collapse;">
					<tr>
						<th>订单号：
							<a>{{order_list.orderNum}}</a>
						</th>
						<th>数量</th>
						<th>月数</th>
						<th>单价</th>
						<th>金额</th>
					</tr>
					<tr v-for="ite in order_list.orderProductVos">
						<td>{{ite.pname}}</td>
						<td>{{ite.number}}</td>
						<td>{{order_list.month}}</td>
						<td>{{ite.sellPrice}}</td>
						<td>{{ite.number*order_list.month*ite.sellPrice}}</td>
					</tr>
					<tr>
						<td>生效日期：{{order_list.startDate}}至{{order_list.expireDate}}</td>
						<td></td>
						<td></td>
						<td></td>
						<td>订单总金额：
							<a>{{order_list.totalPrice}}</a>
						</td>
					</tr>
				</table>
			</div>
			<span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="default_order = false">确 定</el-button>
  </span>
		</el-dialog>
	</div>
</template>

<script>
	import { account_flow, order_info } from '../../../static/public/public.js'
	export default {
		data() {
			return {
				company_name: '', //公司名称
				serial: '', //流水号
				value6: [],
				tableData: [],
				total: 0, //总数据
				page: 1, //当前页
				default_order: false, //订单详情的dialog
				order_list: [], //订单详情list
				loading:true

			}
		},
		methods: {
			get_data(e) {
				console.log(this.value6)
				let accFlowCo = this.qs.stringify({
					cname: this.company_name,
					payNum: this.serial,
					beginTime: this.value6[0],
					endTime: this.value6[1],
					pageNum: e,
					pageSize: this.pagesize
				});
				account_flow(accFlowCo)
					.then((val) => {
						console.log(val)
						this.total = val.data.data.total;
						this.tableData = val.data.data.list;
						this.loading = false;
					}).catch(err=>{
					if(err.response.data.status == 403){
						this.$message.error('当前操作您没有权限');
					}
				})
			},
			changepage(e) {

				this.get_data(e)
			},
			search() {
				this.page = 1;
				this.get_data(1)
			},
			find_order(e) {
				console.log(e)
				this.default_order = true;
				order_info(e)
					.then(val => {
						console.log(val)
						if(val.data.data){
							this.order_list = val.data.data
						}
						
					})
			}
		},
		created() {
			this.get_data(1)
		},
		watch: {
			value6(newvalue, old) {
				if(newvalue == null) {
					this.value6 = [];
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.order_form {
		table {
			width: 100%;
			margin: 0 auto;
			th {
				border: 1px solid #e9e9e9;
				border-bottom: 0 !important;
				height: 35px;
			}
			tr {
				td {
					border: 1px solid #e9e9e9;
					height: 25px;
					border-top: 0;
					a {
						color: #ff5555;
					}
				}
				th {
					width: 20%;
					font-size: 12px;
					color: #474848;
					a {
						color: #00a4f9;
					}
					&:first-child {
						width: 25%;
					}
				}
			}
		}
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
				&:last-child {
					width: 40%;
					position: relative;
					height: 30px;
					.el-date-editor {
						height: 30px;
						position: absolute;
						left: 65px;
						top: -3px;
					}
					a {
						position: absolute;
						top: 5px;
					}
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
	
	.order_list {
		div {
			line-height: 25px;
		}
	}
</style>