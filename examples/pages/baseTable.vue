<template>
  <navbar 
    @backHandler="backHandler"
    navTitle="基础表格"
  ></navbar>
  <div class="page-home"> 
    <table-list
      :columns="titleList"
      :data="dataList"
      showBorder
    >
      <template #slotDate="{item, titleItem}">
        <div class="user-info">
          <span 
            class="ellipsis"
          >{{ titleItem.title }}</span>
        </div>
      </template>
    </table-list>
  </div>
 
</template>
<script setup lang="ts">
import Mock from 'mockjs'
import { useRouter } from 'vue-router'
const router = useRouter()
import tableList from '@/components/table/index.vue'
import { setData } from '@/utils/getTableData.ts'
const titleList = [
    {
      title: '日期',
      width: 100,
      key: 'date',
      ellipsis: true,
      fixed: 'left',
      slotHeader: 'slotDate'
    },
    {
      title: '姓名',
      width: 85,
      key: 'name',
      fieldName: 1,
      align: 'right'
      // formatter
    },
    {
      title: '年龄',
      width: 75,
      key: 'age',
      fieldName: 1,
      align: 'right'
    },
    {
      title: '公司',
      width: 95,
      key: 'company',
      fieldName: 1,
      align: 'right'
    },
    {
      title: '岗位',
      width: 95,
      key: 'work',
      fieldName: 1,
      align: 'right'
    },
    {
      title: '城市',
      width: 100,
      key: 'city',
      align: 'right',
      fieldName: 3,
      // fixed: 'right',
      ellipsis: true
      // formatter
    }
  ]
  const dataObj = {
    date: '@date',
    name: "@cname",
    age: '@integer(24, 65)',
    company: '@pick(["阿里", "腾讯", "字节"])',
    work: '@pick(["产品", "运营", "ui", "前端", "后端", "测试", "运维"])',
    city: '@city()'
  }
  const dataList = setData(Mock.mock('@natural(15, 25)'), dataObj)
  const backHandler = () => {
    router.go(-1)
  }
</script>
<style lang="less">
  .page-home {
    padding: 88px 0;
  }
  .table-block {
    margin-top: 10px;
  }
</style>