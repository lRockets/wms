<style lang='scss'>
.login-container{
	position: relative;
	width: 1100px;
	height: 570px;
	margin:99px auto;
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	background: #ffffff;
	border-radius: 10px;
	z-index: 11;
	.geometry1{
	  position: absolute;
	  width: 0;
	  height: 0;
	  right: 320px;
	  bottom: -46px;
	  border-width:46px 78px 0 ;
	  border-style:solid;
	  border-color:#c4f0e9 transparent transparent ;
	}
	.geometry2{
	  position: absolute;
	  width: 0;
	  height: 0;
	  right: -94px;
	  top:150px;
	  border-width:58px 0px 58px 94px;
	  border-style:solid;
	  border-color: transparent transparent transparent #f7e6da;
	  z-index: 10;
	}
	.geometry3{
	  position: absolute;
	  width: 0;
	  height: 0;
	  right: -68px;
	  top:222px;
	  border-width:43px 0px 43px 68px;
	  border-style:solid;
	  z-index: 9;
	  border-color: transparent transparent transparent #f5d8dc;
	}
  }
  .content-left{
	height: 570px;
	width: 583px;
	background: url("../assets/images/login/back2.png") 0 0 no-repeat;
	position: relative;
	h2{
	  font-family: MicrosoftYaHei-Bold;
	  font-size: 24px;
	  font-weight: 600;
	  line-height: 30px;
	  letter-spacing: 2px;
	  color: #fefefe;
	  display: inline-block;
	  margin: 20px ;
	}
	.imgBox{
	  width: 399px;
		height: 269px;
	  position: absolute;
	  top:50%;
	  left:50%;
	  margin-left:-202px;
	  margin-top:-135px;
	  text-align: center; 
	  img{
		width: 100%;
	  }
	}
  }
  .content-wrap{
	margin:0 auto;
	h2{
	  font-size: 24px;
	  line-height: 30px;
	  letter-spacing: 2px;
	  color: #333333;
	  margin-bottom: 36px;
	}
	.el-input--prefix .el-input__inner{
	  padding-left: 56px;
	}
	.el-input__prefix{
	  left: 10px;
	  width: 39px;
	  i{
		font-family: MicrosoftYaHei;
		font-size: 14px;
		line-height: 44px;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #333333;
	  }
	} 
	.account .el-input__prefix{
	  background: url(../assets/images/login/account.png) center center no-repeat;
	  background-size: 28px 28px;
	}
	.password .el-input__prefix{
	  background: url(../assets/images/login/password.png) center center no-repeat;
	  background-size: 27px 27px;
	}
	.el-input ,.el-input__inner{
	  width: 300px;
	  height: 44px !important;
	  line-height: 44px !important;
	}
	.el-button{
	  width: 300px;
	  height: 44px;
	  background-color: #39b9fe;
	  border-radius: 4px;
	  letter-spacing: 3px;
		color: #ffffff;
	  font-size: 18px;
	}
	p{
	  font-family: MicrosoftYaHei;
	  font-size: 14px;
	  letter-spacing: 0px;
	  color: #999999;
	  text-align: center;
	  line-height: 14px;
	}
	
  }
  .geometry4{
	content: '';
	position: absolute;
	width: 100%;
	height: 0;
	right: -540px;
	top: 58px;
	border-width: 0px 98px 170px 293px;
	border-style: solid;
	z-index:-9999;
	border-color: transparent transparent #cfebfc transparent;
	transform:rotate(30deg);
	  -ms-transform:rotate(30deg); 	/* IE 9 */
	  -moz-transform:rotate(30deg); 	/* Firefox */
	  -webkit-transform:rotate(30deg); /* Safari 和 Chrome */
	  -o-transform:rotate(30deg); 	/* Opera */
  }
  
</style>
<style lang="scss">
  .copyright {
	position: absolute;
	width: 100%;
	bottom: 30px;
	text-align: center;
	color: #666;
  }
  
