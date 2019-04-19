<template>
	<div class="order_record">
		<div class="cus_list">
			<div class="cus_search">
				<span><a></a>查询</span>
			</div>
			<div class="cus_infor">

				<span>公司名称：<el-input v-model.trim="company_name" ></el-input></span>
				<span>订单号：<el-input v-model.trim="contacts" ></el-input></span>
				<span>注册手机号：<el-input v-model.trim="phone" ></el-input></span>
				<span>企业会员号：<el-input v-model.trim="conpany_num" ></el-input></span>

			</div>
			<el-button type="primary" size="small" @click="order_find">查询</el-button>
		</div>
		<div class="order_list" v-loading="loading">

			<div class="order_item" v-for="item in tableData">
				<div class="order_header">
					<span class="order_name">
				{{item.cname}}
				</span>
					<span class="order_status">
					<a>下单时间：{{item.createTime}}</a>&nbsp;
					<a v-show="item.isPaid == 'NO'">待支付</a>
					<a v-show="item.isPaid == 'YES'">已支付</a>
				</span>
				</div>
				<div class="order_form">
					<table align='center' style="border-collapse:collapse;">
						<tr>
							<th style="cursor: pointer;" @click="order_details(item)">订单号：
								<a>{{item.orderNum}}</a>
							</th>
							<th>数量</th>
							<th>月数</th>
							<th>单价</th>
							<th>金额</th>
						</tr>
						<tr v-for="it in item.orderProductVos" v-if="item.orderProductVos.length > 0">
							<td>{{it.pname}}</td>
							<td>{{it.number}}</td>
							<td>{{item.month}}</td>
							<td>{{it.sellPrice}}</td>
							<td>{{it.sellPrice * item.month}}</td>
						</tr>
				
							<tr v-if="item.payType == 2">
							<td>创建时间:{{item.createTime}}</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr v-if="item.payType == 1">
							<td>
								<p>生效日期：{{item.startDate}}至{{item.expireDate}}</p>
							
							</td>
							<td></td>
							<td></td>
							<td></td>
							<td>订单总金额：
								<a>{{item.totalPrice}}</a>
							</td>
						</tr>
					</table>
				</div>

			</div>
			<el-dialog title="订单详情" :visible.sync="order_deta" width="70%" center>
				<div class="order_item">
					<div class="order_header">
						<span class="order_name">
				订单号：{{default_order.orderNum}}
				</span>
						<span class="order_status">
					<a></a>&nbsp;
					<a v-show="default_order.isPaid == 'NO'">待支付</a>
					<a v-show="default_order.isPaid == 'YES'">已支付</a>
				</span>
					</div>
					<div class="order_form">
						<table align='center' style="border-collapse:collapse;">
							<tr>
								<th>产品类型

								</th>
								<th>数量</th>
								<th>月数</th>
								<th>单价</th>
								<th>金额</th>
							</tr>
							<tr>
								<td>{{default_order.productName}}</td>
								<td>{{default_order.number}}</td>
								<td>{{default_order.month}}</td>
								<td>{{default_order.unitPrice}}</td>
								<td>{{default_order.totalPrice}}</td>
							</tr>

						</table>
						<div class="all_price" style="float: right;padding: 10px;">
							订单原金额：{{default_order.totalPrice}}
						</div>
					</div>

				</div>
				<span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="order_deta = false">确 定</el-button>
  </span>
			</el-dialog>

		</div>
		<div>
			<el-pagination background layout="prev, pager, next" :total="total" :page-size='pagesize' :current-page.sync="pages" @current-change='changepage'>
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { list_orders, order_info } from '../../../static/public/public.js'
	export default {
		data() {
			return {
				company_name: '', //公司名称
				contacts: '', //联系人
				phone: '', //注册手机号
				conpany_num: '', //企业会员号
				tableData: [],
				pages: 1, //当前页
				total: 5, //总计
				pagesize: 5,
				order_deta: false,
				loading: true,
				default_order: {}, //订单详情
			}
		},
		created() {
			this.checkpage(1)
		},
		methods: {
			changepage(e) {
				console.log(e)
				this.checkpage(e)
			},
			checkpage(e) {
				let companiesListCo = this.qs.stringify({
					cname: this.company_name,
					orderNum: this.contacts,
					regPhone: this.phone,
					memberNum: this.conpany_num,
					pageNum: e,
					pageSize: this.pagesize
				});
				list_orders(companiesListCo)
					.then((val) => {
						console.log(val)
						if(val.data.status == "SELECT_502") {
							this.tableData = [];
						} else {
							this.loading = false;
							this.total = val.data.data.total
							this.tableData = val.data.data.list
						}
					}).catch(err => {
						if(err.response.data.status == 403) {
							this.$message.error('当前操作您没有权限');
						}
					})
			},
			order_find() {
				this.pages = 1;
				console.log(this.pages)
				this.checkpage(this.pages)
			},
			order_details(e) {
				console.log(e)
				this.order_deta = true;
				order_info(e.id)
					.then(val => {
						console.log(val)
						this.default_order = val.data.data
					})
			}

		}
	}
</script>

<style scoped lang="less">
	.order_record {
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
		.order_list {
			.order_item {
				overflow: hidden;
				margin-top: 20px;
				padding-bottom: 15px;
				background-color: #FFFFFF;
				.order_header {
					overflow: hidden;
					.order_name {
						float: left;
						font-size: 13px;
						padding: 8px 10px 10px 20px;
					}
					.order_status {
						float: right;
						a {
							font-size: 12px;
							line-height: 40px;
							&:nth-child(2) {
								border: 1px solid #ff9f08;
								color: #ff9f08;
								border-radius: 5px;
								padding: 3px 7px;
								margin-right: 23px;
							}
							&:last-child {
								border: 1px solid rgb(102, 177, 255);
								color: rgb(102, 177, 255);
								border-radius: 5px;
								padding: 3px 7px;
								margin-right: 23px;
							}
						}
					}
				}
				.order_form {
					table {
						width: 97%;
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
								font-size: 13px;
								color: #474848;
								a {
									color: #00a4f9;
								}
								&:first-child {
									width: 27%;
								}
							}
						}
					}
				}
			}
		}
	}
</style>