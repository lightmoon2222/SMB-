<template>
	<div class="open_repair">
		<div class="baoxiu">
			<a class="bao_title">发起报修</a>
			<div>
				<span class="baox_list">客户名称：<el-input :readonly="ready_flag"  v-model.trim="com" placeholder="请输入内容"></el-input></span>
				<span class="baox_list">发起来源：<el-select v-model="launch" placeholder="请选择">
				    <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select></span>
			</div>
			<div class="div2">
				<span class="baox_list">客户姓名：<el-input   v-model.trim="com_name" placeholder="请输入内容"></el-input></span>
				<span class="baox_list">联系电话：<el-input type="number"  v-model.trim="com_phone" placeholder="请输入内容"></el-input></span>
				<span class="baox_list">即时通讯：<el-select v-model="commun" placeholder="请选择">
				    <el-option
				      v-for="item in options2"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				<el-input v-model="com_else" class="com_else"></el-input>
				</span>
			</div>
			<div class="fault">
				<a>故障现象描述:</a>
				<el-input type="textarea" :rows="1" placeholder="请输入内容" v-model.trim="fault_text">
				</el-input>
			</div>
			<div class="fault_enclo">

				<a>故障现象附件:</a>
				<input type="file" @change="UpladFile()" id="file" />
				<div class="input_fo">
					+
				</div>
				<span id="img_list"></span>

			</div>
			<el-button type="primary" @click="openorder">开单</el-button>
		</div>
		<div class="repair">
			<a class="bao_title">故障处理</a>
			<div class="fault">
				<a>处理方案记录:</a>
				<el-input type="textarea" :rows="1" placeholder="请输入内容" v-model="handle_text">
				</el-input>
			</div>
			<div class="fault">
				<a>服务目录:</a>
				<div style="float: left;padding-left: 6px;">
					<el-select v-model="service_check0">
						<el-option v-for="(item,index) in service_list" :key="item.id" :label="item.cataName" :value="index">
						</el-option>
					</el-select>
					<el-select v-model="service_check1" v-if="service_check0!=='' && service_list[service_check0].childrenList.length !== 0" @change="se1">
						<el-option v-for="(item,index) in service_list[service_check0].childrenList" :key="item.id" :label="item.cataName" :value="index">
						</el-option>
					</el-select>
					<el-select v-model="service_check2" v-if="service_check0!=='' && service_check1!=='' && service_list[service_check0].childrenList[service_check1].childrenList.length !== 0">
						<el-option v-for="(item,index) in service_list[service_check0].childrenList[service_check1].childrenList" :key="item.id" :label="item.cataName" :value="index">
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="fault">
				<a>问题是否解决:</a>
				<el-radio-group v-model="que_flag" class="que_ddd">
					<el-radio label="RESOLVED">已在线解决</el-radio>
					<el-radio label="UNRESOLVED_PD">在线未解决,派上门单</el-radio>
					<el-radio label="UNRESOLVED_JX">在线未解决，寄修</el-radio>
				</el-radio-group>
			</div>
			<el-button type="primary" @click="handle">开单并处理</el-button>
		</div>
	</div>
</template>

