<template>
<el-container>
    <el-header class="sys_header" style="border-bottom:2px solid #eeeeee">
        <div class="common_top clearfix">
          <div class="left">
            <ul class="common_top_desc">
              <li class="logo"></li>
              <li class="line"></li>
              <li>
                <el-select v-model="store" style="margin-left: 10px;" @change="storeChange">
                  <template v-for="item in storeList">
                    <el-option v-for="item in storeList" :label="item.storehouseName" :value="item.id" :key="item.id"></el-option>
                  </template>
                </el-select>
              </li>
            </ul>
          </div>
          <div class="right f-fr">
            <ul>
              <li class="homeBtn"></li>
              <li class="line"></li>
              <li>
                <el-dropdown>
                  <el-button type="text" style="height: 32px;line-height:32px;padding: 0;margin-right:20px;">
                    {{user_name}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><el-button type="text" @click="refactorPass">修改密码</el-button></el-dropdown-item>
                    <el-dropdown-item><el-button type="text" @click="logOut">退出登录</el-button></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </li>
            </ul>
          </div>
        </div>
		  </el-header>
		<el-container style="border: 1px solid #eee" :style="{ height: `${viewHeight}px` }">
      <Nav :isActive="!isCollapse"></Nav>
      <el-container>      
      <el-dialog title="修改密码"  :visible.sync="innerVisible"  width="400px" @close='resetPwdForm' class="alterPassword">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
          <el-form-item prop="oldPwd">
            <el-input type="password" v-model="ruleForm.oldPwd" placeholder="请输入旧密码">
              <i slot="prefix">旧 密 码：</i>
            </el-input>
          </el-form-item>
          <el-form-item prop="newPwd" >
            <el-input type="password" v-model="ruleForm.newPwd" placeholder="请输入新密码">
              <i slot="prefix">新 密 码：</i>
            </el-input>
          </el-form-item>
          <el-form-item prop="confirmPwd">
            <el-input type="password" v-model="ruleForm.confirmPwd" placeholder="请确认新密码">
              <i slot="prefix">确认密码：</i>
            </el-input>
          </el-form-item>
          <el-form-item label-width="0px">
            <el-button @click="submitForm" class="total" size="small" style="width:300px;margin:0 auto;display: block;">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
       <el-container id="innerWrap">
           <el-header :height="'40px'">
            <div class="clearfix">
            <div class="tagMain">
              <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
                <Hamburger :isActive="!isCollapse" :toggleClick="toggleClick"
                          style="float:left;margin-top: 11px;margin-left: 10px;"></Hamburger>
                <div style="padding-top: 4px;">
                  <el-tag @contextmenu.prevent.native="openMenu(item,$event)" 
                          class="input-new-tag"
                          :class="{'input-new-tag-active': $route.path == item.path}"
                          v-for="(item,index) in $store.getters.dynamicTags"
                          @close="tagClose(item,index)" 
                          :key="item.path" 
                          closable 
                          :disable-transitions="false">
                    <span style="float:left;padding-left: 10px;" @click="tagClick(item,index)">{{ item.name }}</span>
                  </el-tag>
                </div>
              </scroll-pane>
              <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
                <li @click="hoverClose('current')">关闭当前</li>
                <li @click="hoverClose('others')">关闭其他</li>
                <li @click="hoverClose('all')">关闭所有</li>
              </ul>
            </div>
          </div>
          </el-header>
          <el-main>
          <!--<keep-alive>-->
            <router-view/>
          <!--</keep-alive>-->
        </el-main>
        </el-container>
      </el-container>
      </el-container>
		</el-container>
</template>
<script>
  import 'element-ui/lib/theme-chalk/display.css';
  import Nav from './nav.vue'
  import Hamburger from "@/components/Hamburger/index"
  import ScrollPane from '@/components/ScrollPane'
  
	/**
	 * 获取导航
	 */
	export default{
    components:{
      Hamburger, 
      ScrollPane,
      Nav,
    },
		data(){
      const newReg = (rule, value, callback) => {
        // let v = value.toString().trim();
        // let flag = /^[a-zA-Z0-9]{6,10}$/.test(value);
        if (value === '') {
          if (callback) {callback(new Error('请输入新密码'))};
        } else {
          callback();
        }
      };
      const confirmReg = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.newPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        topmenuList:[],			// 所有的顶部导航信息
        user_name:this.$Cookies.get('userName'),
        innerVisible:false,
        ruleForm: {   //修改密码参数
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        },
        rules: {    //修改密码规则
          oldPwd: [{ required: true, trigger: 'blur' ,message: '请输入旧密码',}],
          newPwd: [{ required: true, trigger: 'change' ,validator:this.$Util.RegExp.passwordReg}],
          confirmPwd: [{ required: true, trigger: 'blur' ,validator: confirmReg}] 
        },
        store:'',
        storeList:[],
        // 
        visible: false,
        top: 0,
        left: 0,
        hoverTag: {},//鼠标移上去的当前tag
        isCollapse: true,
        isActive: false,
        tagCurrent: "",
        viewHeight: window.innerHeight - 60,
			}
    },
    created(){
      const callback =  _.debounce(() => {
        this.viewHeight = window.innerHeight - 60;
      }, 300);
      window.addEventListener('resize', () => {
        callback();
      }, false);
		},
    mounted(){
      //获取cookie 设置登录信息
      this.cookies = this.$Cookies.get();
      this.getStoreList();
    },
    
		methods:{
		  //获取仓库
      getStoreList(){
        this.$ajaxPost("wms/homepage/selectUserStorehouse.do",{}).then(({data}) => {
          if(data.code==200){
            this.storeList=data.data.storehouseList
            console.log(this.storeList)
            let aaa=this.$Cookies.get('storehouseId')
            this.$nextTick(() => {
              if(aaa!=null && !isNaN(parseInt(aaa))){
                this.store=aaa-0;
                this.changeStore(this.store)
              }else{
                if(this.storeList.length>0){
                  this.store=this.storeList[0].id
                  this.changeStore(this.store)
                }else{
                  this.store='';
                }
              }
            })
          }else{
            this.$message.error(data.msg);
          }
        })
      },
		  //选择仓库
      storeChange(val){
        console.log(val)
        this.$Cookies.set('storehouseId',val);
        this.changeStore(val)
        this.$router.go(0)
      },
      // 切换仓库
      changeStore(ID){
        let param={
          storehouseId:ID,
        }
        let json_param=JSON.stringify(param)
        this.$ajaxPost("wms/homepage/changeUserStorehouse.do",{reqParam:json_param}).then(({data}) => {
          if(data.code==200){
            this.$Cookies.set('storehouseId',ID);
          }else{
            this.$message.error(data.msg);
          }
        })
      },
      toggleClick(){
        //汉堡转换
        this.isCollapse = !this.isCollapse;
      },
      tagClose(item, index) {
        //单个tag关闭
        let arr = this.$store.getters.dynamicTags;
        if (arr.length > 1) {
          arr.splice(index, 1);
          this.saveNav();
          this.pageJump({item: item, idx: index});
        }
      },
      saveNav(){//将dynamicTags存入session
        let arr = this.$store.getters.dynamicTags;
        sessionStorage.setItem("dynamicTags", JSON.stringify(arr));
      },
      openMenu(tag, e) {
        this.left = e.clientX;
        this.top = e.clientY;
        this.visible = true;
        this.hoverTag = tag;
      },
      hoverClose(type){
        let result = this.$Util.checkTagExist(this.hoverTag.path, this);
        console.log(result)
        if (type == "current") {
          let arr = this.$store.getters.dynamicTags;
          if (arr.length > 1) {
            arr.splice(result.idx, 1);
            this.pageJump(result);
          }
        } else if (type == "others") {
          //this.$store.state.dynamicTags = [this.hoverTag];
          this.$store.dispatch('updateDynamicTags', [this.hoverTag])
          if (this.hoverTag.path != this.$route.path) this.$router.push(this.hoverTag.path);
        } else {
          console.log(this.$store.getters.dynamicTags.slice(0, 1))
          //this.$store.state.dynamicTags = this.$store.state.dynamicTags.slice(0, 1);
          this.$store.dispatch('updateDynamicTags', this.$store.getters.dynamicTags.slice(0, 1))
          if (this.$store.getters.dynamicTags[0].path != this.$route.path) {
            this.$router.push(this.$store.getters.dynamicTags[0].path);
          }
        }
        this.saveNav();
      },
      pageJump(result){
        //页面跳转
        if (result.item.path == this.$route.path) {
          //若当前选中 则切换
          let toIndex = 0;
          if (result.idx - 1 >= 0) {
            //向前切换
            toIndex = result.idx - 1;
          } else if (result.idx + 1 < this.$store.getters.dynamicTags.length) {
            //向后切换
            toIndex = result.idx + 1;
          }
          if (this.$store.getters.dynamicTags.length > 0) {
            this.$router.push(this.$store.getters.dynamicTags[toIndex].path);
          }
        }
      },
      tagClick(item, index){
        //单个tag点击
        this.$router.push(item.path);
      },
      closeListener() {
        this.visible = false
      },
      refactorPass(){   //显示 修改密码弹窗
        this.innerVisible = true;
      },
      logOut(){   //退出登录
        this.$confirm('确认退出登录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$ajaxPost("wms/loginOut.do",{}).then(({data}) => {
          //   if(data.code==200){
              this.$Cookies.set('loginToken','');
              this.$Cookies.set('storehouseId','');
              // 清除缓存
              sessionStorage.clear();
              this.$Cookies.set('logOut','true');
              this.$router.push({path:"/login"}, () => {
                window.location.reload()
              });
            // }else{
            //   this.$message.error(data.msg);
            // }
          // })
        }).catch(() => {})
      },
      submitForm() {    //确认修改密码
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认修改密码？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let json_ruleForm = JSON.stringify({oldPwd:this.$md5(this.ruleForm.oldPwd),newPwd:this.$md5(this.ruleForm.newPwd),confirmPwd:this.$md5(this.ruleForm.confirmPwd)})
              this.$ajaxPost("wms/homepage/updateUserPwd.do",{reqParam:json_ruleForm}).then(({data}) => {
                if(data.code==200){
                  this.innerVisible = false;
                  this.resetForm();
                  this.$Cookies.set('loginToken','');
                  this.$message.success("密码修改成功！请重新登录"); 
                  setTimeout(() => {
                    this.$router.push({path:"/login"}, () => {
                      window.location.reload()
                    });
                  }, 1000)
                }else{
                  this.$message.error(data.msg);
                }
              })
            }).catch(() => {})
          } else {
            return false;
          }
        });
      },
      resetPwdForm(){
        this.$refs.ruleForm.resetFields();
        for(let key in this.ruleForm){
          this.ruleForm[key]=''
        }
      },
      resetForm() {   //重置修改密码表单
        this.$refs.ruleForm.resetFields();
      }
		},
    watch:{
      "$route.path":function (val) {
        var arr = val.split("/");
        if(arr.length==4){
        //this.$store.state.nowTopMenu = arr[1]
          this.$store.dispatch('addTopMenu', {
            nowTopMenu: arr[1]
          })
        }
      },
      "$store.getters.cookies"(val){   //监测cookies
        this.cookies = this.$Cookies.get();
      },
      visible(value) {
        if (value) {
          window.addEventListener('click', this.closeListener)
        } else {
          window.removeEventListener('click', this.closeListener)
        }
      }
    },

	}
