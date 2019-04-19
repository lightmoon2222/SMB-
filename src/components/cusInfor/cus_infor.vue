<template>
	<div class="cus_big">
		<div style="overflow: hidden;">
			<div class="cus_infor">
				<div class="cus_header">
					<div class="cuss">
						<span><a></a>{{company_name}}</span>
						<div class="bianji" @click="edit_user">
							<i class="el-icon-edit"></i> 编辑
						</div>
					</div>
					<div class="cus_list">
						<span>联系人姓名：{{contan_na}}</span>
						<span>联系人手机号：{{contan_ph}}</span>
						<span>企业会员号：{{memberNum}}</span>
						<span>注册联系人：{{contan_name}}</span>
						<span>注册手机号：{{contan_phone}}</span>
						<span>最后登录：</span>
						<span>注册时间：{{createTime}}</span>
					</div>
				</div>
				<div class="cus_money">
					<div style="overflow: hidden;" class="luren"><span><a></a>钱包</span></div>
					<div style="margin-top: 15px;color: #24abf9;font-size: 14px;">账户余额</div>
					<div class="money">
						<span>{{currentAmt}}</span>&nbsp;元
					</div>
					<div class="cus_but">
						<span @click="com_pay">充值</span>

					</div>
				</div>
			</div>
			<div class="cus_service">
				<span>
			<img src="../../assets/image/default.png">
			<p v-if="seller == null">专属销售：未分配</p>
			<p v-else>专属销售：{{seller}}</p>
			<a @click="edit_user">分配</a>
		</span>
				<span>
			<img src="../../assets/image/default.png">
			<p v-if="engin == null">专属工程师：未分配</p>
			<p v-else>专属工程师：{{engin}}</p>
			<a @click="edit_user">分配</a>
		</span>
			</div>

		</div>
		<div style="margin-top: 20px; overflow: hidden;">
			<div class="cus_address">
				<el-tabs type="border-card">
					<el-tab-pane label="客户地址">
						<div class="user_address">
							<span v-for="(item,index) in user_address">
							<div>	{{item.province}} &nbsp;{{item.city}}&nbsp; {{item.area}}&nbsp; {{item.detailAddress}}&nbsp;</div>
							<div><a @click="edit_add(index)">编辑</a><a @click="delete_address(index,item.id)">删除</a></div>
							</span>
						</div>
						<el-button size="mini" type="primary" style="float: right;margin-top: 10px;" @click="new_add">新增地址</el-button>

					</el-tab-pane>
					<el-tab-pane label="客户备忘录">配置管理</el-tab-pane>
					<el-tab-pane label="报修记录">角色管理</el-tab-pane>
					<el-tab-pane label="充值记录">定时任务补偿</el-tab-pane>
					<el-tab-pane label="账户流水">定时任务补偿</el-tab-pane>
					<el-tab-pane label="开票记录">定时任务补偿</el-tab-pane>
				</el-tabs>
			</div>
			<div class="cus_eqi">
				<div style="overflow: hidden;padding-top: 20px;" class="luren"><span><a></a>包月状态</span></div>
				<div class="eqi_list">
					<div v-for="item in cus_list">
						<img :src="item.img">
						<a>{{item.number}}</a>台
					</div>

				</div>
			</div>
		</div>
		<div class="dialog">
			<el-dialog title="充值" :visible.sync="centerDialogVisible" width="30%" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
				<el-form :model="form" :rules="rules2" ref="form">
					<el-form-item label="银行卡号：" prop="card_id">
						<el-input v-model.trim="form.card_id" autocomplete="off" type="number"></el-input>
					</el-form-item>
					<el-form-item label="银行流水号：" prop="card_num">
						<el-input v-model.trim="form.card_num" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="公司名称：" prop="company">
						<el-input v-model.trim="form.company" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="银行名称：" prop="bank_com">
						<el-input v-model.trim="form.bank_com" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="充值金额：" prop="money" class="money">
						<el-input v-model.trim="form.money" autocomplete="off" type="number" @input="oninput"></el-input>
						<a class="price_type">元&nbsp;(最多支持两位小数)</a>
					</el-form-item>
					<el-form-item label="说明：" prop="explain">
						<el-input v-model="form.explain" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
				    <el-button @click="resetForm('form')">取 消</el-button>
				    <el-button type="primary" @click="submitmon('form')">提交</el-button>
				  </span>
			</el-dialog>
		</div>
		<el-dialog :title="company_name" :visible.sync="outerVisible" :before-close="closeDialog" center class="company_dialog">
			<el-form label-position="right" label-width="100px" :model="companyname" class="demo-form-inline">
				<el-form-item label="公司名称:">
					<el-input v-model.trim="co_name" size="small"></el-input>
				</el-form-item>
			</el-form>
			<div class="user_register" v-if="conpany_infor.isRegisterFlag == 'N'">
				<h3>注册用户信息</h3>
				<span>该账号尚未注册登录信息，可以为客户创建登录信息  <a @click="register_flag = !register_flag">立即创建</a></span>
				<el-form :rules="rule1" ref="rule1" label-position="right" label-width="100px" :model="user_register" class="demo-form-inline" v-if="register_flag">
					<el-form-item label="联系人:" prop="contant">
						<el-input v-model.trim="user_register.contant" size="small"></el-input>
					</el-form-item>
					<el-form-item label="登录手机号:" prop="phone">
						<el-input v-model.trim="user_register.phone" size="small" type="number"></el-input>
					</el-form-item>
					<el-form-item label="密码:" prop="pass">
						<el-input v-model.trim="user_register.pass" size="small"></el-input>
					</el-form-item>
					<el-form-item label="企业会员号:">
						<el-input readonly v-model.trim="user_register.number" size="small" type="number"></el-input>
						<el-button type="primary" size="mini" @click="yao">摇号</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="service_infor">
				<h3>服务信息</h3>
				<div>
					<a>专属销售:</a>
					<div class="infor_but"><img src="../../assets/image/default.png">
						<p v-if="conpany_infor.sellerRealname == null">未分配</p>
						<p v-else>{{conpany_infor.sellerRealname}}</p>
					</div>
					<el-button type="primary" size="mini" @click="edit_ser('更换专属销售','sales','sellerRealname')">更换</el-button>

				</div>
				<div>
					<a>专属工程师:</a>
					<div class="infor_but"><img src="../../assets/image/default.png">
						<p v-if="conpany_infor.engrRealname == null">未分配</p>
						<p v-else>{{conpany_infor.engrRealname}}</p>
					</div>
					<el-button type="primary" size="mini" @click="edit_ser('更换专属工程师','engrs','engrRealname')">更换</el-button>
				</div>
				<el-dialog width="30%" :title="dialog_title" :visible.sync="edit_service" append-to-body center>
					<div class="service_dialoglist">
						<span v-for="(item,index) in service_li" @click="check_index(index)" :class="{check_ser:index == check_ind}">
							<img :src="item.icon?item.icon:default_icon">
							<a>{{item.realname}}</a>
						</span>
					</div>
					<el-button type="primary" style="display: block;margin: 0 auto;margin-top: 50px;" @click="suc_edit">确 定</el-button>
				</el-dialog>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="submitForm('rule1')" type="primary">确 定</el-button>

			</div>
		</el-dialog>
		<!--编辑地址dialog-->
		<el-dialog title="编辑地址" :visible.sync="edit_address" width="36%" center>
			<div class="add_edit">
				<div class="edit_infor">
					<a>地址：</a>
					<el-cascader size="large" :options="options" v-model="selectedOptions">
					</el-cascader>
				</div>
				<div class="edit_infor">
					<a>详细地址：</a>
					<el-input v-model="xiangaddress"></el-input>
				</div>
				<div class="edit_infor">
					<a>默认地址：</a>

					<el-radio v-model="default_address" label="YES">是</el-radio>
					<el-radio v-model="default_address" label="NO">否</el-radio>

				</div>
			</div>
			<span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="push_edit">确 定</el-button> </span>
		</el-dialog>
		<!--新增地址dialog-->
		<el-dialog title="新增地址" :visible.sync="new_address" width="36%" center>
			<div class="add_edit">
				<div class="edit_infor">
					<a>地址：</a>
					<el-cascader size="large" :options="options" v-model="selectedOptions">
					</el-cascader>
				</div>
				<div class="edit_infor">
					<a>详细地址：</a>
					<el-input v-model="xiangaddress"></el-input>
				</div>
				<div class="edit_infor">
					<a>默认地址：</a>

					<el-radio v-model="default_address" label="YES">是</el-radio>
					<el-radio v-model="default_address" label="NO">否</el-radio>

				</div>
			</div>
			<span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="new_addbut">确 定</el-button> </span>
		</el-dialog>
	</div>