<script>
	import { service_tree, openOrder, to_open_case, open_remote, reg_exp2, reg } from '../../../static/public/public.js'
	export default {
		data() {
			return {
				com_name: '', //公司名称
				options: [{
					value: 'SERVICE_TEL',
					label: '400客服电话'
				}, {
					value: 'WECHAT',
					label: '微信'
				}, {
					value: 'QQ',
					label: 'QQ'
				}, {
					value: 'DINGDING',
					label: '钉钉'
				}, {
					value: 'QT_IM',
					label: '其他IM'
				}, {
					value: 'FACE_TO_FACE',
					label: '当面报修'
				}, {
					value: 'QT_PAY',
					label: '其他途径'
				}, {
					value: 'SERVICE_INIT',
					label: '服务台发起'
				}, {
					value: 'SELLER_INIT',
					label: '销售发起'
				}, {
					value: 'ENGER_INIT',
					label: '工程师发起'
				}, {
					value: 'CUSTOMER_BACK',
					label: '客户后台自主报修'
				}, {
					value: 'CUSTOMER_CODE',
					label: '客户自主扫码报修'
				}],
				options2: [{
					value: 'WECHAT',
					label: '微信'
				}, {
					value: 'QQ',
					label: 'QQ'
				}, {
					value: 'DINGDING',
					label: '钉钉'
				}, {
					value: 'QT',
					label: '其他IM'
				}],
				options3: [],
				com: '', //客户名称
				launch: 'SERVICE_TEL', //发起来源
				commun: 'WECHAT', //即时通讯
				com_phone: '', //联系电话
				com_else: '', //即时通讯信息
				fault_text: '', //故障现象描述
				handle_text: '',
				params: {}, //选择的图片信息
				bog: [],
				video_img: require('../../assets/image/video_ic.png'), //引入默认图片
				video_falg: true,
				img_falg: true,
				que_flag: 'RESOLVED',
				service_list: [],
				service_check0: '',
				service_check1: '',
				service_check2: '',
				servi_str: '', //
				ready_flag: false, //是否只可读  临时单为false  
				com_id: '', //公司id
				user_id: '', //客户id
				user_infor: {}, //当前登录用户信息
				bao_flag: false, //false为报修按钮事件  true为报修并处理事件
			}
		},
		methods: {
			se0(e) {
				console.log(this.service_list[e])
				this.service_check1 = '';
				this.service_check2 = '';
			},
			se1(e) {
				console.log(this.service_list[this.service_check0].childrenList[e])
			},
			UpladFile() {
				var fileObj = document.getElementById("file");
				this.bog.push(fileObj.files);
				console.log(fileObj.files[0])
				this.params = new FormData(); //创建form对象
				let img_length = document.getElementById("file").files;
				console.log(img_length)
				console.log(this.bog)
				this.bog.forEach((item, index) => {
					if(index > 2) {
						return
					} else {
						this.params.append('file' + index, item[0]);
					}

				})

				if(this.bog.length > 3) {
					this.$message.error('最多上传3个图片跟视频');
					return
				} else if(this.img_falg) {
					for(let i = 0; i < img_length.length; i++) {

						if(img_length[0].type == "video/mp4" || img_length[0].type == "video/quicktime") {
							let filePath = img_length[i].name
							let fileFormat = filePath.split('.')[1].toLowerCase()
							let src = window.URL.createObjectURL(img_length[i])
							let preview = document.getElementById("img_list")
							let img = document.createElement('img')
							img.className = 'imgs'
							img.width = 90
							img.height = 90
							img.src = this.video_img
							preview.appendChild(img)

						} else {
							let filePath = img_length[i].name
							let fileFormat = filePath.split('.')[1].toLowerCase()
							let src = window.URL.createObjectURL(img_length[i])
							let preview = document.getElementById("img_list")
							let img = document.createElement('img')
							img.className = 'imgs'
							img.width = 90
							img.height = 90
							img.src = src
							preview.appendChild(img)
						}

					}
				}
			},
			list(e) {
				console.log(e)
			},
			//开单
			openorder() {
				let miss = JSON.parse(localStorage.getItem('user_infor')).permissions;
				if(!miss.casecreat) {
					return
				}
//				if(!reg_exp2.test(this.com_phone)){
//					this.$message.error('请输入正确的手机号或者座机号');
//					return
//				}
				if(this.com == '' || this.com_phone == '' || this.com_name == '' || this.fault_text == '') {
					this.$message.error('客户名称、客户姓名 、联系电话、 故障现象描述为必填项!');
				} else {
					let data = {
						caseAttachmentList: this.bog,
						peCase: {
							companiesName: this.com,
							contactName: this.com_name,
							contactPhone: this.com_phone,
							customerId: this.user_id,
							companiesId: this.com_id,
							caseFrom: this.launch,
							contactType: this.commun,
							contactNum: this.com_else,
							bugDescribe: this.fault_text,
							status: 'CASE_CODE_100'
						}

					};

					let datas = JSON.stringify(data)
					openOrder(datas)
						.then((val) => {
							console.log(val)
							if(val.data.status == '0') {
								this.$message.success('操作成功');
								this.$router.push({
									name: 'repairinfor'
								})
							}else if(val.data.status == '3009'){
								this.$message.error('报修工单联系人电话不合法');
							}
						})
						.catch(err => {
							if(err.response.data.status == 403) {
								this.$message.error('当前操作您没有权限');
							}
						})

				}

			},
			//开单并处理
			handle() {
				let miss = JSON.parse(localStorage.getItem('user_infor')).permissions;
				if(!miss.caseedit) {
					return
				}
				this.bao_flag = true;
				if(this.com == '' || this.com_phone == '' || this.com_name == '' || this.fault_text == '') {
					this.$message.error('客户名称、客户姓名 、联系电话、 故障现象描述为必填项!');
					return
				}
				if(this.handle_text == '' || this.fault_text == '') {
					this.$message.error('故障现象描述和处理方案记录为必填项!');
				} else {
					if(this.service_check2 === '') {
						console.log(this.service_check2)
						this.$message.error('服务目录请选择完整!');
						return
					} else {
						this.servi_str = this.service_list[this.service_check0].id + ',' + this.service_list[this.service_check0].childrenList[this.service_check1].id + ',' + this.service_list[this.service_check0].childrenList[this.service_check1].childrenList[this.service_check2].id;
					}
					let data = {
						caseAttachmentList: this.bog,
						peCase: {
							companiesName: this.com,
							contactName: this.com_name,
							contactPhone: this.com_phone,
							customerId: this.user_id,
							companiesId: this.com_id,
							caseFrom: this.launch,
							contactType: this.commun,
							contactNum: this.com_else,
							bugDescribe: this.fault_text,
							status: 'CASE_CODE_100',
						}
					};

					let remoteHelp = {
						helpRecord: this.handle_text,
						isSolve: this.que_flag,
						catalogs: this.servi_str
					}
					data.remoteHelp = remoteHelp;
					let datas = JSON.stringify(data)
					open_remote(datas)
						.then((val) => {
							console.log(val)
							if(val.data.status == '0') {
								this.$message.success('操作成功');
								this.$router.push({
									name: 'repairinfor'
								})
							}
						})
				}
			}
		},
		watch: {
			bog: {
				handler(newvalue, oldvalue) {
					if(newvalue.length > 3) {
						this.bog.pop();
					}
				}
			},
			launch: {
				handler(newvalue, oldvalue) {
					if(newvalue == 'WECHAT') {
						this.commun = 'WECHAT'
					} else if(newvalue == 'QQ') {
						this.commun = 'QQ'
					} else if(newvalue == 'DINGDING') {
						this.commun = 'DINGDING'
					} else if(newvalue == 'QT_IM') {
						this.commun = 'QT'
					}
				}
			}
		},
		created() {
			this.user_infor = JSON.parse(localStorage.getItem('user_infor'))
			this.com_id = this.$route.params.id;
			if(this.com_id == 'none') {
				this.com_id = '';
			}
			service_tree()
				.then((val) => {
					console.log(val)
					this.service_list = val.data.data;

				})
			if(this.$route.params.id !== 'none') {
				to_open_case(this.$route.params.id)
					.then((val) => {
						console.log(val)
						if(val.data.status == '200'){
							this.ready_flag = true;
						this.com = val.data.data.cname;
						this.com_name = val.data.data.contactName;
						this.com_phone = val.data.data.contactPhone;
						this.user_id = val.data.data.id;
						}
						

					}).catch(err=>{
					if(err.response.data.status == 403){
						this.$message.error('当前操作您没有权限');
					}
				})
					
			} else {
				this.ready_flag = false;

			}
		}
	}
