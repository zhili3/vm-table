# vm-table

Mobile table component with useful functions.
## install
```
1、npm install vm-table --save

```
## Usage

```js
  // 引入文件
  import vm-table from 'vm-table'
  import vm-table from 'vm-table.css'
  Vue.use(vm-table)

  // 组件使用方法
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
  const dataList = [{
    "date": "2025-05-22",
    "name": "胡霞",
    "age": 34,
    "company": "字节",
    "work": "前端",
    "city": "南平市"
  }, {
    "date": "2002-03-07",
    "name": "丁洋",
    "age": 52,
    "company": "阿里",
    "work": "测试",
    "city": "威海市"
  }, {
    "date": "1977-07-14",
    "name": "许丽",
    "age": 29,
    "company": "字节",
    "work": "前端",
    "city": "江门市"
  }, {
    "date": "2000-10-25",
    "name": "冯磊",
    "age": 63,
    "company": "字节",
    "work": "运营",
    "city": "渭南市"
  }, {
    "date": "2020-09-17",
    "name": "尹超",
    "age": 62,
    "company": "腾讯",
    "work": "前端",
    "city": "宣城市"
  }, {
    "date": "1972-03-02",
    "name": "万敏",
    "age": 64,
    "company": "腾讯",
    "work": "前端",
    "city": "连云港市"
  }, {
    "date": "2022-08-15",
    "name": "段磊",
    "age": 43,
    "company": "腾讯",
    "work": "运维",
    "city": "安康市"
  }]

  <vm-table
    :columns="titleList"
    :data="dataList"
  ></tvm-table>

```


## Properties
 ###  table 配置说明

 | 参数 | 说明 | 类型 | 默认值
 | --- | --- | --- | --- |
 | showTitle            |  是否展示表头                | boolean             | true|
 |showList              |  是否展示列表                | boolean             | true|
 |showEmpty             |  是否展示缺省图文            | boolean             | false|
 |columns               |  表格列的配置描述见下表      | array               | [] |
 |data                  |  列表数据                    | array               | [] |
 |showBorder            |  是否显示单元格边框          | boolean              |  false | 
 |borderBottom          |  是否显示单元格底部边框,设置了showBorder就不需要再设置borderBottom| boolean | true |
 |isHeaderFixed         |  表头是否吸顶                  | boolean             | true |
 |headerFixedTopValue   |  页面划动，表头吸顶top值      | Number (单位rem)    | 0.88   |  
 |showTitleTopBorder    |  是否显示表头顶部边框         | boolean             | false  |
 |height                |  行高度                       | number \| string   (可设为'auto') | 0.5(单位rem) |  
 |headerHeight          |  表头单元格高度                | 同height配置        | 0.42(单位rem)|
 |rowKey                |  列表渲染中key使用的字段，不传rowKey默认使用index | string              | '' |
                       

 ### columns配置说明
 |参数 | 说明| 类型 | 默认值|
 | --- | --- | --- | --- |
 |title                | 表头展示内容                  | string (支持传html)   | '' |
 |width                 | 单元格宽度                    | number                | 0.7(单位rem) |
 |widthAuto             | 宽度自适应，会把剩余宽度按比例分配给设置了该字段的列 | boolean       | false|
 |key                   | 当前列要展示的字段             | string 每一个 表头选项key要保持惟一 |-（无默认值)|
 |fixed                 | 列是否固定，可选 'left' 'right', 如果是多级表头，只需要给一级(第一层)表头设置fixed | string| -(无默认值)|
 |align                 | 单元格对齐方式, 可选'left'  'center' 'right'    | string                | 'left'|
 |ellipsis              | 超过宽度将自动省略              | boolean                | false|
 |slotHeader            | title 插槽key,可使用此字段添加插槽| string               | - |
 |headerBackground      | 表头背景色                      | string                 | '#fff' |
 |sort                  | 排序,可选值 1 \| down (顺序)  2 \| up (倒序) 0 : 显示排序icon  | number \| string          | - |
 |commaSplice           | 千分位                          |      boolean           | false |
 |formatter             | 列表单元格格式化函数            |   Function(h, row, column, index)       | - |
 |util                  | 单位                            |   number、string       |
 |children              | 子表头                          |   array                |
 
 ### 插槽说明
 使用 columns 属性key自定义单元格内容               
 表头插槽使用 columns 属性 slotHeader自定义表头内容
|函数名称 | 说明 | 参数 |
| --- | --- | --- |
| changeSort                | 排序方法                      | Function(column)        |
| handlerClick              | row 点击事件                  | Function(row, index)    |
| handlerCellClick          | cell 点击事件                 | Function(row, column)   |
| resetScrollLeft           | 重置滚动方法，在父组件需要重置滚动条时调用 | function()    |
| mergeCellMethods          | 合并单元格方法 | function(v, item, rowIndex, columnIndex) |     


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
