/**
 * 导航栏
 */
import vue from 'vue'
class TopMenn {       // 导航类
  constructor(alias,name,resource_id,url){
    this.alias = alias;
    this.name = name;
    this.resource_id = resource_id;
    this.url = url;
    this.children = [];
  }
}

export{ TopMenn }