</script>

<style lang="less" scoped>
	.open_repair {
		.baoxiu {
			overflow: hidden;
			background-color: #FFFFFF;
			padding: 10px 0;
			.bao_title {
				font-size: 14px;
				text-align: left;
				padding: 15px;
				display: block;
				font-weight: bold;
			}
			.baox_list {
				display: inline-block;
				height: 100%;
				float: left;
				font-size: 13px;
				margin-left: 30px;
				.el-input {
					width: 400px;
				}
			}
			.fault {
				height: 80px;
				a {
					font-size: 13px;
					float: left;
					padding-left: 6px;
				}
				.el-textarea {
					width: 65%;
					float: left;
					margin-left: 6px;
				}
			}
			.fault_enclo {
				height: 118px;
				position: relative;
				#file {
					position: absolute;
					top: 10px;
					left: 117px;
					width: 90px;
					height: 90px;
					opacity: 0;
					z-index: 1000;
				}
				.input_fo {
					width: 90px;
					height: 90px;
					position: absolute;
					left: 116px;
					top: 9px;
					font-size: 100px;
					text-align: center;
					color: #c9c9c9;
					border: 1px solid #c9c9c9;
					line-height: 90px;
					padding: 0 !important;
				}
				a {
					font-size: 13px;
					float: left;
					padding-left: 6px;
				}
				#img_list {
					height: 100px;
					float: left;
					margin-left: 121px;
					margin-top: 5px;
					img {
						margin-left: 10px;
					}
				}
			}
			button {
				float: left;
				margin-left: 115px;
			}
		}
		.repair {
			overflow: hidden;
			background-color: #FFFFFF;
			margin-top: 20px;
			padding-bottom: 15px;
			.bao_title {
				font-size: 14px;
				text-align: left;
				padding: 15px;
				display: block;
				font-weight: bold;
			}
			.fault {
				padding-top: 10px;
				height: 80px;
				a {
					font-size: 13px;
					float: left;
					padding-left: 30px;
				}
				.el-textarea {
					width: 65%;
					float: left;
					margin-left: 6px;
				}
			
				&:nth-child(3) {
					height: 60px;
					a {
						padding-left: 56px;
					}
				}
			}
			button {
				float: left;
				margin-left: 115px;
			}
		}
	}
</style>