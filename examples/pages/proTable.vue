<template>
  <div class="page-home"> 
    <table-list
      :columns="titleList"
      :data="dataList"
      isHeaderFixed
      :headerFixedTopValue="0"
      showBorder
      @mergeCellMethods="mergeCellMethods"
    >
      <template #slotDate="{titleItem}">
        <div class="user-info">
          <span 
            class="ellipsis"
          >{{ titleItem.title }}</span>
        </div>
      </template>
    </table-list>
  </div>
</template>
<script>
import tableList from '@packages/table'
import Mock from 'mockjs'
// 设置数据
function setData(len, obj) {
  return Array.from({length: len}).map(() => {
    return Mock.mock(obj)
  })
}
const dataObj = {
  date: '@date',
  name: "@cname",
  age: '@integer(24, 65)',
  company: '@pick(["阿里", "腾讯", "字节"])',
  work: '@pick(["产品", "运营", "ui", "前端", "后端", "测试", "运维"])',
  city: '@city()'
}
const titleList = [
  {
    title: '日期',
    width: '0.8',
    key: 'date',
    ellipsis: true,
    fixed: 'left',
    slotHeader: 'slotDate'
  },
  {
    title: '基本信息',
    key: 'baseInfo',
    children: [
      {
        title: '姓名',
        width: '0.95',
        key: 'name',
        fieldName: 1,
        align: 'right',
        commaSplice: true,
        // formatter
      },
      {
        title: 'other',
        key: 'other',
        children: [
          {
            title: '年龄',
            width: '0.95',
            key: 'age',
            fieldName: 1,
            align: 'right'
          },
          {
            title: '公司',
            width: '0.95',
            key: 'company',
            fieldName: 1,
            align: 'right'
          },
        ]
      }
    ]
  },
  {
    title: '岗位',
    width: '0.95',
    key: 'work',
    fieldName: 1,
    align: 'right',
    commaSplice: true,
  },
  {
    title: '城市',
    width: '1.3',
    key: 'city',
    align: 'right',
    commaSplice: true,
    fieldName: 3,
    ellipsis: true,
  }
]

export default {
  name: 'testTable',
  components: {
    tableList
  },
  data() {
    return {
      titleList,
      dataList: setData(Mock.mock('@natural(0, 20)'), dataObj)
    }
  },
  created() {
    console.log('dataList', JSON.stringify(this.dataList))
  },
  methods: {
    mergeCellMethods(row, column, rowIndex, columnIndex) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 1) {
          return [1, 2];
        } else if (columnIndex === 2) {
          return [0, 0];
        }
      }
    }
  }
}
</script>
<style lang="less">
  .page-home {
    background: #fff;
  }
  .table-block {
    margin-top: 0.1rem;
  }
</style>