<template>
  <div class="page-empty"
    :style="{'height': `calc(100vh - ${height}rem)`}"
  >
    <slot>
      <img v-if="isSearch" src="examples/assets/search@2x.png" alt="">
      <img v-else src="examples/assets/empty@2x.png" alt="">
    </slot>
    <div class="page-empty-tips" v-if="tips">{{tips}}</div>
    <div class="page-empty-desc" v-if="descript">{{descript}}</div>
  </div>
</template>

<script>
export default {
  name: 'xcEmpty',
  props: {
    // 提示信息
    tips: {
      type: String,
      default: '哎呦 空空的~'
    },
    // 描述信息
    descript: {
      type: String,
      default: ''
    },
    // 搜索
    isSearch: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 1
    }
  }
}
</script>

<style lang="less" scoped>
.page-empty {
  text-align: center;
  // background-color: #fff;
  img {
    width: 1.68rem;
    height: 1.68rem;
    font-size: 0.18rem;
    font-weight: 500;
    color: #222222;
    text-align: center;
    margin-top: 1.2rem;
  }
  &-tips,
  &-desc {
    height: 0.22rem;
    font-size: 0.16rem;
    font-weight: 400;
    color: #666666;
    line-height: 0.22rem;
    margin-top: 0.04rem;
  }
  &-desc {
    margin-top: 0.2rem;
  }
}
</style>