</style>
<template>
  <div style="height: 100%;position: fixed;width: 100%;background-color: #f5f7fb;">
	<div class="login-container">
	  <div class="content-left">
		<h2>精臣·WMS</h2>
		<div class="imgBox"><img src="../assets/images/login/back1.png"/></div>
	  </div>
	  <div class="content-wrap">
		<h2>用户登录</h2>
		<el-form ref="reqParam" :model="reqParam" :rules="reqParamRule"  label-width="0" class="form-container">
		  <el-form-item  prop="phone">
			<el-input :clearable="true"  v-model="reqParam.phone" @keyup.enter.native="login" :maxlength="11" placeholder="请输入账号" class="account">
			   <i slot="prefix"></i>
			</el-input>
		  </el-form-item>
		  <el-form-item prop="password">
			<el-input type="password" :clearable="true" v-model="reqParam.password" @keyup.enter.native="login" class="password" :minlength="6" :maxlength="20" placeholder="请输入密码">
			  <i slot="prefix" ></i>
			</el-input> 
		  </el-form-item>
		  <el-form-item>
			<el-button @keydown.enter="login"  @click="login" >登录</el-button>
		  </el-form-item>
		  <el-form-item style="text-align: center;">
			<span style="cursor: pointer; color: #aaa;" @click="retrieve_pass">忘记密码，点击找回</span>
		  </el-form-item>
		</el-form>
	  </div>
	  <span class='geometry1'></span>
	  <span class='geometry2'></span>
	  <span class='geometry3'></span>
	</div>
	<span class='geometry4'></span>
	<p class="copyright">精臣 · WMS  版权所有©2017-2018</p>
	<el-dialog title="找回密码" :visible.sync="retrieve_password" class="retrieve_pass" :modal-append-to-body="false" @close='resetRetrieve'>
	  <div class="crumbs">
		<ul>
		  <li :class="[active==1?'current':'']"><span>1.验证手机号</span></li>
		  <li :class="[active==2?'current':'']"><span>2.设置新密码</span></li>
		  <!--<li :class="[active==3?'current':'']"><span>3.密码重置成功</span></li>-->
		</ul>
	  </div>
	  <el-form :model="resetForm1" ref="resetForm1" :rules="resetRules1" v-show="active==1" >
		<el-form-item prop="phone">
		  <el-input placeholder="请输入手机号" v-model="resetForm1.phone" clearable maxlength="11" class="account">
			<i slot="prefix">账号：</i>
		  </el-input>
		</el-form-item>
		<el-form-item style="margin-bottom: 0;" prop="code">
		  <el-input placeholder="请在此输入验证码 " v-model="resetForm1.code" clearable maxlength="6" style="width:270px;">
			<i slot="prefix">验证码：</i>
		  </el-input>
		  <el-button @click="getCode2" :disabled="reset.canGetCode" style="width:100px;padding:12px 15px;margin-left: 7px;">{{reset.loginCodeTxt}}</el-button>
		</el-form-item>
		<el-form-item class="handle-btn-wrap clearfix" label="">
		  <el-button @click="next">下一步</el-button>
		</el-form-item>
	  </el-form>
	  <el-form :model="resetForm2" ref="resetForm2" :rules="resetRules2" v-show="active==2">
		<el-form-item prop="new_pwd">
		  <el-input placeholder="请输入新密码" type="password" clearable maxlength="20" v-model="resetForm2.new_pwd">
			<i slot="prefix">新密码：</i>
		  </el-input>
		</el-form-item>
		<el-form-item style="margin-bottom: 0;" prop="again_pwd">
		  <el-input placeholder="请再次输入密码" type="password" clearable maxlength="20" v-model="resetForm2.again_pwd" class="again_pwd">
			<i slot="prefix">确认密码：</i>
		  </el-input>
		</el-form-item>
		<el-form-item class="handle-btn-wrap">
		  <el-button @click="confirmPwd">确认提交</el-button>
		</el-form-item>
	  </el-form>
	</el-dialog>
  </div>
