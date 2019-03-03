<template>
  <div>
    <script :id="id" type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
    data() {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      },
      id: {
        type: String
      }
    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor(this.id, this.config); // 初始化UE
      this.editor.ready(function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
      /*      this.editor.addListener("ready", function () {
              _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
            });*/
    },

    methods: {
      getUeContent() { // 获取内容方法
        return this.editor.getContent()
      },
      hasUeContents() { //判断是否有内容
        return this.editor.hasContents();
      },
      setUeContent() { //设置内容为空
        return this.editor.setContent('');
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>
