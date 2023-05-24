<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"
    />

    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore" >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                    ref="tabControl2"
      />
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>

  </div>
</template>

<script>
// 导入公共组件
import NavBar from "@/components/common/navbar/NavBar";
import "assets/css/base.css";
import HomeSwiper from "@/views/home/childComps/HomeSwiper";
import Scroll from "@/components/common/scroll/Scroll";
import {debounce} from "@/components/common/utils/debounce"

// 导入业务组件
import RecommendView from "@/views/home/childComps/RecommendView";
import FeatureView from "@/views/home/childComps/FeatureView";
import TabControl from "@/components/content/tabControl/TabControl";
import GoodsList from "@/components/content/goods/GoodsList";
import BackTop from "@/components/content/backTop/BackTop";

// 导入方法
import {getHomeMultidata,getHomeGoods} from "@/network/home";

export default {
  name: "Home",
  components :{
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data(){
    return{
      banners:[],
      recommends: [],
      goods:{
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
      },
      currentType: 'pop',
      isShowBackTop: false,
      // tabControl离顶距离
      tabOffsetTop: 0,
      // tabControl是否吸顶
      isTabFixed: false,
      // 记录首页离开的位置，用来保留后续切回位置
      saveY: 0

    }
  },
  created() {
    // 1、请求多个数据
    this.getHomeMultidata()

    // 2、请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')

  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  activated() {
    // console.log('activated');
    this.$refs.scroll.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // console.log('deactivated');
    this.saveY = this.$refs.scroll.getScrollY()
    // console.log(this.saveY);
  },
  mounted() {
    // 1.图片加载事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 100)

    this.$bus.$on('itemImageLoad',() =>{
      // console.log('------');
      // this.$refs.scroll.refresh()
      refresh()
    })

    // 2.获取tabControl的offsetTop
    // 所有的组件都有一个属性：$el  用于获取组件中的元素
    // console.log(this.$refs);
    // console.log(this.$refs.tabControl.$el.offsetTop);
    // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop


  },
  methods: {
    /**
     * 事件监听相关的方法
     * */
    tabClick(index){
      switch(index){
        case 0: this.currentType = 'pop'
              break
        case 1: this.currentType = 'new'
              break
        case 2: this.currentType = 'sell'
              break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    backClick() {
      this.$refs.scroll.scrollTo(0,0,500)
    },
    contentScroll(position) {
      // 1、判断BackTop是否显示
      // console.log(position);
      this.isShowBackTop=position.y <-1000

      // 2、判断tabControl是否吸顶(position: fixed)
      this.isTabFixed = (-position.y > this.tabOffsetTop)
    },
    loadMore() {
      // console.log("上拉加载更多");
      this.getHomeGoods(this.currentType)
      //  加载完成后调用刷新方法，用来重新计算可滚动区域，解决滚不动的问题
      this.$refs.scroll.scroll.refresh()
    },
    swiperImageLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    /**
     * 网络请求相关的方法
     * */
    getHomeMultidata(){
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type){
      const page = this.goods[type].page + 1
      getHomeGoods(type,page).then(res => {
        // console.log(res);
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page+=1

        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    /*position: relative;*/

    /* vh: viewpoint height 视口高度 */
    height: 100vh;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #ffffff;

    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  /*.tab-control{*/
  /*  position: sticky;*/
  /*  top: 44px;*/
  /*  z-index: 9;*/
  /*}*/

  .content {
    /*position: absolute;*/
    /*top: 44px;*/
    /*bottom: 49px;*/
    /*left: 0;*/
    /*right: 0;*/
    height: calc(100vh - 93px);
    overflow: hidden;

  }
  .tab-control {

  }

</style>
