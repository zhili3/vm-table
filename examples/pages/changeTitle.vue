<template>
  <navbar @backHandler="backHandler" navTitle="动态表头"></navbar>
  <div class="page-home">
    <tab :tabList="tabList" class="tab-menus" v-model:modelValue="activeVal" />
    <table-list :columns="pageData.titleList" :data="dataList" :headerFixedTopValue="142" showBorder>
      <template #slotDate="{item, titleItem}">
        <div class="user-info">
          <span class="ellipsis">{{ titleItem.title }}</span>
        </div>
      </template>
    </table-list>
  </div>
</template>
<script setup lang="ts">
import Mock from "mockjs";
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import tab from "@/components/tab/index.vue";
import tableList from "@/components/tablePro/index.vue";
import { setData } from "@/utils/getTableData.ts";

const titleList = [
  {
    title: "日期",
    width: 100,
    key: "date",
    ellipsis: true,
    fixed: "left",
    slotHeader: "slotDate"
  },
  {
    title: "姓名",
    width: 85,
    key: "name",
    fieldName: 1,
    align: "right"
    // formatter
  },
  {
    title: "年龄",
    width: 75,
    key: "age",
    fieldName: 1,
    align: "right"
  },
  {
    title: "公司",
    width: 95,
    key: "company",
    fieldName: 1,
    align: "right"
  },
  {
    title: "岗位",
    width: 95,
    key: "work",
    fieldName: 1,
    align: "right"
  },
  {
    title: "城市",
    width: 100,
    key: "city",
    align: "right",
    fieldName: 3,
    // fixed: 'right',
    ellipsis: true
    // formatter
  }
];

// tab菜单
const tabList = [
  {
    title: "个人信息",
    name: 1,
    key: "staffMsg",
    titleKeys: ['date', 'name', 'age']
  },
  {
    title: "岗位信息",
    name: 2,
    key: "station",
    titleKeys: ['date', 'name', 'company', 'work', 'city']
  }
];

const dataObj = {
  date: "@date",
  name: "@cname",
  age: "@integer(24, 65)",
  company: '@pick(["阿里", "腾讯", "字节"])',
  work: '@pick(["产品", "运营", "ui", "前端", "后端", "测试", "运维"])',
  city: "@city()"
};

// 获取排名数据
let activeVal = ref(1);
const pageData = reactive({
  titleList: []
})

watch(
  () => activeVal.value,
  () => {
    const arr = (tabList.find(item => item.name == activeVal.value) || {}).titleKeys || []
    pageData.titleList = titleList.filter(item => arr.includes(item.key))
    console.log('pageData.titleList', activeVal.value, arr, pageData.titleList)
  },
  { 
    immediate:true
  }
);

const dataList = setData(Mock.mock("@natural(15, 25)"), dataObj);
const backHandler = () => {
  router.go(-1);
};
</script>
<style lang="less">
.page-home {
  padding: 88px 0;
}
.table-block {
  margin-top: 10px;
}
.tab-menus {
  padding-bottom: 10px;
  z-index: 100 !important;
}
.market-tab {
  position: sticky;
  left: 0;
  top: 88px;
  z-index: 10;
  background: #fff;
}
</style>