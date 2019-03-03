<template>
  <el-aside :width="menuWidth">
    <el-menu ref="submenu" :collapse="isActive" :default-active="$route.path" class="el-menu-vertical" unique-opened
             mode="vertical" style="border-right: none;">
      <!--一级导航-->
      <template v-for="(item,index) in leftMenu">
        <el-menu-item v-if="item.children.length==0" style="padding-left: 21px;" @click="leftClick(item)"
                      :index="'/'+item.url" :key="index" class="firstItem">
          <i class="has-icon" :class="item.icon" ></i>
          <span slot="title" class="nav-tit">{{item.permissionName}}</span>
        </el-menu-item>
        <el-submenu v-else :index="item.url" :i="item.url" :key="index+item.url" class="firstItem">
          <template slot="title">
            <i class="has-icon" :class="item.icon"></i>
            <span>{{ item.permissionName }}</span>
          </template>
          <!--二级导航-->
          <template v-for="(item2,index2) in item.children">
            <el-menu-item v-if="item2.type == 2" style="padding-left: 20px;" @click="leftClick2(item,item2)"
                          :index="'/'+item.url+'/'+item2.url" :key="index2" class="secondItem">
              {{' • ' +' '+item2.permissionName }}
            </el-menu-item>
            <el-submenu v-else :index="item2.url" :i="item2.url" :key="index2+item2.url" class="secondItem">
              <template slot="title">
                <span style="padding-left: 0px;">{{' • ' +' '+ item2.permissionName }}</span>
              </template>
              <!--三级导航-->
              <template v-for="(item3,index3) in item2.children">
                <el-menu-item style="padding-left:25px;" @click="leftClick3(item,item2,item3)"
                              :index="'/'+item.url+'/'+item2.url+'/'+item3.url" :key="index3" class="threeItem">
                  {{ item3.permissionName }}
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </el-aside>
</template>
<script>
  import { mapState } from 'vuex'
  export default {
    props: {
      isActive: Boolean,
    },
    data(){
      return {
        visible: false,
        top: 0,
        left: 0,
        hoverTag: {},//鼠标移上去的当前tag
        isCollapse: false,
        // isActive: false,
        leftMenu: [],
        tagCurrent: ""
      }
    },
    computed: {
      menuWidth() {
        return this.isActive ? '65px' : '220px';
      },
      ...mapState(['nowTopMenu'])
    },
    updated(){
      console.log(this.nowTopMenu)
    },
    watch: {
      "$store.getters.nowTopMenu": function (val) {
        this.getLeftMenu(val);
      },
      "$route.path": function (val) {
        this.getLeftMenu();
      },
    },
    methods: {
      leftClick(item){
        let path = '/' + item.url;
        this.leftNav(path,item);
      },
      leftClick2(item,item2){
        let path = '/' + item.url +'/' + item2.url;
        this.leftNav(path,item2);
      },
      leftClick3(item,item2,item3){
        let path = '/' + item.url +'/' + item2.url+'/' + item3.url;
        this.leftNav(path,item3);
      },
      /*左侧导航*/
      leftNav(path,item){
        let result = this.$Util.checkTagExist(path, this);
        if (result.idx == -1) {
          this.$store.dispatch('addDynamicTags', {
            name: item.permissionName, 
            path: path
          })
        }
        this.saveNav();
        this.$router.push(path);
        // console.log(this.$store.getters.dynamicTags);
      },
      saveNav(){//将dynamicTags存入session
        let arr = this.$store.getters.dynamicTags;
        sessionStorage.setItem("dynamicTags", JSON.stringify(arr));
      },
      
      //获取用户菜单
      getLeftMenu(str){
        str = str || this.$route.path.split("/")[1];
        this.leftMenu = JSON.parse(sessionStorage.getItem('permissionListPC'))
      },
    },
    components: {
    },
    created() {
      this.getLeftMenu();
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #app .el-menu-item{
    height: 40px;
    margin-top:15px;
    margin-bottom:15px;
    line-height: 40px;
  }
  #app .el-submenu__title{
    height: 40px;
    line-height: 40px;
    margin-bottom: 15px;
  }
  #app .el-menu-item.firstItem.is-active{
    color: #39b9fe;
    border-right: 2px solid  #39b9fe;
  }
  #app .firstItem.is-active{
    .has-icon.home{
      background: url("../assets/images/leftMenu/homeAct.png")center center no-repeat;
    }
    .has-icon.basic{
      background: url("../assets/images/leftMenu/basicAct.png")center center no-repeat;
    }
    .has-icon.financial{
      background: url("../assets/images/leftMenu/financialAct.png")center center no-repeat;
    }
    .has-icon.goods{
      background: url("../assets/images/leftMenu/goodsAct.png")center center no-repeat;
    }
    .has-icon.inbound{
      background: url("../assets/images/leftMenu/inboundAct.png")center center no-repeat;
    }
    .has-icon.library{
      background: url("../assets/images/leftMenu/libraryAct.png")center center no-repeat;
    }
    .has-icon.outbound{
      background: url("../assets/images/leftMenu/outboundAct.png")center center no-repeat;
    }
    .has-icon.rule{
      background: url("../assets/images/leftMenu/ruleAct.png")center center no-repeat;
    }
    .has-icon.stock{
      background: url("../assets/images/leftMenu/stockAct.png")center center no-repeat;
    }
    .has-icon.system{
      background: url("../assets/images/leftMenu/systemAct.png")center center no-repeat;
    }
  }
  #app .firstItem.el-submenu.is-active.is-opened>.el-submenu__title{
    color: #39b9fe;
    border-right: 2px solid  #39b9fe;
  }
  #app .el-menu-item.threeItem:focus, .el-menu-item.threeItem:hover{
    color: #39b9fe;
    border-radius: 25px;
    background: #d7f1ff;
  }
  #app .secondItem.el-submenu > .el-submenu__title{
    margin-left: 32px;
    transition:none;
    width: 168px;
    min-width: 168px !important;
    padding-left: 20px !important;
    i{
      display: none;
    }
  } 
  #app .el-menu-item.secondItem{
    margin-left: 32px;
    transition:none;
    width: 168px;
    min-width: 168px !important;
    margin-top: 0;
  }
  #app .el-menu-item.secondItem.is-active{
    min-width: 130px !important;
    width: 130px;
    transition:none;
    color: #39b9fe;
    border-radius: 25px;
    background: #d7f1ff;
  }
  #app .el-submenu .el-menu-item.threeItem{
    min-width: 130px !important;
    width: 130px;
    margin-left: 50px;
    transition:none;
    margin-top: 0;
  }
  #app .el-menu-item.threeItem.is-active{
    color: #39b9fe;
    border-radius: 25px;
    background: #d7f1ff;
  }
  .has-icon {
    display: inline-block;
    vertical-align: middle;
    width: 22px;
    height: 20px;
    margin-right: 10px;
  }
  .has-icon.home{
    background: url("../assets/images/leftMenu/home.png")center center no-repeat;
  }
  .has-icon.basic{
    background: url("../assets/images/leftMenu/basic.png")center center no-repeat;
  }
  .has-icon.financial{
    background: url("../assets/images/leftMenu/financial.png")center center no-repeat;
  }
  .has-icon.goods{
    background: url("../assets/images/leftMenu/goods.png")center center no-repeat;
  }
  .has-icon.inbound{
    background: url("../assets/images/leftMenu/inbound.png")center center no-repeat;
  }
  .has-icon.library{
    background: url("../assets/images/leftMenu/library.png")center center no-repeat;
  }
  .has-icon.outbound{
    background: url("../assets/images/leftMenu/outbound.png")center center no-repeat;
  }
  .has-icon.rule{
    background: url("../assets/images/leftMenu/rule.png")center center no-repeat;
  }
  .has-icon.stock{
    background: url("../assets/images/leftMenu/stock.png")center center no-repeat;
  }
  .has-icon.system{
    background: url("../assets/images/leftMenu/system.png")center center no-repeat;
  }
  .tagMain {
    height: 40px;
    border-bottom: 1px solid #d8dce5;
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    background: #fff;
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 999;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }

  .tagMain .input-new-tag {
    margin-left: 10px;
    margin-bottom: 10px;
    color: #666 !important;
    border: solid 1px #d7f1ff !important;
    background: #fff;
    vertical-align: bottom;
    cursor: pointer;
    padding: 0px;
    padding-right: 10px;
    .el-icon-close{
      
    }
  }
  #app .el-tag .el-icon-close{
    // color: #39b9fe !important;
    // color: #39b9fe;
  }
  .tagMain .input-new-tag-active {
    border-radius: 5px;
	  border:none;
    background: #d7f1ff !important;
    color: #39b9fe !important;
  }
  .el-submenu{
  }
  /*.el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }*/

  .tags-view-wrapper {
    background: #fff;
    height: 40px;
	  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.14);
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
</style>
