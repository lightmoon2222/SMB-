import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		name: 'index',
		component: reslove => require(['@/components/index'], reslove),
		children: [
			{
				path: '/Workbench',
				name: 'Workbench',
				component: reslove => require(['@/components/Workbench'], reslove)
			},
			{
				path: '/cuslist',
				name: 'cuslist',
				component: reslove => require(['@/components/cusInfor/cus_list'], reslove)
			},
			{
				path: '/cusinfor/:id',
				name: 'cusinfor',
				component: reslove => require(['@/components/cusInfor/cus_infor'], reslove)
			},
			{
				path: '/orderrecord',
				name: 'orderrecord',
				component: reslove => require(['@/components/cusInfor/order_record'], reslove)
			},
			{
				path: '/repairinfor',
				name: 'repairinfor',
				component: reslove => require(['@/components/deliver/repair_infor'], reslove)
			},
			{
				path: '/invoiceinfor',
				name: 'invoiceinfor',
				component: reslove => require(['@/components/finance_infor/invoice_infor'], reslove)
			},
			{
				path: '/accountflow',
				name: 'accountflow',
				component: reslove => require(['@/components/finance_infor/account_flow'], reslove)
			},
			{
				path: '/userset',
				name: 'userset',
				component: reslove => require(['@/components/system_setup/user_set'], reslove)
			},
			{
				path: '/userinfor',
				name: 'userinfor',
				component: reslove => require(['@/components/system_setup/user_infor'], reslove)
			},
			{
				path: '/openrepair/:id',
				name: 'openrepair',
				component: reslove => require(['@/components/cusInfor/open_repair'], reslove)
			},
			{
				path: '/rechargeinfor',
				name: 'rechargeinfor',
				component: reslove => require(['@/components/finance_infor/recharge_infor'], reslove)
			},
			{
				path: '/list_myInit',
				name: 'list_myInit',
				component: reslove => require(['@/components/deliver/list_myInit'], reslove)
			},
			{
				path: '/list_myCharge',
				name: 'list_myCharge',
				component: reslove => require(['@/components/deliver/list_myCharge'], reslove)
			},
			{
				path: '/list_wait',
				name: 'list_wait',
				component: reslove => require(['@/components/deliver/list_wait'], reslove)
			},
			{
				path: '/list_not',
				name: 'list_not',
				component: reslove => require(['@/components/deliver/list_not'], reslove)
			},
			{
				path: '/invoice_details/:id',
				name: 'invoice_details',
				component: reslove => require(['@/components/finance_infor/invoice_details'], reslove)
			},
			{
				path: '/repair_details/:id',
				name: 'repair_details',
				component: reslove => require(['@/components/deliver/repair_details'], reslove)
			},
			{
				path: '/order_details/:id',
				name: 'order_details',
				component: reslove => require(['@/components/cusInfor/order_details'], reslove)
			}
		]
	},
	{
		path: '/login',
		name: 'login',
		component: reslove => require(['@/components/login'], reslove),
	},
	{
		path: '/index',
		name: 'indexs',
		component: reslove => require(['@/components/index'], reslove),
	}]
})