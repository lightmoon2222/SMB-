<template>
	<div class="invoice_infor">
		<div class="cus_list">
			<div class="cus_search">
				<span><a></a>查询</span>
			</div>
			<div class="cus_infor">

				<span>公司名称：<el-input v-model.trim="company_name" ></el-input></span>
				<span>联系人：<el-input v-model.trim="contacts" ></el-input></span>
				<span>注册手机号：<el-input v-model.trim="phone" ></el-input></span>
				<span>企业会员号：<el-input v-model.trim="conpany_num" ></el-input></span>
				<div class="invoice_status">开票状态：
					<el-select v-model="value" placeholder="请选择">
						<el-option v-for="item in voice_type" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>

			</div>
			<el-button type="primary" size="small" @click="search">查询</el-button>
		</div>
		<div class="cus_item">
			<template>
				<el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
					<el-table-column prop="applyState" label="申请状态" width="120">
					</el-table-column>
					<el-table-column prop="companyName" label="公司名称" width="200">
					</el-table-column>
					<el-table-column prop="invoiceAmt" label="发票金额" width="150">
						<template slot-scope="scope">
							<div>
								{{(scope.row.invoiceAmt).toFixed(2)}}
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="invoiceType" label="发票类型" width="150">
					</el-table-column>
					<el-table-column prop="invoiceNo" label="发票号码">
					</el-table-column>
					<el-table-column prop="applyTime" label="申请时间" width="150">
					</el-table-column>
					<el-table-column label="管理" width="89">
						<template slot-scope="scope">
							<a @click="invoice_details(scope.row.id)">详情</a>
						</template>

					</el-table-column>
				</el-table>
			</template>
			<el-pagination background layout="prev, pager, next" :total="total" :page-size='pagesize' :current-page.sync="page" @current-change='changepage'>
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { qryBillRecordList } from '../../../static/public/public.js'
	export default {
		data() {
			return {
				company_name: '', //公司名称
				contacts: '', //联系人
				phone: '', //注册手机号
				conpany_num: '', //企业会员号
				voice_type: [{
					value: 'OPEN',
					label: '已开具'
				}, {
					value: 'SEND',
					label: '已寄出'
				}, {
					value: 'ROLLBACK',
					label: '已驳回'
				}, {
					value: 'WAIT',
					label: '待审核'
				}, {
					value: '',
					label: '所有状态'
				}],
				value: '',
				tableData: [],
				total: 0, //总条数
				page: 1, //当前页码
				pagesize: 10, //每页多少条数据
				loading:true
			}
		},
		methods: {
			get_data(e) {
				let billRecordListCo = this.qs.stringify({
					companyName: this.company_name,
					contactName: this.contacts,
					phone: this.phone,
					memberNum: this.conpany_num,
					applyState: this.value,
					pageNum: e,
					pageSize: this.pagesize
				});
				qryBillRecordList(billRecordListCo)
					.then((val) => {
						console.log(val)
						this.tableData = val.data.data.list;
						this.total = val.data.data.total;
						this.loading = false;
					}).catch(err=>{
					if(err.response.data.status == 403){
						this.$message.error('当前操作您没有权限');
					}
				})
			},
			//查询
			search() {
				this.page = 1;
				this.get_data(1);
			},
			changepage(e) {
				this.get_data(e);
			},
			invoice_details(e) {
				let miss = JSON.parse(localStorage.getItem('user_infor')).permissions;
				if(miss.billedit) {
					this.$router.push({
						name: 'invoice_details',
						params: {
							id: e
						}
					})

				} else {
					this.$message.error('当前操作您没有权限');
				}

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
			.invoice_status {
				float: left;
				font-size: 13px;
				padding-top: 10px;
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
	}
</style>