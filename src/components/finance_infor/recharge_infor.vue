<template>
	<div class="account_flow">
		<div class="cus_list">
			<div class="cus_search">
				<span><a></a>查询</span>
			</div>
			<div class="cus_infor">

				<span>公司名称：<el-input v-model.trim="company_name" ></el-input></span>
				<span>流水号：<el-input v-model.trim="serial " ></el-input></span>
				<span>支付状态：			
					<el-select v-model="pay_state" placeholder="请选择">
						<el-option v-for="item in voice_type" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</span>
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
					<el-table-column prop="preNum" label="流水号">
					</el-table-column>
					<el-table-column prop="cname" label="公司名称" width="200">
					</el-table-column>
					<el-table-column prop="amount" label="充值金额" width="150">
						<template slot-scope="scope">
							<div>
								{{(scope.row.amount).toFixed(2)}}
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="isPaid" label="支付状态" width="150">
					</el-table-column>
					<el-table-column prop="payWay" label="充值途径">

					</el-table-column>
					<el-table-column prop="createTime" label="发起时间" width="180">
					</el-table-column>
					<el-table-column prop="paidTime" label="支付时间" width="180">
					</el-table-column>
				</el-table>
			</template>
			<el-pagination background layout="prev, pager, next" :total="total" :page-size='pagesize' :current-page.sync="page" @current-change='changepage'>
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { recha_infor } from '../../../static/public/public.js'
	export default {
		data() {
			return {
				company_name: '', //公司名称
				serial: '', //流水号
				value6: [],
				tableData: [],
				total: 0, //总数据
				page: 1, //当前页
				pagesize: 10, //每页数据
				voice_type: [{
					value: 'YES',
					label: '已支付'
				}, {
					value: 'NO',
					label: '未支付'
				}, {
					value: '',
					label: '所有状态'
				}],
				pay_state: '', //支付状态
				loading:true
			}
		},
		methods: {
			get_data(e) {
				console.log(this.value6)
				let rechargeListCo = this.qs.stringify({
					cname: this.company_name,
					preNum: this.serial,
					beginTime: this.value6[0],
					endTime: this.value6[1],
					isPaid: this.pay_state,
					pageNum: e,
					pageSize: this.pagesize
				});
				recha_infor(rechargeListCo)
					.then((val) => {
						console.log(val.data.data)
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
				width: 27%;
				float: left;
				font-size: 13px;
				display: inline-block;
				height: 100%;
				text-align: left;
				&:first-child {
					margin-left: 0 !important;
				}
				&:last-child {
					margin-top: 15px;
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
</style>