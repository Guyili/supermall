<template>
  <div>
    <swiper>
      <swiper-item v-for="item in banners">
        <a :href="item.link">
          <img :src="item.image" alt="" @load="imageLoad">
        </a>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import {Swiper,SwiperItem} from 'components/common/swiper'

export default {
  name: "HomeSwiper",
  components:{
    Swiper,
    SwiperItem
  },
  props:{
    banners:{
      type:Array,
      default() {
        return []
      }
    }
  },
  data(){
    return{
      isLoad: false
    }
  },
  methods:{
    imageLoad() {
      // console.log('-----');
      if(!this.isLoad){
        this.$emit("swiperImageLoad")
        this.isLoad = true
      }

    }
  }

}
</script>

<style scoped>

</style>
