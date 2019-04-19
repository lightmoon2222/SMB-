import axios from 'axios';

//SMB



//token
let token = localStorage.getItem("token")
//手机号验证
export let reg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
//手机号座机正则 
export let reg_exp = /0\d{2,3}-\d{7,8}/;

//
export let reg_exp2 = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
//电子邮箱验证
export let email_reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;

//登录接口
export function login(data) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/users/login',
		data: data
	})
}
//获取工作台检索公司
export function cname_list(cname) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/companies/cname_list',
		data: cname
	})
}

//报修服务目录 
export function service_tree() {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/case_catalogs/tree'
	})
}

//客户列表
export function user_lis(companiesListCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/companies/list',
		data: companiesListCo
	})
}
//客户详情
export function queryCusDetailById(id) {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/companies/detail?id=' + id
	})
}

//客户详情充值 
export function recharge(rechargeAmtRecordCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/wallet/recharge',
		data: rechargeAmtRecordCo
	})
}

//订单记录
export function list_orders(companiesListCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/order/list_orders',
		data: companiesListCo
	})
}
//用户管理
export function list_users(companiesListCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/users/list_users',
		data: companiesListCo
	})
}
//查询角色
export function roles(lis) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/roles/list_roles',
		data: lis
	})
}
//发票信息
export function qryBillRecordList(billRecordListCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/bill/qryBillRecordList',
		data: billRecordListCo
	})
}

//账户流水
export function account_flow(accFlowCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/accflow/list',
		data: accFlowCo
	})
}
//充值信息
export function recha_infor(rechargeListCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/recharge/list',
		data: rechargeListCo
	})
}
//删除客户某地址
export function delCusAddressById(id) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/customer/delCusAddressById',
		data: id
	})
}

//报修信息
export function repair(e, caseListCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/case/' + e,
		data: caseListCo
	})
}

//交付统计
export function deliver_token(token) {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/case/count?token=' + token
	})
}

//获取所有权限信息
export function list_permission() {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/permission/list_permission'
	})
}
//新建角色组 
export function crt_role(list) {
	return axios({
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			'token': token
		},
		url: '/apis/smb/roles/crt_role',
		data: list
	})
}

//点击编辑  获取角色组信息
export function info_role(id) {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/roles/info_role?id=' + id
	})
}
//保存编辑角色组
export function upt_role(list) {
	return axios({
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			'token': token
		},
		url: '/apis/smb/roles/upt_role',
		data: list
	})
}
//查询用户二维码
export function qrcode(userName) {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/users/qrcode?width=200&height=200&format=png&userName=' + userName
	})
}

//查询所有角色
export function query_roles() {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/users/query_roles'
	})
}

//新增用户 
export function crt_user(list) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/users/crt_user',
		data: list
	})
}
//点击编辑 获取角色信息 进行编辑
export function info_user(id) {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/users/info_user?id=' + id
	})
}

//点击编辑 获取角色信息 进行编辑
export function order_info(orderId) {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/order/order_info?orderId=' + orderId
	})
}
//保存编辑角色
export function upt_user(list) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/users/upt_user',
		data: list
	})
}

//发票详情
export function queryBillRecordById(id) {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/bill/queryBillRecordById?id=' + id
	})
}
//审核发票
export function auditBillRecord(billStateCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/bill/auditBillRecord',
		data: billStateCo
	})
}
//纸质开具发票
export function openBill(openInvoiceCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/bill/openBill',
		data: openInvoiceCo
	})
}
//开单页 获取数据
export function to_open_case(id) {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/companies/to_open_case?id=' + id
	})
}
//报修工单  开单
export function openOrder(peCase) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/case/open',
		data: peCase
	})
}
//报修工单 开单并处理 
export function open_remote(peCase) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/case/open_remote',
		data: peCase
	})
}

//用户编辑页
export function to_edit(id) {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/companies/to_edit?id=' + id
	})
}

//工单详情页
export function query_detail(id) {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/case/query_detail?id=' + id
	})
}

//工单详情页接单
export function insert(peReceiveCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/receive/insert',
		data: peReceiveCo
	})
}
//编辑客户详情页 摇号
export function member_num() {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/member_pool/member_num'
	})
}
//提交远程技术处理
export function solve(remoteHelp) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/remote_help/solve',
		data: remoteHelp
	})
}
//确认服务费用
export function orderss(orders) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/case_cost/orders',
		data: orders
	})
}
//获取公司默认地址  用于派单模块显示  
export function queryCusAddressListByCompanyId(companiesId) {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/customer/queryCusAddressListByCompanyId?companiesId=' + companiesId
	})
}
//获取所有工程师 
export function engrs() {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/list/engrs'
	})
}

//派上门单
export function order_insert(visit) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/visit/insert',
		data: visit
	})
}
//预约工程师
export function subscribe_enginner(visitUpdateCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/visit/subscribe_enginner',
		data: visitUpdateCo
	})
}
//工程师接单
export function confim_order(visitUpdateCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/visit/confim_order',
		data: visitUpdateCo
	})
}

//工程师出发
export function eng_go(visitUpdateCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/visit/go',
		data: visitUpdateCo
	})
}
//解决方案查询树
export function tree1() {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/salve_type/tree'
	})
}
//处理结果查询树
export function tree2() {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/salve_result/tree'
	})
}
//问题分类查询树
export function tree3() {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/catalogs/tree'
	})
}
//工程师离场里添加设备
export function insert_all(peServicesList) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/services/insert_all',
		data: peServicesList
	})
}
//更新打卡时间
export function sign_record(signRecordUpdateCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/engr/sign_record',
		data: signRecordUpdateCo
	})
}
//远程接寄修
export function inser_one(equipmentSendRevised) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/send_revised/insert',
		data: equipmentSendRevised
	})
}

//寄修完成
export function complete(id) {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/send_revised/complete?id=' + id,
	})
}
//编辑原有地址 
export function updateById(customerAddress) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/customer/updateById',
		data: customerAddress
	})
}
//新增地址 
export function insertCusAddress(customerAddress) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/customer/insertCusAddress',
		data: customerAddress
	})
}
//查询所有工程师 
export function ser_list(e) {
	return axios({
		method: 'get',
		headers: {
			'token': token
		},
		url: '/apis/smb/list/' + e,
	})
}
//修改工程师或者销售
export function upt_companies(record) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/companies/upt_companies',
		data: record
	})
}

//修改公司名称以及用户信息
export function editco(companiesEditCo) {
	return axios({
		method: 'post',
		headers: {
			'token': token
		},
		url: '/apis/smb/companies/edit',
		data: companiesEditCo
	})
}