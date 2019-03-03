<script>
  export default {
      functional:true,
      render(h,context){
          return context.props.render(h,context.props.scope);
      }
  }
</script>
