<template>
	<div class="repair_details">
		<div style="overflow: hidden;">
			<div class="cus_infor">
				<div class="cus_header">
					<div class="cuss">
						<span><a></a>{{company_name}}</span>
					</div>
					<div class="cus_list">
						<span>服务单号：{{ser_order}}</span>
						<span>报修时间：{{repair_time}}</span>
						<span>报修来源：{{repair_from}}</span>
						<span>问题分类：{{que_tree}}</span>
						<span>开单人：{{open_peo}}</span>
						<span>联系人：{{contant}} {{contant_phone}}</span>
						<span>故障现象：{{bug_infor}}</span>
					</div>
				</div>

			</div>
			<div class="cus_service">
				<span><br />
			<img src="../../assets/image/default.png">
			<p>专属销售：{{seller}}</p>
			<p v-if="seller == null">专属销售：未分配</p>
			
		</span>
				<span>
			<img src="../../assets/image/default.png">
			<p>专属工程师：{{engin}}</p>
			<p v-if="engin == null">专属工程师：未分配</p>
		
		</span>
			</div>
		</div>
		<div style="margin-top: 20px; overflow: hidden;">
			<div class="cus_address">
				<div class="cuss">
					<span><a></a>处理进度</span>
				</div>
				<div class="list_tree">
					<div class="treeone">
						<div class="list_item">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">接单</span>
								<el-button size="mini" v-if="big_data.status == 'CASE_CODE_100'" style="margin-top: 10px;" type="primary" @click="open_insert">接单</el-button>
								<a v-else>{{big_data.receiverName}}&nbsp;{{big_data.receiveTime}}</a>

							</div>
						</div>
						<div class="list_item" v-if="big_data.status !== 'CASE_CODE_100'">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">远程技术支持</span>
								<div class="false_two" v-if="big_data.isSolve == null" style="font-size: 13px;">
									<div class="textaa">
										<a style="display: inline-block;">处理方案记录:</a>
										<el-input type="textarea" v-model="plan_text">
										</el-input>
									</div>
									<div class="fault">
										<p>服务目录:</p>
										<div style="float: left;padding-left: 6px;width: 85%;margin-left: 12px;">
											<el-select v-model="ser_one">
												<el-option v-for="(item,index) in service_list" :key="item.id" :label="item.cataName" :value="index">
												</el-option>
											</el-select>
											<el-select v-model="ser_two" v-if="ser_one!=='' && service_list[ser_one].childrenList.length !== 0">
												<el-option v-for="(item,index) in service_list[ser_one].childrenList" :key="item.id" :label="item.cataName" :value="index">
												</el-option>
											</el-select>
											<el-select v-model="ser_thr" v-if="ser_one!=='' && ser_two!=='' && service_list[ser_one].childrenList[ser_two].childrenList.length !== 0">
												<el-option v-for="(item,index) in service_list[ser_one].childrenList[ser_two].childrenList" :key="item.id" :label="item.cataName" :value="index">
												</el-option>
											</el-select>
										</div>
									</div>
									<div class="plan_button">
										<span @click="push_but('RESOLVED')">问题已解决,关单</span>
										<span @click="push_but('UNRESOLVED_JX')">问题未解决,寄修</span>
										<span @click="push_but('UNRESOLVED_PD')">问题未解决,派单</span>
									</div>
								</div>
								<div class="true_two" v-else>

									<a>故障现象记录:&nbsp;{{bug_infor}}</a>
									<a>处理方案:&nbsp;{{big_data.helpRecord}}</a>
									<a v-if="big_data.isSolve == '1'">问题是否已解决:问题已解决,关单</a>
									<a v-else-if="big_data.isSolve == '2'">问题是否已解决:问题未解决,寄修</a>
									<a v-else>问题是否已解决:问题未解决,派单</a>
									<a>{{big_data.helperName}}&nbsp;{{big_data.rhUpdateTime}}</a>
								</div>

							</div>
						</div>
						<!--寄修-->
						<div class="list_item" v-if="big_data.rhSign == '远程技术支持' && big_data.isSolve == '2'">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">寄修</span>
								<div class="default_ic se_rapair" v-if="big_data.esrState">
									<a>服务商:&nbsp;{{big_data.facilitator}}</a>
									<a>寄修状态:&nbsp;{{big_data.esrState}}</a>
									<a>寄修时间:&nbsp;{{big_data.esrCreateTime}}</a>
									<a>寄修备注:&nbsp;{{big_data.esrRemark}}</a>
									<a>{{big_data.helperName}}&nbsp;{{big_data.updateTime}}</a>
									<a></a>
								</div>
								<div class="default_ic se_rapair defauly" v-else>
									<a>服务商:&nbsp;
										<el-select v-model="send_rapair" placeholder="请选择">
											<el-option value="ORIGINAL_FACTORY" label="原厂">
											</el-option>
											<el-option value="EDIANZU_REPAIR_CENTER" label="易点租整修中心">
											</el-option>
										</el-select>
									</a>
									<div>
										<a style="display: inline-block;float: left;margin-top: 7px;">备注：</a>
										<el-input type="textarea" v-model="ji_textarea">
										</el-input>
									</div>
									<span class="next_but" @click="send_repair">下一步</span>
								</div>

							</div>
						</div>
						<!--寄修完成-->
						<div class="list_item" v-if="big_data.esrState == '已寄修' ">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">寄修完成</span>

								<span class="next_but" @click="succ_repair">下一步</span>
							</div>
						</div>

					</div>
					<div class="treetwo">

						<!--派上门单-->
						<div class="list_item" v-if="big_data.rhSign == '远程技术支持' && big_data.isSolve == '3'">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">派上门单</span>
								<div class="false_four" v-if="big_data.isSolve == '3' && big_data.visitNum == null">
									<el-form label-position="right" label-width="110px" ref="form3" :rules="rules3" :model="user_register">
										<el-form-item label="最晚上门时间:" prop="time">
											<template>
												<el-date-picker v-model="user_register.time" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions0">
												</el-date-picker>
											</template>
										</el-form-item>

										<el-form-item label="上门地址:" prop="address_code">
											<template>
												<el-cascader size="large" :options="options" v-model="user_register.address_code" @change="handleChange">
												</el-cascader>
											</template>
										</el-form-item>
										<el-form-item prop="detail_address" label="详细地址:">

											<el-input v-model.trim="user_register.detail_address" size="small"></el-input>

										</el-form-item>
										<el-form-item label="备注信息:">
											<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="remarks_infor">
											</el-input>
										</el-form-item>
									</el-form>
									<span class="next_but" @click="push_engris('form3')">下一步</span>
								</div>
								<div class="true_four" v-if="big_data.visitNum !== null">
									<a>最晚上门时间:&nbsp;{{big_data.lastTime}}</a>
									<a>上门单备注:&nbsp;{{big_data.visitRemark}}</a>
									<a>{{big_data.vtCreatorName}}&nbsp;{{big_data.vtCreatetime}}</a>
								</div>

							</div>
						</div>
						<!--预约工程师-->
						<div class="list_item" v-if="big_data.visitNum !== null &&big_data.vtSign == '预约工程师' ">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">预约工程师</span>
								<div class="false_five" v-if="big_data.serviceType == null">
									<el-form label-position="right" label-width="100px" ref="form4" :rules="rules4" :model="appoi_register">
										<el-form-item label="服务商:" prop="service">
											<el-input v-model.trim="appoi_register.service" readonly size="small"></el-input>
										</el-form-item>
										<el-form-item label="工程师姓名:" prop="engrs_name">
											<el-select v-model="appoi_register.engrs_name" @change="changesel">
												<el-option v-for="(item,index) in engrs_options" :key="index" :label="item.realname" :value="index">
												</el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="联系电话:" prop="phone">
											<el-input v-model.trim="appoi_register.phone" size="small" type="number"></el-input>
										</el-form-item>
									</el-form>
									<span class="next_but" @click="appoi('form4')">下一步</span>
								</div>
								<div class="true_five" v-else>
									<a>服务商:&nbsp;{{big_data.serviceType}}</a>
									<a>工程师姓名:&nbsp;{{big_data.engineerName}}</a>
									<a>联系电话:&nbsp;{{big_data.engineerPhone}}</a>
									<a>{{big_data.subscribeEnginnerCreatorName}}&nbsp;{{big_data.subscribeEnnginnerTime}}</a>
								</div>

							</div>
						</div>
						<!--工程师接单-->
						<div class="list_item" v-if="big_data.visitNum !== null && big_data.serviceType !== null">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">工程师接单</span>
								<div class="true_six" v-if="big_data.engReceiveSign == '工程师接单'">
									<a>工程师接单时间:&nbsp;{{big_data.confirmOrderTime}}</a>
									<a>{{big_data.confirmOrderCreatorName}}&nbsp;{{big_data.confirmOrderCompleteTime }}</a>
								</div>
								<div class="false_six" v-if="big_data.engReceiveSign == null">
									工程师接单时间:
									<el-date-picker v-model="engir_start" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions0">
									</el-date-picker>
									<span class="next_but" @click="engir_st">下一步</span>
								</div>
							</div>
						</div>
						<!--分派工程师-->
						<div class="list_item" v-if="big_data.engReceiveSign == '工程师接单'">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">已分派工程师,等待出发</span>

								<div class="true_seven" v-if="big_data.signRecordVoList !== null">
									<a>工程师出发时间:&nbsp;{{big_data.signRecordVoList[0].signTime}}</a>
									<a>工程师姓名:&nbsp;{{big_data.signRecordVoList[0].engineerName}}</a>
									<a>{{big_data.signRecordVoList[0].engineerName}}&nbsp;{{big_data.signRecordVoList[0].createTime}}</a>
								</div>
								<div class="false_seven default_ic" v-if="big_data.satisfy == null">
									工程师出发时间:
									<el-date-picker v-model="engir_set" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions0">
									</el-date-picker>
									<span class="next_but" @click="engir_se('工程师出发时间','engir_set','START_OFF',0)">确定</span>
								</div>

							</div>
						</div>
						<div v-if="big_data.signRecordVoList">
							<!--工程师已出发-->
							<div class="list_item" v-if="big_data.signRecordVoList.length >=1">
								<span class="list_line">
							<span>
								<a></a>
							</span>
								</span>
								<div class="item_infor">
									<span class="item_name">工程师已出发,即将到场</span>
									<div class="true_eight" v-if="big_data.signRecordVoList[1]">
										<a>工程师到场时间:&nbsp;{{big_data.signRecordVoList[1].signTime}}</a>
										<a>{{big_data.signRecordVoList[1].engineerName}}&nbsp;{{big_data.signRecordVoList[1].createTime}}</a>
									</div>
									<div class="false_right default_ic" v-if="big_data.satisfy == null">
										工程师到场时间:
										<el-date-picker v-model="engir_totime" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions0">
										</el-date-picker>
										<span class="next_but" @click="engir_se('工程师到场时间','engir_totime','PRESENT',1)">确定</span>
									</div>

								</div>
							</div>
						</div>
					</div>
					<div v-if="big_data.signRecordVoList">
						<!--工程师已到场-->
						<div class="list_item" v-if="big_data.signRecordVoList.length >=2">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">工程师已到场</span>
								<div class="true_ten" v-if="big_data.signRecordVoList[2]">
									<a>开始任务时间:&nbsp;{{big_data.signRecordVoList[2].signTime}}</a>
									<a>{{big_data.signRecordVoList[2].engineerName}}&nbsp;{{big_data.signRecordVoList[2].createTime}}</a>
								</div>
								<div class="false_ten default_ic" v-if="big_data.satisfy == null">
									开始任务时间:
									<el-date-picker v-model="engir_statime" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions0">
									</el-date-picker>
									<span class="next_but" @click="engir_se('开始任务时间','engir_statime','SERVICE',2)">确定</span>
								</div>

							</div>
						</div>
					</div>
					<div v-if="big_data.signRecordVoList">
						<!--工程师执行任务中-->
						<div class="list_item" v-if="big_data.signRecordVoList.length >=3">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">工程师执行任务中</span>
								<div class="true_ele" v-if="big_data.signRecordVoList[3]">
									<a>工程师离场时间:&nbsp;{{big_data.signRecordVoList[3].signTime}}</a>
									<a>{{big_data.signRecordVoList[3].engineerName}}&nbsp;{{big_data.signRecordVoList[3].createTime}}</a>
								</div>
								<div class="false_ele default_ic" v-if="big_data.satisfy == null">
									工程师离场时间:
									<el-date-picker v-model="end_time" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions0">
									</el-date-picker>
									<span class="next_but" @click="engir_se('工程师离场时间','end_time','DEPART',3)">确定</span>
								</div>

							</div>
						</div>
					</div>
					<div v-if="big_data.signRecordVoList">
						<!--工程师已离场-->
						<div class="list_item" v-if="big_data.signRecordVoList.length == 4">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">工程师已离场</span>
								<div class="true_nine" v-if="big_data.peServicesVoList !== null">
									<span v-for="item in big_data.peServicesVoList" style="width: 400px; display: block;border: 1px solid #e9e9e9;padding: 5px;margin-top: 5px;">
									<a>序列号:{{item.devices}}</a>
									<a>解决方案:{{item.salveResultNames}}</a>
									<a>处理结果:{{item.salveTypeNames}}</a>
									<a>问题分类:{{item.catalogsNames}}</a>
									<a>故障详细描述:{{item.faultDesc}}</a>
									<a>处理方案详细描述:{{item.salveContent}}</a>
								</span>
								</div>
								<div class="flase_nine" v-if="big_data.peServicesVoList == null">
									<el-button size="mini" type="primary" class="creat_new" @click="push_serinfor">新增设备</el-button>

									<!--设备form表单-->
									<template>
										<div class="addeuqi" style="overflow: hidden;">
											<el-form v-for="(item,index) in addeuqi_form" :model="item" :rules="rules" :ref="index+1" :key="index" label-position="right" label-width="100px" class="demo-ruleForm">
												<el-form-item label="序列号:">
													<el-input v-model="item.seri_num" autocomplete="off"></el-input>
													<el-button type="danger" size="mini" @click="delete_arr(index)">X</el-button>
												</el-form-item>

												<el-form-item label="解决方案:">
													<el-select v-model="item.service_check0">
														<el-option v-for="(it,index) in fault_list" :key="it.id" :label="it.salveName" :value="index">
														</el-option>
													</el-select>
													<el-select v-model="item.service_check1" v-if="item.service_check0!=='' && fault_list[item.service_check0].childrenList.length !== 0">
														<el-option v-for="(it,index) in fault_list[item.service_check0].childrenList" :key="it.id" :label="it.salveName" :value="index">
														</el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="处理结果:">
													<el-select v-model="item.service_check2">
														<el-option v-for="(it,index) in handle_list" :key="it.id" :label="it.salveResultName" :value="index">
														</el-option>
													</el-select>
													<el-select v-model="item.service_check3" v-if="item.service_check2!=='' && handle_list[item.service_check2].childrenList.length !== 0">
														<el-option v-for="(it,index) in handle_list[item.service_check2].childrenList" :key="it.id" :label="it.salveResultName" :value="index">
														</el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="问题分类:">
													<el-select v-model="item.service_check4" @change="select0(item,index)">
														<el-option v-for="(it,index) in que_list" :key="it.id" :label="it.cataName" :value="index">
														</el-option>
													</el-select>
													<el-select v-model="item.service_check5" v-if="item.service_check4!=='' && que_list[item.service_check4].childrenList.length !== 0">
														<el-option v-for="(it,index) in que_list[item.service_check4].childrenList" :key="it.id" :label="it.cataName" :value="index">
														</el-option>
													</el-select>
													<el-select v-model="item.service_check6" v-if="item.service_check4!=='' && item.service_check5!=='' && que_list[item.service_check4].childrenList[item.service_check5].childrenList.length !== 0">
														<el-option v-for="(it,index) in que_list[item.service_check4].childrenList[item.service_check5].childrenList" :key="it.id" :label="it.cataName" :value="index">
														</el-option>
													</el-select>
												</el-form-item>

												<el-form-item label="故障详细描述:">
													<el-input v-model="item.faultext" type="textarea" autocomplete="off"></el-input>
												</el-form-item>
												<el-form-item label="处理方案描述:">
													<el-input v-model="item.handletext" type="textarea" autocomplete="off"></el-input>
												</el-form-item>
												<!--<el-form-item label="文件:">

												</el-form-item>-->
												<el-form-item>
												</el-form-item>
											</el-form>
											<div class="choose_flag">
												<span class="next_but" @click="add_euqi(10)">关单</span>
												<span class="next_but" @click="add_euqi(20)">寄修</span>
											</div>
										</div>
									</template>

									<!--寄修-->
								</div>

							</div>
						</div>

						<div v-if="big_data.peServicesVoList">
							<div v-if="big_data.peServicesVoList[0].salveFlag == '寄修'">
								<div class="list_item">
									<span class="list_line">
							<span>
								<a></a>
							</span>
									</span>
									<div class="item_infor">
										<span class="item_name">寄修</span>

										<div class="default_ic se_rapair" v-if="big_data.esrState">
											<a>服务商:&nbsp;{{big_data.facilitator}}</a>
											<a>寄修id:&nbsp;{{big_data.esrId}}</a>
											<a>寄修状态:&nbsp;{{big_data.esrState}}</a>
											<a>寄修时间:&nbsp;{{big_data.esrCreateTime}}</a>
											<a>寄修备注:&nbsp;{{big_data.esrRemark}}</a>
											<a>{{big_data.helperName}}&nbsp;{{big_data.updateTime}}</a>
											<a></a>
										</div>
										<div class="default_ic se_rapair defauly" v-else>
											<a>服务商:&nbsp;
												<el-select v-model="send_rapair" placeholder="请选择">
													<el-option value="ORIGINAL_FACTORY" label="原厂">
													</el-option>
													<el-option value="EDIANZU_REPAIR_CENTER" label="易点租整修中心">
													</el-option>
												</el-select>
											</a>
											<div>
												<a style="display: inline-block;float: left;margin-top: 7px;">备注：</a>
												<el-input type="textarea" v-model="ji_textarea">
												</el-input>
											</div>

											<span class="next_but" @click="send_repair">下一步</span>
										</div>

									</div>
								</div>
								<!--寄修完成-->
								<div class="list_item" v-if="big_data.esrState == '已寄修' ">
									<span class="list_line">
							<span>
								<a></a>
							</span>
									</span>
									<div class="item_infor">
										<span class="item_name">寄修完成</span>

										<span class="next_but" @click="succ_repair">下一步</span>
									</div>
								</div>

							</div>
						</div>

					</div>
					<div class="treethree">
						<!--确认服务费用-->
						<div class="list_item" v-if=" big_data.isSolve == '1' || (big_data.isSolve == '2' && big_data.esrState == '寄修完成') || (big_data.isSolve == '3' && big_data.peServicesVoList && big_data.esrState == null&& big_data.peServicesVoList[0].salveFlag !== '寄修') || (big_data.isSolve == '3'  && big_data.esrState == '寄修完成' && big_data.peServicesVoList && big_data.peServicesVoList[0].salveFlag == '寄修')">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">确认服务费用</span>
								<div class="false_three" v-if="big_data.isPaid == null">
									服务费用:
									<el-input size="mini" v-model.trim="service_price" @input="oninput" type="number"></el-input>
									<span class="next_but" @click="push_price">下一步</span>
								</div>
								<div class="true_three" v-else>
									<a>服务费用:{{big_data.totalPrice}}</a>
									<a>{{big_data.orderCreatorName}}&nbsp;{{big_data.orderCreateTime}}</a>
								</div>

							</div>
						</div>
						<!--待支付-->
						<div class="list_item" v-if="big_data.isPaid == 'YES'">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">待支付</span>
								<a>支付方式:{{big_data.payWay}}</a>
								<a>支付时间:{{big_data.paidTime}}</a>
								<a>{{big_data.payCreatorName}}&nbsp;{{big_data.paidTime}}</a>
							</div>
						</div>
						<!--已支付 评价-->
						<div class="list_item" v-if="big_data.satisfy !== null">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">已支付,待评价</span>
								<a>满意度:{{big_data.satisfy}}</a>
								<a>{{big_data.receiverName}}&nbsp;{{big_data.receiveTime}}</a>
							</div>
						</div>
						<div class="list_item" v-if="big_data.completedSign == '已完成'">
							<span class="list_line">
							<span>
								<a></a>
							</span>
							</span>
							<div class="item_infor">
								<span class="item_name">已完成</span>

							</div>
						</div>
					</div>
				</div>

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
	</div>
