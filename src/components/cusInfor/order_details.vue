<template>
	<div class="repair_details">
		<div style="overflow: hidden;">
			<div class="cus_infor">
			
			</div>
			<div class="cus_service">
				<span><br />
			<img src="../../assets/image/default.png">
			<p>专属销售：</p>
		<!--	<p v-if="seller == null">专属销售：未分配</p>-->
			
		</span>
				<span>
			<img src="../../assets/image/default.png">
			<p>专属工程师：</p>
		<!--	<p v-if="engin == null">专属工程师：未分配</p>-->
		
		</span>
			</div>
		</div>

	</div>
</template>

<script>
	import { order_info } from '../../../static/public/public.js'
	export default {
		data() {
			return {
				com_infor:{},//公司信息
			}

		},
		created() {
			order_info(this.$route.params.id)
				.then(val => {
					console.log(val)
					this.com_infor = val.data.data;
				})
		

		},
		methods: {

		},
		watch: {

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