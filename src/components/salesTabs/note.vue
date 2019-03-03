<template>
  <div class="remark">
     <el-row type="flex" :gutter="24">
        <el-col :span="12">
          <el-row type="flex" align="center" class="remark--wrap">
            <p>买家留言</p>
            <el-radio-group v-model="note.flag">
              <el-radio disabled :label="-1">无</el-radio>
              <el-radio disabled :label="5">
                <i class="ramark__flag flagRed"></i>
              </el-radio>
              <el-radio disabled :label="4">
                <i class="ramark__flag flagYellow"></i>
              </el-radio>
              <el-radio disabled :label="3">
                <i class="ramark__flag flagGreen"></i>
              </el-radio>
              <el-radio disabled :label="2">
                <i class="ramark__flag flagBlue"></i>
              </el-radio>
              <el-radio disabled :label="1">
                <i class="ramark__flag flagPurple"></i>
              </el-radio>
            </el-radio-group>
          </el-row>
          <el-input disabled type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="noteData.buyNote"></el-input>
        </el-col>
        <el-col :span="12">
          <p class="remark--wrap">卖家备注</p>
          <el-input :disabled="!editing" 
                    v-model="noteData.note" 
                    :autosize="{ minRows: 4, maxRows: 6}"
                    maxlength="1000"
                    type="textarea"></el-input>
        </el-col>
      </el-row>
  </div>
</template>
<script>
  export default {
    props:{
        noteData: Object,
        editing: {
          type: Boolean,
          default: false,
        },
    },
    computed: {
      note() {
        if (this.noteData.flag === null) {
          return {
            ...this.noteData,
            flag: -1,
          }
        } else {
          return this.noteData;
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .remark{
    .ramark__flag{
      position: absolute;
      width: 15px;
      height: 19px;
      background-size: cover;
    }
    .flagRed{
      background-position: 0 0;
    }
    .flagYellow{
      background-position: 0 -23px;
    }
    .flagGreen {
      background-position: 0 -46px;
    }

    .flagBlue {
      background-position: 0 -92px;
    }

    .flagPurple {
      background-position: 0 -68px;
    }
  }
   .remark--wrap{
     p{
       margin-right: 30px;
     }
   }
</style>
<style lang="scss">
  .remark--wrap{
    margin-bottom: 10px;
    .el-radio-group{
      margin-top:5px;
    }
    .el-radio{
      position: relative;
      width:50px;
    }
    .el-radio+.el-radio {
        margin-left:10px;
      }
  }
</style>