</template>

<script>
	import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
	import { query_detail, insert, solve, orderss, queryCusAddressListByCompanyId, engrs, order_insert, subscribe_enginner, confim_order, eng_go, sign_record, inser_one, complete, tree1, tree2, tree3, insert_all, service_tree, reg } from '../../../static/public/public.js'
	export default {
		data() {
			var phonechec = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入手机号'));
				} else if(!reg.test(value)) {
				callback(new Error('请输入正确的手机号'));
					
				}else{
					callback();
				}
			};
			return {
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},

				company_name: '', //公司名称
				ser_order: '', //服务单号
				repair_time: '', //报修时间
				repair_from: '', //报修来源
				que_tree: '', //问题分类
				open_peo: '', //开单人
				contant: '', //联系人
				contant_phone: '', //联系人电话
				bug_infor: '', //故障现象
				seller: '', //销售
				engin: '', //工程师
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
				big_data: [], //总体数据
				plan_text: '', //处理方案记录
				companiesId: '', //公司id
				service_price: '', //服务费用
				//派上门单
				user_register: {
					time: '',
					name: '',
					address_code: [], //地址code数组
					address: '', //地址字符串
					detail_address: '', //详细地址
				},
				//预约工程师
				appoi_register: {
					service: '自有工程师', //服务商
					engrs_name: '', //工程师名字
					phone: '', //工程师手机号
					engriid: '', //工程师id
				},
				options: regionData,
				selectedOptions: [],
				remarks_infor: '', //备注信息
				default_address: [], //默认地址数组 存放code
				engrs_options: [], //所有工程师
				rules3: {
					time: [{
						required: true,
						type: 'date',
						trigger: 'change',
						message: '请选择日期'
					}],

					address: [{
						required: true,
						message: '请选择地址',
						trigger: 'change'
					}],
					detail_address: [{
						required: true,
						message: '请填写详细地址',
						trigger: 'blur'
					}]
				},
				rules4: {
					phone: [{
						validator: phonechec,
						trigger: 'blur'
					}],
					engrs_name: [{
						required: true,
						message: '请选择工程师',
						trigger: 'change'
					}],
				},
				engir_start: '', //工程师接单时间
				engir_set: '', //工程师出发时间
				engir_totime: '', //工程师到场时间
				visitId: '', //上门单id
				visitNum: '', //上门单编号
				engrIds: '', //工程师id
				engir_statime: '', //开始任务时间
				end_time: '', //工程师离场时间
				send_rapair: 'EDIANZU_REPAIR_CENTER', //寄修参数
				ser_list: [1], //设备list
				addeuqi_form: [{
					seri_num: '', //序列号
					faultext: '', //故障现象描述
					handletext: '', //处理方案描述
					service_check0: '',
					service_check1: '',
					service_check2: '',
					service_check3: '',
					service_check4: '',
					service_check5: '',
					service_check6: '',

				}],
				ji_textarea: '', //寄修备注
				fault_list: [], //解决方案list
				handle_list: [], //处理结果list
				que_list: [], //问题分类list
				rules: {

					seri_num: [{
						required: true,
						message: '序列号不能为空',
						trigger: 'blur'
					}],
					faultext: [{

						required: true,
						message: '故障现象描述不能为空',
						trigger: 'blur'
					}],
					handletext: [{
						required: true,
						message: '处理方案描述不能为空',
						trigger: 'blur'
					}]
				},
				ser_one: '',
				ser_two: '',
				ser_thr: '',
				service_list: [],

			}

		},
		created() {
			this.get_data()
			//解决方案
			tree1()
				.then(val => {
					console.log(val)
					this.fault_list = val.data.data
				})
			tree2()
				.then(val => {
					console.log(val)
					this.handle_list = val.data.data
				})
			tree3()
				.then(val => {
					console.log(val)
					this.que_list = val.data.data
				}).catch(err => {
					if(err.response.data.status == 403) {
						this.$message.error('当前操作您没有权限');
					}
				})

			service_tree()
				.then((val) => {
					console.log(val)
					this.service_list = val.data.data;

				})

		},
		methods: {
			select0(a, b) {
				this.addeuqi_form[b].service_check5 = '';
				this.addeuqi_form[b].service_check6 = '';
			},
			//寄修完成
			succ_repair() {

				complete(this.big_data.esrId)
					.then(val => {
						console.log(val)
						this.get_data()
					})
			},
			get_data() {
				query_detail(this.$route.params.id)
					.then((val) => {
						console.log(val.data.data)
						console.log(val.data.data.signRecordVoList)
						this.que_tree = val.data.data.caseCatalogsName;
						this.company_name = val.data.data.companiesName;
						this.ser_order = val.data.data.caseNum;
						this.repair_time = val.data.data.createTime;
						this.repair_from = val.data.data.caseFrom;
						this.open_peo = val.data.data.creatorName;
						this.contant = val.data.data.contactName;
						this.contant_phone = val.data.data.contactPhone;
						this.bug_infor = val.data.data.bugDescribe;
						this.seller = val.data.data.sellerRealname;
						this.engin = val.data.data.engrRealname;
						this.big_data = val.data.data;
						this.visitId = val.data.data.vtId;
						this.visitNum = val.data.data.visitNum;
						this.companiesId = val.data.data.companiesId;
						this.engrIds = val.data.data.engineerId;
						console.log(val.data.data)
						if(val.data.data.orderMonthlyInfos.length == 0) {

						} else {
							val.data.data.orderMonthlyInfos.forEach((item, index) => {
								this.cus_list[index].number = item.number
							})
						}
					});
			},
			//工单详情接单操作
			open_insert() {
				let data = {
					caseId: this.big_data.id,
					caseNum: this.big_data.caseNum,
					bugRecord: this.big_data.bugDescribe
				}
				let peReceiveCo = JSON.stringify(data)
				insert(peReceiveCo)
					.then((val) => {
						console.log(val)
						if(val.data.status == '0') {
							this.get_data()
						}

					})
			},
			//远程处理结果操作
			push_but(e) {
				console.log(this.ser_thr)
				if(this.ser_thr === '') {
					this.$message.error('服务目录请选择完整');
					return
				} else if(this.plan_text == '') {
					this.$message.error('处理方案记录为必填项');
					return
				}
				let catalogs = this.service_list[this.ser_one].id + ',' + this.service_list[this.ser_one].childrenList[this.ser_two].id + ',' + this.service_list[this.ser_one].childrenList[this.ser_two].childrenList[this.ser_thr].id;
				let data = {
					id: this.big_data.rhId,
					caseId: this.big_data.id,
					caseNum: this.big_data.caseNum,
					helpRecord: this.plan_text,
					isSolve: e,
					catalogs: catalogs
				}
				let remoteHelp = JSON.stringify(data)
				solve(remoteHelp)
					.then(val => {
						console.log(val)
						if(val.data.status == '0') {
							this.get_data()
						}
					})
			},
			//寄修
			send_repair() {
				let data = {
					caseId: this.big_data.id,
					caseNum: this.big_data.caseNum,
					facilitator: this.send_rapair,
					remark: this.ji_textarea
				}
				let equipmentSendRevised = JSON.stringify(data)
				inser_one(equipmentSendRevised)
					.then(val => {
						console.log(val)
						if(val.data.status == '0') {
							this.get_data()
						}
					})
			},
			//填写服务费用操作
			push_price() {
				if(this.service_price == '') {
					this.$message.error('服务费用不能为空');
				} else {
					let data = {
						caseId: this.big_data.id,
						companiesId: this.companiesId,
						caseNum: this.big_data.caseNum,
						unitPrice: this.service_price,
						totalPrice: this.service_price,
						contactName: this.contant,
						contactPhone: this.contant_phone
					}
					let orders = JSON.stringify(data)

					orderss(orders)
						.then(val => {
							console.log(val)
							if(val.data.status == '0') {
								this.get_data()
							}
						})

				}
			},
			//工程师接单操作
			engir_st() {
				if(this.engir_start == '') {
					this.$message.error('工程师接单时间不能为空');
				} else {
					let data = {
						id: this.big_data.vtId,
						caseId: this.big_data.id,
						confirmOrderTime: this.myFunction(this.engir_start)
					}
					let visitUpdateCo = JSON.stringify(data)

					confim_order(visitUpdateCo)
						.then(val => {
							console.log(val)
							if(val.data.status == '0') {
								this.get_data()
							}
						})

				}

			},
			//工程师出发
			engir_se(e, c, d, b) {
				if(this[c] == '') {
					this.$message.error(e + '不能为空');
				} else {

					let data = {
						visitId: this.visitId,
						visitNum: this.visitNum,
						caseId: this.big_data.id,
						caseNum: this.big_data.caseNum,
						engineerId: this.big_data.engineerId,
						engineerName: this.big_data.engineerName,
						signTime: this.myFunction(this[c]),
						signType: d
					}
					if(this.big_data.signRecordVoList && this.big_data.signRecordVoList[b]) {
						data.id = this.big_data.signRecordVoList[b].id
					}
					let signRecordUpdateCo = JSON.stringify(data);
					sign_record(signRecordUpdateCo)
						.then(val => {
							console.log(val)
							if(val.data.status == '0') {
								this.get_data()
							}
						})
				}

			},
			//工程师到场时间操作
			engir_to() {
				if(this.engir_totime == '') {
					this.$message.error('工程师到场时间不能为空');
				}
			},
			handleChange(e) {
				console.log(e)
				let arr = ''
				e.forEach((val) => {
					arr += CodeToText[val]
				})

				this.user_register.address = arr;
				console.log(this.user_register.address)
			},
			push_engris(e) {
				this.$refs[e].validate((valid) => {
					if(valid) {
						let data = {
							caseId: this.big_data.id,
							caseNum: this.big_data.caseNum,
							lastTime: this.myFunction(this.user_register.time),
							visitAddress: this.user_register.address + this.user_register.detail_address,
							visitRemark: this.remarks_infor,
							contactName: this.contant,
							contactPhone: this.contant_phone
						}
						let visit = JSON.stringify(data)

						order_insert(visit)
							.then(val => {
								console.log(val)
								if(val.data.status == '0') {
									this.get_data()
								}
							})
					} else {
						console.log('有错')
						return false;
					}
				});
			},
			changesel(e) {
				console.log(e)
				console.log(this.engrs_options[e])
				if(this.engrs_options[e].phone !== null) {
					this.appoi_register.engriid = this.engrs_options[e].id
					this.appoi_register.phone = this.engrs_options[e].phone
					this.appoi_register.engrs_name = this.engrs_options[e].realname
				} else {
					this.appoi_register.phone = '';
					this.appoi_register.engrs_name = this.engrs_options[e].realname;
					this.appoi_register.engriid = this.engrs_options[e].id;
				}
			},
			appoi(e) {
				this.$refs[e].validate((valid) => {
					if(valid) {
						let data = {
							id: this.big_data.vtId,
							caseId: this.big_data.id,
							engineerId: this.appoi_register.engriid,
							engineerName: this.appoi_register.engrs_name,
							engineerPhone: this.appoi_register.phone,
							serviceType: 'OWN'
						}

						let visitUpdateCo = JSON.stringify(data)
						subscribe_enginner(visitUpdateCo)
							.then(val => {
								this.get_data()
								if(val.data.status == '0') {
									this.get_data()
								}
							})

					} else {
						console.log('有错')
						return false;
					}
				});
			},
			//转换时间格式  将UTC格式转换为正常时间格式
			   myFunction(e) {              
				var dateee = new Date(e).toJSON();           
				var date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')            
				return date

			},
			//开始任务时间操作
			engir_startbut() {
				if(this.engir_statime == '') {
					this.$message.error('开始任务时间不能为空');
				}
			},
			//工程师离场时间
			end_timebut() {
				if(this.end_time == '') {
					this.$message.error('工程师离场时间不能为空');
				}
			},
			push_serinfor() {

				this.$set(this.ser_list, this.ser_list.length, this.ser_list[this.ser_list.length - 1] + 1);
				this.addeuqi_form.push({
					seri_num: '',
					faultext: '',
					handletext: '',
					service_check0: '',
					service_check1: '',
					service_check2: '',
					service_check3: '',
					service_check4: '',
					service_check5: '',
					service_check6: '',

				})
			},
			//提交设备form
			add_euqi(e) {
				let data = {
					peServicesList: []
				}
				this.addeuqi_form.forEach((item, index) => {
					if(item.seri_num == '' || item.faultext == '' || item.handletext == '') {
						this.$message.error('序列号、故障详细描述以及处理方案描述都是必填的');

					} else if(item.service_check0 === '' || item.service_check3 === '' || (this.que_list[item.service_check4].childrenList[item.service_check5].childrenList.length !== 0 && item.service_check6 === '')) {
						this.$message.error('多级下拉菜单请选择完整!');

					} else {
						let salveType = '';
						let catalogs = '';
						if(this.fault_list[item.service_check0].childrenList[item.service_check1]) {
							salveType = this.fault_list[item.service_check0].id + ',' + this.fault_list[item.service_check0].childrenList[item.service_check1].id
						} else {
							salveType = this.fault_list[item.service_check0].id
						}
						if(this.que_list[item.service_check4].childrenList[item.service_check5].childrenList.length !== 0 && item.service_check6 !== '') {
							catalogs = this.que_list[item.service_check4].id + ',' + this.que_list[item.service_check4].childrenList[item.service_check5].id + ',' + this.que_list[item.service_check4].childrenList[item.service_check5].childrenList[item.service_check6].id;
						} else if(this.que_list[item.service_check4].childrenList[item.service_check5].childrenList.length == 0) {
							catalogs = this.que_list[item.service_check4].id + ',' + this.que_list[item.service_check4].childrenList[item.service_check5].id
						}
						let salveResult = this.handle_list[item.service_check2].id + ',' + this.handle_list[item.service_check2].childrenList[item.service_check3].id

						data.peServicesList.push({
							caseId: this.big_data.id,
							visitId: this.visitId,
							visitNum: this.visitNum,
							engerId: this.engrIds,
							devices: item.seri_num,
							faultDesc: item.faultext,
							salveContent: item.handletext,
							salveType: salveType,
							salveResult: salveResult,
							catalogs: catalogs,
							salveFlag: e
						})

					}
					if(data.peServicesList.length == this.addeuqi_form.length) {
						let peServicesList = JSON.stringify(data)
						insert_all(peServicesList)
							.then(val => {
								console.log(val)
								if(val.data.status == '0') {
									this.get_data()
								}
							})
						console.log(peServicesList)
					}

				})

			},
			delete_arr(e) {
				if(this.ser_list.length == 1) {
					this.$message.error('服务设备最少为1个');
					return
				}
				this.$confirm('此操作将删除该设备信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.ser_list.splice(e, 1);
					this.addeuqi_form.splice(e, 1)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			oninput(e) {
				// 通过正则过滤小数点后两位
				this.service_price = (this.service_price.match(/^\d*(\.?\d{0,2})/g)[0]) || null

			}

		},
		watch: {
			//公司默认地址  需要渲染在页面上
			'big_data.isSolve': {
				handler(newvalue, oldvalue) {
					if(newvalue == 3) {
						queryCusAddressListByCompanyId(this.companiesId)
							.then(val => {
								console.log(val.data.data)
								if(val.data.data == null) {
									this.selectedOptions = []
								} else {
									this.user_register.address_code.push(val.data.data[0].proviceCode)
									this.user_register.address_code.push(val.data.data[0].cityCode)
									this.user_register.address_code.push(val.data.data[0].areaCode)
									this.user_register.detail_address = val.data.data[0].detailAddress;
								}
								console.log(this.user_register.address_code)

							})
						engrs()
							.then(val => {

								this.engrs_options = val.data.data;
								console.log()
							})
					}
				}
			}
		}
	}
</script>

<style scoped lang="less">
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
	
	.el-steps {
		float: right;
		width: 78%;
	}
	
	.cus_infor {
		background-color: #FFFFFF;
		width: 78%;
		overflow: hidden;
		float: left;
		.cus_header {
			float: left;
			width: 100%;
			.cus_list {
				overflow: hidden;
				padding: 10px 0 30px 0;
				span {
					width: 31%;
					display: inline-block;
					font-size: 12px;
					text-align: left;
					float: left;
					padding: 4px 0 4px 16px;
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
		.list_tree {
			width: 75%;
			float: right;
			.list_item {
				overflow: hidden;
				position: relative;
				z-index: 100;
				.list_line {
					width: 16px;
					height: 100%;
					display: inline-block;
					position: absolute;
					left: 0;
					z-index: 102;
					span {
						width: 13px;
						height: 13px;
						display: inline-block;
						border: 1px solid #06a6f9;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						background-color: #FFFFFF;
						a {
							display: inline-block;
							width: 7px;
							height: 7px;
							background-color: #06a6f9;
							border-radius: 50%;
						}
					}
					.line {
						width: 1px;
						height: 71%;
						background-color: #06a6f9;
						text-align: center;
						display: inline-block;
					}
				}
				.item_infor {
					float: left;
					padding-left: 10px;
					width: 95%;
					height: 100%;
					text-align: left;
					margin-left: 7px;
					border-left: 1px solid #06a6f9;
					padding-left: 15px;
					.false_two {
						padding: 10px 0;
					}
					.item_name {
						display: block;
						font-size: 14px;
						color: #67bdf9;
					}
					a {
						padding: 1px 0;
						font-size: 12px;
						display: block;
						line-height: 20px;
						&:last-child {
							color: #a7a8a7;
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
		padding-bottom: 20px;
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