</script>
<style rel="stylesheet/scss" lang="scss">
  .sys_header {
    width: 100%;
    padding: 0px;
    .common_top{
      height: 60px;
      .left{
        line-height: 60px;
        height: 60px;
        float: left;
        padding-left:20px;
        .common_top_desc{ 
          height: 60px;
          display: flex;
          align-items: center;
          li{
            font-size: 16px;
            color: #fff;
            height: 60px;
            line-height: 60px;
            cursor: pointer;
          }
          .logo{
            width: 174px;
            background: url("../assets/images/sprite.png") 0 21px no-repeat;
            vertical-align: top;
          }
          .line{
            height: 14px;
            line-height: 14px;
            width: 1px;
            background-color:  #39b9fe;
          }
          .el-select{
            width: 100px;
            .el-input .el-select__caret{
              color: #39b9fe;
            }
          }
        }
      }
      .right{
        height: 60px;
        ul{
          display: flex;
          align-items: center;
          li.homeBtn{
            width: 16px;
            height:14px;
            background:url(../assets/images/sprite.png) 0px -39px no-repeat ;
          }
          li.line{
            height: 14px;
            line-height: 14px;
            width: 1px;
            background-color:  #39b9fe;
            margin: 0 12px;
          }
        }
        .el-dropdown{
          height: 60px;
          display: flex;
          align-items: center;
          span{
            color: #39b9fe;
          }
          .el-icon-arrow-down{
            vertical-align:middle;
            color: #39b9fe;
          }
        }
      }
    }
  }
  /*修改密码*/ 
  .alterPassword{
    .el-form-item__content{
      text-align: center;
    }
    .el-input{
      width: 300px;
    }
    .el-input__inner {
      padding-left:80px !important;
      height: 32px;
      line-height: 32px;
    }
    .el-input__prefix {
      width: 80px;
      line-height: 32px;
      color: #606266;
      text-align: left;
      left: 10px;
      i{
        font-family: MicrosoftYaHei;
        font-size: 14px;
        line-height: 40px;
        color: #333333;
      }
    }
  }
  #app .sys_header .el-input__inner {
    background-color: transparent;
    border: none;
    font-size: 14px;
    color: #39b9fe;
  }
