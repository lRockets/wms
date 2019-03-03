<template>
    <div class="home" id='home'>
        <div class="module">
            <div class="moduleBox">
                <img src="../assets/images/home/icon1.png"/>
                <div class="wordBox">
                    <h3>{{homeData.countPurin}}</h3>
                    <p>采购预约单</p>
                </div>
            </div>
            <div class="moduleBox">
                <img src="../assets/images/home/icon2.png"/>
                <div class="wordBox">
                    <h3>{{homeData.countPurinbound}}</h3>
                    <p>采购入库单</p>
                </div>
            </div>
            <div class="moduleBox">
                <img src="../assets/images/home/icon3.png"/>
                <div class="wordBox">
                    <h3>{{homeData.countAlloin}}</h3>
                    <p>调拨预约单</p>
                </div>
            </div>
            <div class="moduleBox">
                <img src="../assets/images/home/icon4.png"/>
                <div class="wordBox">
                    <h3>{{homeData.countAlloinbound}}</h3>
                    <p>调拨入库单</p>
                </div>
            </div>
            <div class="moduleBox">
                <img src="../assets/images/home/icon5.png"/>
                <div class="wordBox">
                    <h3>{{homeData.countSalein}}</h3>
                    <p>售后预约单</p>
                </div>
            </div>
            <div class="moduleBox">
                <img src="../assets/images/home/icon6.png"/>
                <div class="wordBox">
                    <h3>{{homeData.countSaleinbound}}</h3>
                    <p>售后入库单</p>
                </div>
            </div>
            <div class="moduleBox">
                <img src="../assets/images/home/icon7.png"/>
                <div class="wordBox">
                    <h3>{{homeData.countSaleoutPick}}</h3>
                    <p>待拣货订单</p>
                </div>
            </div>
            <div class="moduleBox">
                <img src="../assets/images/home/icon8.png"/>
                <div class="wordBox">
                    <h3>{{homeData.countSaleoutCheck}}</h3>
                    <p>待验货订单</p>
                </div>
            </div>
            <div class="moduleBox">
                <img src="../assets/images/home/icon9.png"/>
                <div class="wordBox">
                    <h3>{{homeData.countSaleoutWeight}}</h3>
                    <p>待称重订单</p>
                </div>
            </div>
            <div class="moduleBox">
                <img src="../assets/images/home/icon10.png"/>
                <div class="wordBox">
                    <h3>{{homeData.countSaleoutOutBound}}</h3>
                    <p>待出库订单</p>
                </div>
            </div>
            <div class="moduleBox">
                <img src="../assets/images/home/icon11.png"/>
                <div class="wordBox">
                    <h3>{{homeData.countInventorySku}}</h3>
                    <p>待盘点商品</p>
                </div>
            </div>
            <div class="moduleBox">
                <img src="../assets/images/home/icon12.png"/>
                <div class="wordBox">
                    <h3>{{homeData.countOnshelfSku}}</h3>
                    <p>待上架商品</p>
                </div>
            </div>
        </div>
        <p>精臣 · WMS  版权所有©2017-2018</p>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                homeData:{},
            }
        },
        methods:{
            getHomeData(){
                // let json_param=JSON.stringify({})
                this.$ajaxPost('wms/systemManagement/numberOfOperations.do',{}).then(({data})=>{
                    // console.log(JSON.parse(JSON.stringify(data.data)))
                    // console.log(JSON.parse(JSON.stringify(data.data)))
                    if(data.code==200){
                        this.homeData=JSON.parse(JSON.stringify(data.data))
                    }else{
                        this.$message.error(data.msg)
                    }
                })
            },
        },
        mounted(){
            this.getHomeData();
        },
    }
</script>

<style lang='scss'>
.home p{
    color: #999999;
    font-size: 12px;
    text-align: center;
}
.module{
    width: 1126px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-content: flex-start;
}
.moduleBox{
    width: 198px;
    height: 88px;
    background: #ffffff;
    padding: 46px 34px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin:0 20px 20px 0; 
    img{
        width: 88px;
        height: 88px;
        display: inline-block;
    }
    .wordBox{
        margin-left: 30px;
    }
    h3{
        color: #333333;
        font-size: 18px;
        font-weight: normal;
        text-align: center;
        line-height: 18px;
        height: 18px;
        margin-bottom: 20px;
    }
    p{
        color: #999999;
        font-size: 16px;
        text-align: center;
    }
}
.moduleBox:nth-child(4n+4){
    margin: 0 0 20px 0;
}
</style>