</template>

<script>
	import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
	import { queryCusDetailById, delCusAddressById, to_edit, member_num, updateById, ser_list, upt_companies, editco, insertCusAddress, recharge } from '../../../static/public/public.js'
	export default {
		data() {
			var check = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('信息不能为空'));
				} else {
					callback();
				}
			};
			var checkPhone = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('手机号不能为空'));
				} else {
					const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
					console.log(reg.test(value));
					if(reg.test(value)) {
						callback();
					} else {
						return callback(new Error('请输入正确的手机号'));
					}
				}
			};
			return {
				company_name: '', //公司名称
				centerDialogVisible: false,
				contan_na: '', //联系人姓名
				contan_ph: '', //联系人手机号
				memberNum: '', //企业会员号
				contan_name: '', //注册联系人
				contan_phone: '', //注册手机号
				createTime: '', //注册时间
				currentAmt: '', //账户余额
				seller: '', //销售
				engin: '', //工程师
				user_address: [], //客户地址列表
				form: {
					card_id: '', //银行卡号
					card_num: '', //银行流水号
					company: '', //公司名称
					bank_com: '', //银行名称
					money: '', //充值金额
					explain: '', //说明
				},
				cus_list: [{
						img: require('../../assets/image/computer.png'),
						number: 0
					},
					{
						img: require('../../assets/image/wangluo.png'),
						number: 0
					},
					{
						img: require('../../assets/image/fuwuqi.png'),
						number: 0
					}

				],
				rules2: {
					card_id: [{
						validator: check,
						trigger: 'blur'
					}],
					card_num: [{
						validator: check,
						trigger: 'blur'
					}],
					company: [{
						validator: check,
						trigger: 'blur'
					}],
					bank_com: [{
						validator: check,
						trigger: 'blur'
					}],
					money: [{
						validator: check,
						trigger: 'blur'
					}],
					explain: [{
						validator: check,
						trigger: 'blur'
					}]
				},
				outerVisible: false, //编辑dialog
				innerVisible: false, //修改工程师dialog
				companyname: {
					name: '', //公司名称
				},
				co_name: '',
				default_icon: require('../../assets/image/default.png'),
				user_register: {
					contant: '', //联系人
					phone: '', //手机号
					pass: '', //密码
					number: '', //企业会员号
				},
				register_flag: true,
				rule1: {
					contant: [{
						validator: check,
						trigger: 'blur'
					}],
					phone: [{
						validator: checkPhone,
						trigger: 'blur'
					}],
					pass: [{
						validator: check,
						trigger: 'blur'
					}]
				},
				conpany_infor: {}, //公司信息
				address_code: [], //编辑公司地址code
				options: regionData,
				selectedOptions: [], //地址code
				address_infor: '', //地址文字
				edit_address: false, //修改地址dialog
				xiangaddress: '', //详细地址
				add_index: 0, //地址下标
				edit_service: false, //修改
				dialog_title: '',
				check_ind: 0, //
				service_li: [], //所有销售和工程师list
				company_id: 0, //公司id
				default_address: 'YES', //是否选为默认地址
				new_address: false, //新增地址dialog
				money_id: '', //钱包id
			}
		},
		methods: {
			//提交充值

			submitmon(formName) {

				this.$refs[formName].validate((valid) => {
					if(valid) {
						let data = {
							companiesId: this.company_id,
							currentAmt: this.currentAmt,
							walletId: this.money_id,
							rechargeAmt: this.form.money

						}
						let rechargeAmtRecordCo = JSON.stringify(data)
						recharge(rechargeAmtRecordCo)
							.then(val => {
								console.log(val)
								this.$refs[formName].resetFields()
								if(val.data.status == '0') {
									this.get_data();
									this.centerDialogVisible = false;
								}
							}).catch(err => {
								if(err.response.data.status == 403) {
									this.$message.error('当前操作您没有权限');
								}
							})

					} else {
						console.log('有错')
						return false;
					}
				});
			},
			//清空充值form
			resetForm(formName) {
				this.centerDialogVisible = false;
				this.$refs[formName].resetFields();
			},
			//删除地址
			delete_address(e, c) {
				this.$confirm('此操作将删除该地址, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = this.qs.stringify({
						id: c
					});
					delCusAddressById(data)
						.then((val) => {
							console.log(val)
							if(val.data.status == '0003') {
								this.user_address.splice(e, 1);
							}
						})
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			edit_user() {
				let miss = JSON.parse(localStorage.getItem('user_infor')).permissions;
				if(miss.custedit) {
					this.outerVisible = true;
					to_edit(this.$route.params.id)
						.then((val) => {
							console.log(val)
							this.companyname.name = val.data.data.cname;
							this.co_name = this.companyname.name;
							this.conpany_infor = val.data.data;
						})
				} else {
					this.$message.error('当前操作您没有权限');
				}

			},
			yao() {
				member_num()
					.then(val => {
						console.log(val)
						this.user_register.number = val.data.data
					})
			},
			//提交编辑页
			submitForm(e) {
				if(this.co_name == '') {
					this.$message.error('公司名称不能为空');
					return
				}
				if(this.conpany_infor.isRegisterFlag == 'N' && this.register_flag) {
					//没有注册用户信息且注册登录信息显示 则需要验证注册登录信息
					this.$refs[e].validate((valid) => {
						if(valid) {
							//选择填写注册信息 且公司名称与原有公司名称不同
							let data = {
								id: this.company_id,
								cname: this.co_name,
								newRegisterCus: 'Y',
								contactName: this.user_register.contant,
								loginPhone: this.user_register.phone,
								password: this.user_register.pass,
								memberNum: this.user_register.number
							}
							let companiesEditCo = JSON.stringify(data)
							editco(companiesEditCo).then(val => {
								console.log(val)
								if(val.data.status == 'RGT_206') {
									this.$message.error('该手机号已经注册过了');
								}
								console.log(this.co_name)
								console.log(this.companyname.name)
								if(val.data.status == '200') {
									this.outerVisible = false;
									this.$message.success('修改成功');
									this.get_data()
								} else if(val.data.status == "UPT_208") {
									this.$message.error("该公司名称已存在，更新不能公司名称重复！");
								}
							})

						} else {
							console.log('error submit!!');
							return false;
						}
					});
				} else {
					//不用填写注册信息 公司名称跟原有公司名称不同
					let data = {
						id: this.company_id,
						cname: this.co_name,
						newRegisterCus: 'N'
					}
					let companiesEditCo = JSON.stringify(data)
					editco(companiesEditCo).then(val => {
						console.log(val)

						if(val.data.status == '200') {
							this.outerVisible = false;
							this.$message.success('修改成功');
							this.get_data()
						} else if(val.data.status == "UPT_208") {
							this.$message.error("该公司名称已存在，更新不能公司名称重复！");
						}
					})
					//不用填写注册信息 且公司名称跟原有公司名称相同
					//					if(this.co_name == this.companyname.name) {
					////						this.$message.success('修改成功');
					////						this.get_data()
					////						this.outerVisible = false;
					////						return
					//					console.log(this.co_name)
					//					console.log(this.companyname.name)
					//					}

				}

			},
			edit_add(c) {
				this.selectedOptions = [];
				this.add_index = c;
				this.edit_address = true;
				this.default_address = 'YES';
				//详细地址
				this.xiangaddress = this.user_address[c].detailAddress;
				this.selectedOptions.push(this.user_address[c].proviceCode, this.user_address[c].cityCode, this.user_address[c].areaCode)
				console.log(this.selectedOptions);
			},
			//修改客户详情地址dialog
			push_edit() {

				console.log(this.selectedOptions)
				if(this.xiangaddress == '') {
					this.$message({
						type: 'error',
						message: '详细地址是必填的!'
					});
					return
				}
				this.edit_address = false;
				this.selectedOptions.forEach(item => {
					this.address_infor += CodeToText[item]
				})
				let customerAddress = {
					companiesId: this.$route.params.id,
					id: this.user_address[this.add_index].id,
					province: this.detail_address(this.selectedOptions[0]),
					city: this.detail_address(this.selectedOptions[1]),
					area: this.detail_address(this.selectedOptions[2]),
					detailAddress: this.xiangaddress,
					proviceCode: this.selectedOptions[0],
					defaultFlag: this.default_address,
					cityCode: this.selectedOptions[1],
					areaCode: this.selectedOptions[2],
				}
				updateById(customerAddress)
					.then(val => {
						console.log(val)
						if(val.data.status == '0005') {
							this.edit_address = false;
							this.get_data()
						}
					})
			},
			//根据code返回相对应的信息
			detail_address(e) {
				return CodeToText[e]
			},
			get_data() {
				queryCusDetailById(this.$route.params.id)
					.then((val) => {
						let vals = val.data.data;
						console.log(vals)
						console.log(val)
						this.contan_na = vals.activeName;
						this.contan_ph = vals.activePhone;
						this.company_name = vals.cname;
						this.company_id = vals.id,
							this.contan_name = vals.contactName;
						this.contan_phone = vals.contactPhone;
						this.memberNum = vals.memberNum;
						this.createTime = vals.createTime;
						this.currentAmt = vals.currentAmt;
						this.seller = vals.sellerRealname;
						this.engin = vals.engrRealname;
						this.user_address = vals.customerAddressList;
						this.money_id = vals.walletId;
						console.log(vals)
						if(vals.orderMonthlyInfos.length == 0) {

						} else {
							vals.orderMonthlyInfos.forEach((item, index) => {
								this.cus_list[index].number = item.number
							})
						}
					})
			},
			//修改工程师和销售
			edit_ser(c, d, e) {
				this.dialog_title = c;
				this.edit_service = true;
				ser_list(d)
					.then(val => {
						console.log(val)
						this.service_li = val.data.data;
						this.check_ind = this.choose_index(e);
						console.log(this.check_ind)
					})

			},
			check_index(e) {
				this.check_ind = e
			},
			//返回默认选择的index
			choose_index(e) {
				let ar = 0;
				this.service_li.forEach((item, index) => {
					if(item.realname == this.conpany_infor[e]) {
						ar = index
					}
				})
				return ar
			},
			suc_edit() {
				console.log(this.check_ind);

				if(this.dialog_title == '更换专属销售') {
					var data = {
						id: this.company_id,
						sellerId: this.service_li[this.check_ind].id
					}
				} else {
					var data = {
						id: this.company_id,
						engrId: this.service_li[this.check_ind].id
					}
				}
				let record = this.qs.stringify(data)
				upt_companies(record)
					.then(val => {
						console.log(val)
						if(val.data.status == '200') {
							this.get_data()
							this.edit_service = false;
							if(this.dialog_title == '更换专属销售') {
								this.conpany_infor.sellerRealname = this.service_li[this.check_ind].realname
							} else {
								this.conpany_infor.engrRealname = this.service_li[this.check_ind].realname
							}
						}
					})

			},
			//关闭dialog时 清空编辑页数据
			closeDialog(done) {
				if(this.conpany_infor.isRegisterFlag == 'N') {
					done()
					this.$refs.rule1.resetFields();
				} else {
					done()
				}

			},
			new_add() {
				this.selectedOptions = [];
				this.new_address = true;
				this.xiangaddress = '';
				this.default_address = 'YES';
			},
			//新增地址
			new_addbut() {
				console.log(this.selectedOptions)
				if(this.xiangaddress == '') {
					this.$message({
						type: 'error',
						message: '详细地址是必填的!'
					});
					return
				} else if(this.selectedOptions.length == 0) {
					this.$message({
						type: 'error',
						message: '请选择地址!'
					});
					return
				}
				let customerAddress = {
					companiesId: this.$route.params.id,
					province: this.detail_address(this.selectedOptions[0]),
					city: this.detail_address(this.selectedOptions[1]),
					area: this.detail_address(this.selectedOptions[2]),
					detailAddress: this.xiangaddress,
					proviceCode: this.selectedOptions[0],
					defaultFlag: this.default_address,
					cityCode: this.selectedOptions[1],
					areaCode: this.selectedOptions[2],
				}
				console.log(customerAddress)
				insertCusAddress(customerAddress)
					.then(val => {
						console.log(val)
						if(val.data.status == '0') {
							this.new_address = false;
							this.get_data()
						}
					})
			},
			com_pay() {
				let miss = JSON.parse(localStorage.getItem('user_infor')).permissions;
				if(miss.accrecharge) {
					this.centerDialogVisible = true
				} else {
					this.$message.error('当前操作您没有权限');
				}

			},
			oninput(e) {
				// 通过正则过滤小数点后两位
				this.form.money = (this.form.money.match(/^\d*(\.?\d{0,2})/g)[0]) || null

			}

		},
		created() {
			this.get_data()
		},
		watch: {
			//			'form.card_id':function(newvalue,oldvalue){
			//				if (String(newvalue).indexOf('.') > 0) this.form.card_id= '';
			//			}
		}
	}
