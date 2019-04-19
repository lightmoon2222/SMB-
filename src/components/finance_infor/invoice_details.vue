<template>
	<div class="invoice_details">
		<div class="invoice_infor">
			<div class="cus_search">
				<span><a></a>{{compan_name}}</span>
			</div>
			<div class="invoice_img">
				<img src="../../assets/image/ord_invoice.png">
				<div class="invoice_content">
					<span class="inv_code">
						{{inv_code}}
						
					</span>
					<span class="inv_num">
						{{inv_num}}
					</span>
					<span class="inv_com">
						{{inv_com}}
					</span>
					<span class="inv_name">
						{{inv_name}}
					</span>
					<span class="inv_price">
						{{inv_price}}
					</span>
					<span class="inv_priceall">
						{{inv_priceall}}
					</span>
				</div>
			</div>
			<el-button v-if="pay_state=='待审核'" type="primary" @click="outerVisible = true">审核</el-button>
			<el-button v-if="open_invflag == true" @click="centerDialogVisible = true" type="primary">开具发票</el-button>
		</div>
		<div class="invoice_state">
			<div>当前状态：
				<a v-if="pay_state == '待审核'" style="color: #ff9f08;">待审核</a>
				<a v-else-if="pay_state == '已审核'" style="color: #0090ff;">已审核</a>
				<a v-else-if="pay_state == '已驳回'" style="color: #0090ff;">已驳回</a>
				<a v-else style="color: #0090ff;">已开具</a>
			</div>
			<div>发票类型：{{inv_type}}</div>
			<div>发票金额：{{(inv_priceall).toFixed(2)}}</div>
		</div>
		<el-dialog width="25%" title="审核" center :visible.sync="outerVisible">
			<span style="display: block; text-align: center;">请确认该发票审核是否通过</span>
			<el-dialog width="25%" title="驳回" center :visible.sync="innerVisible" append-to-body class="reject">
				<span><a>驳回原因：</a><el-input v-model="reject_infor" placeholder="请输入驳回原因"></el-input></span>
				<el-button @click="reject_but" type="primary">驳回</el-button>
			</el-dialog>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="examine_succ">通过</el-button>
				<el-button @click="innerVisible = true">拒绝</el-button>
			</div>
		</el-dialog>
		<!--开具发票dialog-->
		<div class="dialog">
			<el-dialog title="开具发票" :visible.sync="centerDialogVisible" width="30%" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
				<el-form :model="form" :rules="rules2" ref="form">
					<el-form-item label="发票代码：" prop="invoice_code">
						<el-input v-model.trim="form.invoice_code" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="发票号码：" prop="invoice_num">
						<el-input v-model.trim="form.invoice_num" autocomplete="off" type="number"></el-input>
					</el-form-item>
					<span class="cour">
						<a>快递公司：</a>
						<el-select v-model="cour_name" placeholder="请选择">
							    <el-option
							      v-for="item in options"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							  </el-select>
					</span>
					<el-form-item label="快递单号：" prop="cour_num">
						<el-input v-model.trim="form.cour_num" autocomplete="off" type="number"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
				    <el-button @click="resetForm('form')">取 消</el-button>
				    <el-button type="primary" @click="submitForm('form')">提交</el-button>
				  </span>
			</el-dialog>
		</div>

		<div class="invoice_records">
			<el-tabs type="border-card">
				<el-tab-pane label="消费记录">
					<span v-for="item in invoice_records">
						<a>{{item.orderType}}</a>
						<a>{{item.amount}}</a>
						<a>{{item.paidTime}}</a>
						<a>查看</a>
					</span>
				</el-tab-pane>

			</el-tabs>
		</div>
	</div>
</template>

