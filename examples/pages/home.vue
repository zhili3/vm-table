<template>
  <div class="page-home"> 
   <van-button type="primary" @click="router.push('/baseTable')">基础表格</van-button>
   <van-button type="primary" @click="router.push('/proTable')">单元格可以合并的表格</van-button>
   <van-button type="primary" @click="router.push('/changeTitle')">可变表头</van-button>
  </div>
 
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
 
function toHomePage() {
  router.push('/')
}
</script>
<style lang="less" scoped>
  .page-home {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px 15px;
    :deep(.van-button--normal) {
      margin-bottom: 10px;
    }
  }
</style>