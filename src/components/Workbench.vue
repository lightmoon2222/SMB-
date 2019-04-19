<template>
	<div class="workbench">
		<p>SMB工作台</p>
		<div class="workbench_search">
			<el-input placeholder="请输入关键字" v-model.trim="work_search" size="small"></el-input>
			<el-button type="primary" class="search" @click="search">搜索</el-button>
			<div class="company_list" v-show="comflag">
				<div class="list_item" v-for="item in compan_list">
					<span>{{item.cname}}</span>
					<a @click="open_order(item.id)">开单</a>
				</div>
				<div class="list_item">
					<span>没找到匹配的公司?</span>
					<a @click="open_order('none')">开临时单</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { cname_list } from '../../static/public/public.js'
	export default {
		data() {
			return {
				work_search: '', //公司关键字
				compan_list: [], //根据关键字检索到的公司列表
				comflag: false,
			}
		},
		methods: {
			search() {
				let cname = this.qs.stringify({
					cname: this.work_search
				});
				cname_list(cname)
					.then((val) => {
						console.log(val)
						this.comflag = true;
						this.compan_list = val.data.data
					})
			},
			open_order(e) {
				this.$router.push({
					name: 'openrepair',
					params: {
						id: e
					}
				})
			}
		},
		watch: {
			work_search(newvalue, oldvalue) {
				if(newvalue == '') {
					this.comflag = false;
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.workbench {
		p {
			font-size: 40px;
			padding-top: 80px;
		}
		.workbench_search {
			overflow: hidden;
			width: 600px !important;
			margin: 0 auto;
			padding-top: 60px;
			.el-input {
				width: 480px !important;
				float: left;
				height: 40px;
			}
			button {
				width: 100px;
				float: left;
				border-radius: 0 !important;
				font-size: #e4e5e6;
			}
			.company_list {
				overflow: hidden;
				width: 479px;
				background-color: #FFFFFF;
				border: 1px solid #dcdfe6;
				height: 500px;
				overflow: scroll;
				overflow-x: hidden;
				.list_item {
					height: 30px;
					span {
						float: left;
						font-size: 13px;
						line-height: 30px;
						padding-left: 14px;
						color: #a7a7a7;
					}
					a {
						float: right;
						font-size: 13px;
						line-height: 30px;
						padding-right: 20px;
						cursor: pointer;
						color: #409EFF;
					}
					&:last-child {
						background-color: #f3fafe;
						span {
							color: #333333;
						}
					}
				}
			}
		}
	}
</style>