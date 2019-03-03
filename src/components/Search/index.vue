<template>
  <div class="search-container" ref="search_contaienr">
    <div  class="search-main">
      <div class="search-bar">
        <el-input type="text" v-model="inputValue" 
                           @keydown.enter="goSearch" 
                           clearable
                          :placeholder="placeholder" :style="styles"></el-input>
        <i @click="goSearch" class="el-icon-search icon-search go-search"></i>
      </div>
      <transition name="genaral-fadeIn">
        <div class=toggle-show-inner v-show="showToggleTable" >
          <slot></slot>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        disabled:false,
        showToggleTable:false,
        change:false,
        inputValue:""
      }
    },
    watch:{
      showToggleTable(val){
        if(val){
          document.onclick = ()=> {
            this.showToggleTable = false;
            document.onclick = null;
          }
        }
      }
    },
    props:{
      showSeven:{
        type:Boolean,
        default:true,
      },
      placeholder:{
        type: String,
        default: "点击下拉可高级搜索",
      },
      showIcon:{
        type:Boolean,
        default:true,
      },
      width:{
        type:String,
        default:'100%'
      }
    },
    methods:{
      showMore(e){
        this.showToggleTable = !this.showToggleTable;
      },
      goSearch(){
        this.$emit("on-search",this.inputValue);
      },
      toggleOpen(close){
        this.showToggleTable = close;
      }
    },
    mounted(){
      this.$refs.search_contaienr.onclick=(e)=>{
        e.stopPropagation();
      };
    },
    computed:{
      styles(){
        return{width:this.width}
      }
    }
  }
</script>
<style lang="scss">
  .genaral-fadeIn-enter-active {
    transition: all 1s;
  }
  .genaral-fadeIn-leave-active {
    transition: all .5s ;
  }
  .genaral-fadeIn-enter,.genaral-fadeIn-leave-to{
    transform-origin: top;
    transform: rotateX(30deg);
    opacity: 0;
  }
  .search-container{
    .el-input__inner{
      padding: 0 10px;
      width: 100%;
      height: 32px;
      line-height: 32px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
  }
</style>
<style lang="scss" scoped>
  @import '../../styles/mixin.scss';
  .search-container {
    //  min-width: 400px;
     .search-main{
        position: relative;
        width: 100%;
        // min-width:340px;
        border-radius: 5px;
        .search-bar{
          @include fd(row);
          align-items: center;
        }
        .el-icon-search:before{
          height: 100%;
          display: flex;
          @include flexCenter;
          color: #aaaaaa;
        }
        .go-search{
          display: inline-block;
          @include wh(30px,30px);
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          border: 1px solid rgb(205, 212, 203);
          border-left-width: 0px;
          background-color: #f5f8fa;
          cursor: pointer;
        }
     }
  }
</style>