<script>
	import { queryBillRecordById, auditBillRecord, openBill } from '../../../static/public/public.js'
	export default {
		data() {
			var check = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('信息不能为空'));
				} else {
					callback();
				}
			};
			var check2 = (rule, value, callback) => {
				if(this.cour_name == 'OWN') {
					callback();
				} else if(this.cour_name !== 'OWN' && value) {
					callback();
				} else {
					return callback(new Error('信息不能为空'));
				}
			};
			return {
				compan_name: '',
				inv_code: '', //发票号码
				inv_num: '', //发票num
				inv_com: '', //公司名称
				inv_name: '', //发票名称
				inv_price: 0, //发票金额
				inv_priceall: 0, //发票总计金额
				pay_state: '', //发票当前状态
				inv_type: '', //发票类型
				invoice_records: [], //发票消费记录
				outerVisible: false, //是否审核dialog
				innerVisible: false, //驳回dialog
				invoice_reco: '', //发票消费记录集合 审核发票需要传递给后台
				applyState: '', //审核的状态
				reject_infor: '', //审核发票驳回的信息
				inv_id: 0, //发票id 审核传递的参数
				open_invflag: false, //开具发票flag  当发票为纸质发票且状态为审核通过是才会显示
				centerDialogVisible: false, //开具发票dialog
				form: {
					invoice_code: '', //发票代码
					invoice_num: '', //发票号码
					cour_num: '', //快递单号
				},
				rules2: {
					invoice_code: [{
						validator: check,
						trigger: 'blur'
					}],
					invoice_num: [{
						validator: check,
						trigger: 'blur'
					}],
					cour_num: [{
						validator: check2,
						trigger: 'blur'
					}]
				},
				cour_name: 'SF', //快递公司
				options: [{
					value: 'SF',
					label: '顺丰'
				}, {
					value: 'SS',
					label: '闪送'
				}, {
					value: 'QT',
					label: '其他'
				}, {
					value: 'OWN',
					label: '自取/自送'
				}],
			}
		},
		created() {
			this.get_data()
		},
		methods: {
			//操作发票
			examine_play(e) {
				let billStateCo = this.qs.stringify({
					accFlowId: this.invoice_reco,
					id: this.inv_id,
					applyState: e,
					remark: this.reject_infor
				});

				auditBillRecord(billStateCo)
					.then((val) => {
						console.log(val)
						if(val.data.status == '0') {
							this.outerVisible = false;
							this.get_data()
							this.$message.success('操作成功');
							this.$router.go(-1)
						}

					})
					.catch(err => {
						if(err.response.data.status == 403) {
							this.$message.error('当前操作您没有权限');
						}
					})
			},
			//通过操作
			examine_succ() {
				this.examine_play('APPROVED')
			},
			get_data() {
				//根据发票id获取发票信息
				queryBillRecordById(this.$route.params.id)
					.then((val) => {
						console.log(val)
						this.compan_name = val.data.data.companyName;
						this.inv_com = val.data.data.companyName;
						this.inv_code = val.data.data.invoiceCode;
						this.inv_name = val.data.data.billContent;
						this.inv_price = val.data.data.invoiceAmt;
						this.inv_priceall = val.data.data.invoiceAmt;
						this.pay_state = val.data.data.applyState;
						this.inv_num = val.data.data.invoiceNo;
						this.inv_type = val.data.data.invoiceType;
						this.invoice_records = val.data.data.accFlowBillRecordVos;
						this.inv_id = val.data.data.id;
						let arr = [];
						//当发票为已审核 且是纸质发票是显示开具发票按钮
						if(this.pay_state == '已审核' && this.inv_type == '纸质发票') {
							this.open_invflag = true
						} else {
							this.open_invflag = false
						}
						//获取发票消费记录的id  将他们转化为字符串
						this.invoice_records.forEach((item) => {
							arr.push(item.id)
						})
						this.invoice_reco = arr.join(',');
						console.log(this.invoice_reco)
					})
			},
			//驳回操作
			reject_but() {
				if(this.reject_infor == '') {
					this.$message.warning('驳回原因必填');
				} else {
					this.examine_play('ROLLBACK')
					this.innerVisible = false;
					this.outerVisible = false;
				}

			},
			//清空发票dialog信息
			resetForm(formName) {
				this.centerDialogVisible = false;
				this.$refs[formName].resetFields();
			},
			//提交开具发票dialog
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let openInvoiceCo = this.qs.stringify({
							id: this.inv_id,
							invoiceCode: this.form.invoice_code,
							invoiceNo: this.form.invoice_num,
							courierType: this.cour_name,
							courierNo: this.form.cour_num

						})
						openBill(openInvoiceCo)
							.then((val) => {
								if(val.data.status == '0') {
									this.$message.success('操作成功');
									this.centerDialogVisible = false;
									this.$router.go(-1)
								}
							})
					} else {

						return false;
					}
				});
			},
		}
	}
</script>

<style scoped lang="less">
	.invoice_infor {
		width: 80%;
		background-color: #FFFFFF;
		padding-bottom: 15px;
		float: left;
		.cus_search {
			width: 100%;
			margin: 0 auto;
			background-color: #ffffff;
			overflow: hidden;
			padding-top: 10px;
			span {
				width: 300px;
				float: left;
				font-size: 14px;
				font-weight: bold;
				position: relative;
				text-align: left;
				padding-left: 27px;
				a {
					display: inline-block;
					width: 7px;
					height: 7px;
					background-color: rgb(102, 177, 255);
					line-height: 20px;
					position: absolute;
					top: 6px;
					left: 15px;
				}
			}
		}
		.invoice_img {
			width: 640px;
			height: 370px;
			border: 1px solid #e9e9e9;
			margin: 10px 0 10px 15px;
			position: relative;
			img {
				width: 630px;
				height: 360px;
				padding: 6px;
			}
			.invoice_content {
				position: absolute;
				width: 600px;
				height: 350px;
				top: 0;
				color: #0090ff;
				font-size: 12px;
				.inv_code {
					position: absolute;
					top: 100px;
					left: 158px;
				}
				.inv_num {
					position: absolute;
					top: 30px;
					left: 449px;
				}
				.inv_com {
					position: absolute;
					top: 86px;
					left: 130px;
				}
				.inv_name {
					position: absolute;
					top: 170px;
					left: 59px;
				}
				.inv_price {
					position: absolute;
					top: 170px;
					left: 533px;
				}
				.inv_priceall {
					position: absolute;
					top: 260px;
					left: 493px;
				}
			}
		}
		button {
			margin-left: -192px;
			margin-top: 20px;
		}
	}
	
	.invoice_state {
		float: right;
		width: 18.5%;
		background-color: #FFFFFF;
		height: 100px;
		div {
			text-align: left;
			font-size: 12px;
			padding: 5px;
		}
	}
	
	.reject {
		.el-input {
			width: 160px;
		}
		button {
			margin-left: 103px;
			margin-top: 20px;
			padding: 8px 20px;
		}
	}
	
	.cour {
		overflow: hidden;
	}
	
	.invoice_records {
		width: 80%;
		float: left;
		background-color: #FFFFFF;
		margin-top: 15px;
		span {
			border-bottom: 1px dashed #efefef;
			padding-bottom: 2px;
			a {
				width: 24%;
				font-size: 12px;
				text-align: left;
				display: inline-block;
				&:last-child {
					text-align: right;
					cursor: pointer;
					color: #00a4f9;
				}
			}
		}
		.el-tabs--border-card {
			box-shadow: none !important;
			border: 0 !important;
			.el-tabs__header {
				border: 0 !important;
			}
		}
	}
</style>