</style>
<!-- element css reset -->
<style rel="stylesheet/scss" lang="scss">
  // .el-table .customized-row {
  //   background: #f5c7da;
  // }
  // .el-table .paytype-row {
  //   background: #def1d5;
  // }
  /*Table*/
  .el-table{
    &__header{
      height: 36px;
      // .table-header,.has-gutter{
      //   height: 36px;
      //   font-size: 13px;
      //   color: #333;
      //   th{
      //     height: 36px;
      //     padding: 0;
      //     background-image: linear-gradient(0deg, #f3f3f3 0%, #ffffff 100%);
      //     border: solid 1px #e9e9e9;
      //     .cell{
      //       font-weight: bold;
      //       overflow: hidden;
      //       text-overflow: ellipsis;
      //       white-space: nowrap;
      //       .caret-wrapper{
      //         position: absolute;
      //         top: -4px;
      //       }
      //     }
      //   }
      // }
    }
    &__body{
      .el-table__row{
        height: 36px;
        td{
          padding: 0;
          font-size: 13px;
          color: #666;
          .cell{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    &__empty-block{
      min-height: 200px;
    }
  }
  /*MessageBox*/
  // .el-message-box__wrapper .el-message-box{
  //   width: 250px;
  // }
  .el-select-dropdown__item.selected{
     color: #39b9fe;
     font-weight:normal;
  }
  /*TableFooter*/
  /*.el-table__footer-wrapper {*/
    /*display: none;*/
  /*}*/
</style>
<style lang="scss" scoped>
#innerWrap{
  background-color: #f5f5f5;
}
</style>
<style lang="scss">
#innerWrap{
  .el-header{
    margin-top: 20px;
  }
  .el-main{
    padding: 0 20px;
    margin-top: 20px;
    background-color: #f5f5f5;
    >div:nth-child(1){
      padding: 20px;
      background-color: #fff;
    }
    >div:nth-child(1).home{
      padding:0;
      background-color: rgba(0,0,0,0);
      margin-top:0px;
    }
  }
}
header.top-head{
  margin-bottom: 20px;
}
</style>


