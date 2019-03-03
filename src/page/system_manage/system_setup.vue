<template>
  <div class="system_setup">
    <el-form :model="systemParam" label-width="110px">
      <el-form-item  label="企业名称：">
        <span>{{systemParam.tCompany.companyName}}</span>
      </el-form-item>
      <el-form-item prop="status" label="超级管理员：">
        <span>{{systemParam.user.phone}}</span>
      </el-form-item>
      <el-form-item>
        <!--<el-button @click="editorBtn">编辑</el-button>-->
        <el-button size="small" @click="alterManage" class="total">变更管理员</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="编辑" :visible.sync="editorName"  :modal-append-to-body="false">
      <el-form :model="editorForm" :rules="editorRules" ref="editorFormRef" label-width="100px" size="small">
        <el-form-item prop="name" label="企业名称：">
         <el-input size="small" v-model="editorForm.name" maxlength="30" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" >取消</el-button>
          <el-button size="small" class="total">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="变更管理员" :visible.sync="retrieve_phone" class="retrieve_pass" :modal-append-to-body="false">
      <div class="crumbs">
        <ul>
          <li :class="[active==1?'current':'']"><span>1.验证手机号</span></li>
          <li :class="[active==2?'current':'']"><span>2.设置新手机号</span></li>
          <!--<li :class="[active==3?'current':'']"><span>3.密码重置成功</span></li>-->
        </ul>
      </div>
      <el-form :model="resetForm1" ref="resetForm1" :rules="resetRules1" v-show="active==1">
        <el-form-item prop="phone">
          <el-input placeholder="请输入手机号" v-model="resetForm1.phone" clearable maxlength="11" disabled>
            <i slot="prefix">手机号 :</i>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;" prop="vercode">
          <el-input placeholder="请在此输入验证码" style="width:270px;" v-model="resetForm1.vercode" clearable maxlength="6">
            <i slot="prefix">验证码 :</i>
          </el-input>
          <el-button style="width:100px;padding:12px 15px;margin-left: 6px;" @click="getCode" :disabled="reset.canGetCode">{{reset.loginCodeTxt}}</el-button>
        </el-form-item>
        <el-form-item class="handle-btn-wrap clearfix">
          <el-button class="total" @click="next">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="resetForm2" ref="resetForm2" :rules="resetRules2" v-show="active==2">
        <el-form-item prop="phone">
          <el-input placeholder="请输入手机号" v-model="resetForm2.phone" clearable maxlength="11">
            <i slot="prefix">手机号 :</i>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;" prop="vercode">
          <el-input style="width:270px;" placeholder="请在此输入验证码" v-model="resetForm2.vercode" clearable maxlength="6">
            <i slot="prefix">验证码 :</i>
          </el-input>
          <el-button style="width:100px;padding:12px 15px;margin-left: 6px;" @click="getCode2" :disabled="reset2.canGetCode">{{reset2.loginCodeTxt}}</el-button>
        </el-form-item>
        <el-form-item class="handle-btn-wrap">
          <el-button @click="confirmPwd" class="total">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        props:{},
        data(){
          return{
            systemParam:{
              tCompany:{},
              user:{},
            },
            editorForm:{
              name:'',
            },
            editorName:false,
            retrieve_phone:false,
            editorRules:{
              name:[{required: true, message: '请填写1-30个字', trigger: 'change'}],
            },
            //步骤
            active: 1,
            //重置密码表单1
            resetForm1: {
              phone: '',
              vercode: ''
            },
            reset: {
              timer: null,
              count: 60,
              loginCodeTxt: '获取验证码',  // 登录获取验证码
              canGetCode: false,  //获取验证码按钮是否禁用
            },
            //重置密码验证规则1
            resetRules1: {
              phone: [{required: true, trigger: 'blur', validator: this.$Util.RegExp.phoneReg}],
              vercode: [{required: true, message: '请输入验证码', trigger: 'blur'}],
            },
            //重置密码 确认密码相同规则
            resetForm2: {
              phone: '',
              code: ''
            },
            reset2: {
              timer: null,
              count: 60,
              loginCodeTxt: '获取验证码',  // 登录获取验证码
              canGetCode: false,  //获取验证码按钮是否禁用
            },
            resetRules2: {
              phone: [{required: true, trigger: 'blur', validator: this.$Util.RegExp.phoneReg}],
              vercode: [{required: true, message: '请输入验证码', trigger: 'blur'}],
            },
          }
        },
      methods:{
        getUserInfor(){
          this.$ajaxPost('wms/user/selectCurrentUser.do',{}).then(({data})=>{
            if(data.code==200){
              this.$nextTick(()=>{
                if(data.data.tCompany!=null){
                  this.systemParam.tCompany=data.data.tCompany
                }
                this.systemParam.user=data.data.user
              })

            }else{
              this.$message.error(data.msg)
            }
          })
        },
        //编辑
        editorBtn(){
          this.editorName=true;
        },
        //变更管理员
        alterManage(){
          this.retrieve_phone=true;
          this.resetForm1.phone = this.systemParam.user.phone
        },
        //修改密码获取验证码
        getCode() {
          this.$refs.resetForm1.validateField('phone', (val) => {
            // 当val==''时表示校验通过
               delete this.resetForm1.vercode
               let json_resetForm1=JSON.stringify(this.resetForm1)
               this.reset.loginCodeTxt = 60 + ' s';
               this.reset.canGetCode = true;
               this.$ajaxPost('wms/user/sendMessageForGetbackPhone.do', {reqParam:json_resetForm1}).then(({data}) => {
                 if (data.code == 200) {
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
                   this.$message.success(data.msg)
                 } else {
                   this.$message.error(data.msg)
                 }
               });
          })
        },
        //返回登录
       /* backLogin() {
          this.showHide = true;
          this.active = 1;
        },*/
        //下一步
        next() {
          this.$refs.resetForm1.validate(valid => {
            if (valid) {
              let json_resetForm1=JSON.stringify(this.resetForm1)
               this.$ajaxPost('wms/user/validVercodeForGetbackPhone.do', {reqParam:json_resetForm1}).then(({data}) => {
                 if (data.code == 200) {
                   this.active = 2;
                   // this.$Cookies.set('token', data.data.token);
                   // this.$store.dispatch('LoginByUsername', data)````````
                 } else {
                   this.$message.error(data.msg)
                 }
               })
            }
          })
        },
        //修改密码获取验证码
        getCode2() {
          this.$refs.resetForm2.validateField('phone', (val) => {
            // 当val==''时表示校验通过
            delete this.resetForm2.vercode
            let json_resetForm2=JSON.stringify(this.resetForm2)
            this.reset2.loginCodeTxt = 60 + ' s';
            this.reset2.canGetCode = true;
            this.$ajaxPost('wms/user/sendMessageForGetbackPhone.do', {reqParam:json_resetForm2}).then(({data}) => {
              if (data.code == 200) {
                clearInterval(this.reset2.timer);
                this.reset2.timer = setInterval(() => {
                  if (this.reset2.count == 0) {
                    clearInterval(this.reset2.timer);
                    this.reset2.loginCodeTxt = '获取验证码';
                    this.reset2.canGetCode = false;
                    this.reset2.count = 60;
                  } else {
                    this.reset2.count--;
                    this.reset2.loginCodeTxt = this.reset2.count + ' s';
                    this.reset2.canGetCode = true;
                  }
                }, 1000);
                this.$message.success(data.msg)
              } else {
                this.$message.error(data.msg)
              }
            });
          })
        },
        //确认修改
        confirmPwd() {
          this.$refs.resetForm2.validate(valid => {
            if (valid) {
              let json_resetForm2=JSON.stringify(this.resetForm2)
               this.$ajaxPost('wms/user/submitForGetbackPhone.do', {reqParam:json_resetForm2}).then(({data}) => {
                 if (data.code == 200) {
                   clearInterval(this.reset.timer);
                   this.reset.loginCodeTxt = '获取验证码';
                   this.reset.canGetCode = false;
                   this.reset.count = 60;
                   this.resetForm1.phone=''
                   this.resetForm1.vercode=''
                   clearInterval(this.reset2.timer);
                   this.reset2.loginCodeTxt = '获取验证码';
                   this.reset2.canGetCode = false;
                   this.reset2.count = 60;
                   this.resetForm2.phone=''
                   this.resetForm2.vercode=''
                   setTimeout(() => {
                     this.$message.success('更换成功');
                     this.retrieve_phone=false;
                     this.active = 1;
                   }, 500);

                 } else {
                   this.$message.error(data.msg)
                 }
               })
            }
          })
        },
      },
      mounted(){
          this.getUserInfor();
      }
    }
</script>

<style lang="scss">
.system_setup{
  .el-input__prefix {
    width: 80px;
    line-height: 32px;
    color: #606266;
  }
}
</style>