</template>
<script>
  export default {
	data(){
	  const checkPassword = (rule, value, callback) => {  //确认密码
		let v = value.toString().trim();
		// let flag = /^[a-zA-Z0-9_]{8,16}$/.test(v);
		let flag = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
		if (!flag) {
		  if (callback) callback(new Error('密码格式由6-20位的字母和数字组成!'));
		} else if (v != this.resetForm2.new_pwd) {
		  callback(new Error('两次输入密码不一致!'));
		} else {
		  callback();
		}
	  };
	  return {
		reqParam: {
		  phone: "",
		  password:"",
		  pwd: "",
		},
		reqParamRule:{
		  phone: [{required: true, trigger: 'blur', validator: this.$Util.RegExp.phoneReg}],
		  password: [{required: true, trigger: 'blur', validator: this.$Util.RegExp.passwordReg}]
		},
		retrieve_password:false,
		//步骤
		active:1,
		//重置密码表单1
		resetForm1: {
		  phone: '',
		  code: ''
		},
		reset: {
		  timer: null,
		  count: 60,
		  loginCodeTxt: '获取验证码',  // 登录获取验证码
		  canGetCode: false,  //获取验证码按钮是否禁用
		},
		//重置密码验证规则1
		resetRules1: {
		  phone: [{required: true, trigger: 'change', validator: this.$Util.RegExp.phoneReg}],
		  code: [{required: true, message: '请输入验证码', trigger: 'change'}],
		},
		//重置密码 确认密码相同规则
		resetForm2: {
		  new_pwd: '',
		  again_pwd: ''
		},
		resetRules2: {
		  new_pwd: [{required: true, trigger: 'change', validator: this.$Util.RegExp.passwordReg}],
		  again_pwd: [{required: true, trigger: 'change', validator: checkPassword}]
		},
	  }
	},
	methods: {
	  resetFrom(){   //重置
		this.$refs['reqParam'].resetFields();
	  },
	  login(){            // 登录
		this.$refs.reqParam.validate(valid => {
		  if (valid) {
			sessionStorage.clear();
			this.reqParam.pwd=this.reqParam.password
			this.reqParam.pwd=this.$md5(this.reqParam.pwd)
			delete this.reqParam.password
			let json_reqParam=JSON.stringify(this.reqParam)
			this.$ajaxPost("wms/login.do",{reqParam:json_reqParam}).then(({data}) => {
			  if (data.code === 200) {
				//重置表单  方便退出登录
				this.resetFrom();
				var outer_data = data.data.user;
				this.$Cookies.set('token',data.data.loginToken);
				this.getLeftMenu();
				// console.log(outer_data)
				Object.keys(outer_data).forEach(e => {
				  this.$Cookies.set(e, outer_data[e]);           // 返回的数据存在cookie里面
				});
			  } else {
				this.$message.error(data.msg);
			  }
			});
		  }else{
			return false
		  }
		})
	  },
	  getLeftMenu(){
		 this.$ajaxPost('wms/homepage/selectUserPermissionTree.do',{}).then(({data})=>{
		  if (data.code == 200) {
		  	// cpon
			sessionStorage.setItem('permissionListPC', JSON.stringify(data.data.permissionListPC));
			console.log(sessionStorage.getItem('permissionListPC'))
			this.go();
		  } else {
			this.$message.error(data.msg)
		  }
		})
	  },
	 /* getMa(){
		this.$ajaxPost("Erp/Index/getSms", {tel: this.form.tel});
	  },*/
	  checkLogin(){       // 如果有 就直接进入
		let Token = this.$Cookies.get("token");
		if (Token) {
		  this.go();
		}
	  },
	  go(){   // 进入用户的第一个页面
		let path = '/home';
		let result = this.$Util.checkTagExist(path,this);
		if(result.idx == -1){
		  this.$store.dispatch('addDynamicTags', {
			path: path,
			name: '首页'
		  })
		}
		this.$router.push(path);
		/*this.$ajaxPost("Erp/Index/getDataDictionary", {company_id: this.$Cookies.get("company_id"),role_id: this.$Cookies.get("role_id")}).then(({data})=>{
		  if(data.code==1){
			window.dictionary = data.data;
			let path = this.getFirstPath(data.data.get_Menu);
			let result = this.$Util.checkTagExist(path,this);
			if(result.idx == -1){
			  /!*this.$store.state.dynamicTags.push({
				path: path,
				name: data.data.get_Menu[0].children[0].children[0].alias
			  });*!/
			  this.$store.dispatch('addDynamicTags', {
				path: path,
				name: data.data.get_Menu[0].children[0].children[0].alias
			  })
			}
			this.$router.push(path);
		  //  改变 vuex 里面的cookies
		//this.$store.state.cookies =this.$Cookies.get();
			this.$store.dispatch('addCookies', {
			  cookies: this.$Cookies.get(),
			})
		  }else{
			if(data.system_message=="无法获取用户数据"){
			  this.$message.warning("该账号已在其他地方登陆！")
			}else{
			  this.$message(data.msg);
			}
		  }
		});
		*/
	  },
	  // getFirstPath(data){    // 工具函数，获取第一个路径
	  //   var str = "";
	  //   if(Array.isArray(data)){
	  //     var firstObj = data[0];
	  //     str+="/"+firstObj.name;
	  //     if(firstObj.hasOwnProperty("children")){
	  //       str+=this.getFirstPath(firstObj.children)
	  //     }
	  //   }
	  //   return str;
	  // },
	  //找回密码
	  retrieve_pass(){
		this.retrieve_password=true;
	  },
	  //修改密码获取验证码
	  getCode2() {
		this.$refs.resetForm1.validateField('phone', (val) => {
		  // 当val==''时表示校验通过
		  if (val == '') {
			// let jsonParam=JSON.stringify({phone:this.resetForm1.phone})
			// this.$ajaxPost('wms/sendMessageForGetbackPwd.do', {reqParam:jsonParam}).then(({data}) => {
			  // if (data.code == 200) {
				clearInterval(this.reset.timer);
				this.reset.timer = setInterval(() => {
				  if (this.reset.count == 0) {
					clearInterval(this.reset.timer);
					this.reset.loginCodeTxt = '获取验证码';
					this.reset.canGetCode = false;
					this.reset.count = 60;
				  } else {
					this.reset.count--;
					this.reset.loginCodeTxt = this.reset.count + ' s';

					this.reset.canGetCode = true;
				  }
				}, 1000);
				this.$message.success('验证码发送成功')
			  } else {
				this.$message.error(data.msg)
			  }
			// });
		  // }
		})
	  },
	  //下一步 
	  next() {
		this.$refs.resetForm1.validate(valid => {
		  if (valid) {
			let jsonParam=JSON.stringify({phone:this.resetForm1.phone,vercode:this.resetForm1.code})
			this.$ajaxPost('wms/validVercodeForGetbackPwd.do', {reqParam:jsonParam}).then(({data}) => {
			  if (data.code == 200) {
				this.active = 2;
			  } else {
				this.$message.error(data.msg)
			  }
			})
		  }
		})
	  },
	  //确认修改
	  confirmPwd() {
		this.$refs.resetForm2.validate(valid => {
		  if (valid) {
			let jsonParam=JSON.stringify({phone:this.resetForm1.phone,newPwd:this.$md5(this.resetForm2.new_pwd),confirmPwd:this.$md5(this.resetForm2.again_pwd)})
			this.$ajaxPost('wms/submitForGetbackPwd.do', {reqParam:jsonParam}).then(({data}) => {
			  if (data.code == 200) {
				this.$message.success('新密码设置成功');
				this.active = 1;
				this.retrieve_password=false;
			  } else {
				this.$message.error(data.msg)
			  }
			})
		  }
		})
	  },
	  // 关闭表单
	  resetRetrieve(){
		this.$refs.resetForm1.resetFields();
		this.$refs.resetForm2.resetFields();
		Object.keys(this.resetForm1).forEach(key => {
		  this.resetForm1[key] = '';
		});
		Object.keys(this.resetForm2).forEach(key => {
		  this.resetForm2[key] = '';
		});
		this.active = 1;
	  },
	},
	mounted(){
	  if(this.$Cookies.get('code') == 300){
		this.$message.error("登录失效，请重新登录！");
		this.$Cookies.remove("code");
	  }
	  if(this.$Cookies.get('logOut')){
		this.$message.success("退出成功");
		this.$Cookies.remove("logOut");
	  }
	}
  }
</script>
