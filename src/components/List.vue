<template>
  <div
    v-for="(item,index) in items"
    :key="item.id"
    class="card mt-2"
  >
    <slot
        :item="item"
        :index="index"
    />
  </div>
</template>
<script>

export default{
  props:{
    items: {
      type     : Array,
      required : true,
    },
  },
  emits:[

  ],
  components:{

  },
  setup(props, {emit}){

    return{

    }
  }
}
</script>
<style scoped>
.use-pointer{
  cursor: pointer;
}
</style>