</script>

<style scoped lang="less">
	.check_ser {
		border: 1px solid #3eccfd;
		background-color: #f2f2f2;
	}
	
	.cus_infor {
		background-color: #FFFFFF;
		width: 78%;
		overflow: hidden;
		float: left;
		.cus_header {
			float: left;
			width: 75%;
			.cuss {
				overflow: hidden;
				padding: 7px 0 7px 10px;
				span {
					padding-left: 20px;
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
				.bianji {
					font-size: 13px;
					color: #24abf9;
					float: right;
					padding-right: 10px;
					cursor: pointer;
				}
			}
			.cus_list {
				overflow: hidden;
				padding: 10px 0 30px 0;
				span {
					width: 30%;
					display: inline-block;
					font-size: 12px;
					text-align: left;
					float: left;
					padding: 4px 0 4px 20px;
				}
			}
		}
		.cus_money {
			overflow: hidden;
			width: 24.7%;
			height: 148px;
			float: left;
			background-color: #FFFFFF;
			box-shadow: 0px 0px 8px #DBDBDB;
			.luren {
				span {
					display: block;
					padding-left: 20px;
					float: left;
					font-size: 14px;
					font-weight: bold;
					position: relative;
					padding-top: 6px;
					a {
						display: inline-block;
						width: 7px;
						height: 7px;
						background-color: rgb(102, 177, 255);
						line-height: 20px;
						position: absolute;
						top: 12px;
						left: 7px;
					}
				}
			}
			.money {
				padding-top: 10px;
				font-size: 12px;
				span {
					font-size: 18px;
					color: #ff0000;
				}
			}
			.cus_but {
				display: flex;
				justify-content: space-around;
				span {
					margin-top: 10px;
					font-size: 13px;
					width: 60px;
					padding: 3px 0;
					border-radius: 5px;
					border: 1px solid #00a4f9;
					display: inline-block;
					color: #FFFFFF;
					background-color: #00a4f9;
					cursor: pointer;
				}
			}
		}
	}
	
	.company_dialog {
		.el-input {
			width: 200px;
		}
		.user_register {
			/*	height: 260px;*/
			span {
				font-size: 13px;
				width: 100%;
				display: block;
				padding: 7px;
				background-color: #F3FAFE;
				margin-top: 10px;
				a {
					color: #00A4F9;
					margin-left: 200px;
					cursor: pointer;
				}
			}
			.el-form-item {
				margin-bottom: 10px;
				&:last-child {
					.el-input {
						width: 140px;
					}
				}
			}
		}
		.service_infor {
			div {
				height: 40px;
				overflow: hidden;
				a {
					display: block;
					width: 88px;
					text-align: right;
					float: left;
					line-height: 40px;
				}
				.infor_but {
					width: 120px;
					float: left;
					overflow: hidden;
					line-height: 40px;
					position: relative;
					img {
						width: 25px;
						height: 25px;
						padding: 7px 0 0 10px;
					}
					p {
						display: inline-block;
						position: absolute;
						top: 0px;
						left: 50px;
						width: 65px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
				button {
					margin-top: 6px;
				}
			}
		}
	}
	
	.cus_service {
		width: 20%;
		background-color: #FFFFFF;
		float: right;
		height: 148px;
		span {
			font-size: 12px;
			display: block;
			position: relative;
			height: 50%;
			width: 90%;
			margin: 0 auto;
			img {
				display: inline-block;
				width: 50px;
				height: 50px;
				border-radius: 15px;
				position: absolute;
				left: 2px;
				top: 12px;
			}
			p {
				display: inline-block;
				position: absolute;
				top: 16px;
				left: 60px;
			}
			a {
				position: absolute;
				top: 37px;
				left: 60px;
				color: #00a4f9;
				cursor: pointer;
			}
			&:last-child {
				border-top: 1px dashed #e9e9e9;
			}
		}
	}
	
	.cus_address {
		.user_address {
			span {
				text-align: left;
				display: block !important;
				font-size: 12px;
				height: 30px;
				line-height: 30px;
				border-bottom: 1px dashed #efefef;
				div {
					display: inline-block;
					&:last-child {
						float: right;
						a {
							cursor: pointer;
							margin-left: 10px;
							&:first-child {
								color: #00a4f9;
							}
						}
					}
				}
			}
		}
	}
	
	.cus_address {
		width: 77.7%;
		background-color: #FFFFFF;
		float: left;
	}
	
	.cus_eqi {
		width: 20%;
		float: right;
		background-color: #FFFFFF;
		span {
			padding-left: 20px;
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
		.eqi_list {
			display: flex;
			justify-content: space-around;
			padding-top: 10px;
			padding-bottom: 10px;
			div {
				font-size: 12px;
				a {
					font-size: 13px;
					color: #ff9f08;
				}
				img {
					display: block;
					margin: 0 auto;
					width: 33px;
					height: 33px;
					padding-bottom: 5px;
				}
			}
		}
	}
</style>