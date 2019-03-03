<script>
import PropsForm from './propery-form';
import PropsFormEdit from './property-form-edit';
import PropsList from './property-list';
import PropsListEdit from './property-list-edit';

export default {
    name: 'dynamic-form',
    components: {
        PropsForm,
        PropsFormEdit,
        PropsList,
        PropsListEdit,
    },
    props: {
        propsList: {
            type: Array,
            default() {
                return [];
            }
        },
        goodsInfo: Object,
        skuList: {
            type: Array,
            default() {
                return [];
            }
        },
    },
    render (){
        const getPropsArray = () => { 
            const propsArray = [];
            this.propsList.forEach((item) => {
                if (item.choosePropsList.length !== 0) {
                    if (item.alreadyCusomPropsList.length === 0) {
                        propsArray.push(item.choosePropsList.map((props) => {
                            return props.propertyValue;
                        }));
                    } else {
                        // propsArray.push(item.choosePropsList.map((props) => {
                        //     return props.propertyValue;
                        // }).concat(item.alreadyCusomPropsList.map((item) => {
                        //     return item.propertyValue;
                        // })));
                        
                        
                        propsArray.push(item.alreadyCusomPropsList.map((item) => {
                            return item.propertyValue;
                        }).concat(item.choosePropsList.map((props) => {
                            return props.propertyValue;
                        })))
                    }
                    // propsArray.push(item.choosePropsList.map((props) => {
                    //     return props.propertyValue;
                    // }));
                } else if (item.alreadyCusomPropsList.length !== 0) {
                    if (item.alreadyCusomPropsList.length === 0) {
                        propsArray.push(item.choosePropsList.map((props) => {
                            return props.propertyValue;
                        }));
                    } else {
                        propsArray.push(item.alreadyCusomPropsList.map((item) => {
                            return item.propertyValue;
                        }).concat(item.choosePropsList.map((props) => {
                            return props.propertyValue;
                        })))
                    }
                }
            });
            return propsArray;
        };

        const getFromPropsArray = () => {
            const propsArray = [];
            this.propsList.forEach((item) => {
                if (item.choosePropsList.length !== 0) {
                    propsArray.push({
                        propertyId: item.propertyId,
                        name: item.propertyName,
                        value: item.choosePropsList.map((props) => {
                            return props.propertyValue;
                        }),
                        ids: item.choosePropsList.map((props) => {
                            return {
                                propvalueId: props.id,
                                provalueValue: props.propertyValue,
                            };
                        }),
                    });
                } else if (item.alreadyCusomPropsList.length !== 0) {
                    propsArray.push({
                        propertyId: item.propertyId,
                        name: item.propertyName,
                        value: item.alreadyCusomPropsList.map((props) => {
                            return props.propertyValue;
                        }),
                        ids: item.alreadyCusomPropsList.map((props) => {
                            return {
                                propvalueId: props.id,
                                provalueValue: props.propertyValue,
                            };
                        }),
                    });
                }
            });
            return propsArray;
        };
        return (
             <div>
                { this.skuList.length === 0 ? 
                    <div>
                        <PropsList  lists={this.propsList}/>
                        <PropsForm  formLists={getFromPropsArray()}
                                    formData={getPropsArray()} 
                                    goodsData={this.goodsInfo}/>
                    </div> : 
                    <div>
                        <PropsListEdit  lists={this.propsList}
                                        skuList={this.skuList}/>
                        <PropsFormEdit  formLists={getFromPropsArray()}
                                        formData={getPropsArray()} 
                                        skuList={this.skuList}
                                        goodsData={this.goodsInfo}/>
                    </div>
                }
             </div>
        )
    }
}
</script>
