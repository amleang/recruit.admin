<template>
   <img :src="`${img?baseUrl+img:''}`" alt="" class="avatar">
</template>

<script>
export default {
 props: {
    img: {
      type: String,
      default: ""
    }
  }
}
</script>

<style>

</style>
