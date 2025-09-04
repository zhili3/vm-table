<!--
 * @Description: table表格
 * Table
 * 参数------------------说明----------------------------类型------------------默认值
 * showTitle             |  是否展示表头                | boolean             | true
 * showList              |  是否展示列表                | boolean             | true
 * showEmpty             |  是否展示缺省图文            | boolean             | false
 * columns               |  表格列的配置描述见下表      | array               | []
 * data                  |  列表数据                    | array               | []
 * showBorder            |  是否显示单元格边框          | boolean              |  false 
 * borderBottom          |  是否显示单元格底部边框,设置了| boolean             | true
 *                       |  showBorder就不需要再设置     |                     |
 *                       |  borderBottom                 |                     | true
 * isHeaderFixed         |  表头是否吸顶                  | boolean             | true     
 * headerFixedTopValue   |  页面划动，表头吸顶top值      | Number (单位rem)    | 0.88     
 * showTitleTopBorder    |  是否显示表头顶部边框         | boolean             | false
 * height                |  行高度                       | number、string      | 0.5(单位rem)  
 *                       |                               | (可设为'auto')      |   
 * headerHeight          |  表头单元格高度                | 同height配置        | 0.42(单位rem)
 * rowKey                |  列表渲染中key使用的字段，不传 | string              | ''
 *                       |  rowKey默认使用index           |                     |
 * ------------------------------------------------------------------------------------
 * columns配置说明
 * 参数------------------说明----------------------------类型------------------默认值
 * title                 | 表头展示内容                  | string (支持传html)   | ''
 * width                 | 单元格宽度                    | number                | 0.7(单位rem)
 * widthAuto             | 宽度自适应，会把剩余宽度按比例 | boolean               | false 
 *                       | 分配给设置了该字段的列         |                       |
 * key                   | 当前列要展示的字段             | string 每一个 表头选项 |
 *                       |                                |key要保持惟一          | -（无默认值)
 * fixed                 | 列是否固定，可选 'left' 'right' | string                | 
 *                       | 如果是多级表头，只需要给一级(第一层)|                 | 
 *                       | 表头设置fixed                   | -(无默认值)
 * align                 | 单元格对齐方式, 可选'left'      | string                | 'left'
 *                       | 'center' 'right'                |                       |
 * ellipsis              | 超过宽度将自动省略              | boolean                | false
 * slotHeader            | title 插槽key,可使用此字段添加插槽| string               | -
 * headerBackground      | 表头背景色                      | string                 | '#fff'
 * sort                  | 排序,可选值 1|down (顺序)       | number|string          | -
 *                       | 2|up (倒序) 0 : 显示排序icon    |                        |
 * commaSplice           | 千分位                          |      boolean           | false
 * formatter             | 列表单元格格式化函数            |   Function(h,          | -
 *                       |                                 |   row, column, index)  |
 * util                  | 单位                            |   number、string       |
 * children              | 子表头                          |   array                |
------------------------------------------------------------------------------------------
* 插槽说明
* 使用 columns 属性key自定义单元格内容               
* 表头插槽使用 columns 属性 slotHeader自定义表头内容
* ------------------------------------------------------------------------------------------
* changeSort                | 排序方法                      | Function(column)        |
* handlerClick              | row 点击事件                  | Function(row, index)    |
* handlerCellClick          | cell 点击事件                 | Function(row, column)   |
* resetScrollLeft           | 重置滚动方法，在父组件需要重置 | function()              |
*                           |滚动条时调用                    |                        |
* mergeCellMethods          | 合并单元格方法，用法同element-ui| function(v, item, rowIndex, columnIndex)     
*
-->
<template>
  <div class="table-block">
    <div class="table-block-list" ref="tableRef">
      <div
        v-for="item in columnArr"
        :key="item.fixed"
        class="table-block-list-content"
        :class="[item.shadow && `content-${item.fixed}`]"
        :style="{
          width: item.width
        }"
      >
        <tableTitle
          v-if="showTitle"
          v-bind="$attrs"
          v-on="$listeners"
          :titleList="item.titleList"
          :columns="item.col"
          :rowWidth="item.colWidth"
          :fixedCol="item.fixed"
          :isXScroll="isXScroll"
          :htmlFontSize="htmlFontSize"
          :fixedWidthDefault="fixedWidthDefault"
          :maxDeep="maxDeep"
          :id="item.fixed === 'center' ? rowTitleId : ''"
          @changeSortHandler="val => changeSort(val)"
          @scroll.native="e => onscrollHandler(e, rowListId)"
        >
          <template v-for="ite in item.headerSlots" #[ite.slotHeader]="{ titleItem }">
            <slot :name="ite.slotHeader" :titleItem="titleItem"> </slot>
          </template>
        </tableTitle>
        <tableList
          v-if="showList && data.length > 0"
          v-bind="$attrs"
          v-on="$listeners"
          :columns="item.col"
          :data="data"
          :rowWidth="item.colWidth"
          :fixedCol="item.fixed"
          :isXScroll="isXScroll"
          :htmlFontSize="htmlFontSize"
          :fixedWidthDefault="fixedWidthDefault"
          :fixedLeftLength="fixedLeftLength"
          :centerColumnLength="centerColumnLength"
          :id="item.fixed === 'center' ? rowListId : ''"
          @scroll.native="e => onscrollHandler(e, rowTitleId)"
        >
          <template v-for="ite in item.colSlots" #[ite.key]="{item, titleItem}">
            <slot :name="ite.key" :item="item" :titleItem="titleItem"> </slot>
          </template>
        </tableList>
      </div>
    </div>
    <!-- 缺省图 -->
    <empty v-if="showEmpty && data.length === 0"></empty>
  </div>
</template>

<script>
import tableList from './list.vue'
import tableTitle from './title.vue'
import empty from './empty/index.vue'
import { scrollLeftTo } from '@/utils/scrollLeftTo.js'
import { hasOwn, throttle } from '@/utils/tool.js'

export default {
  name: 'xcTable',
  components: {
    tableList,
    tableTitle,
    empty
  },
  props: {
    // 展示的列 注意: 如果有排序功能，changeSort方法会改变columns值，
    // 所以传过来的columns不能是computed里面包含的计算属性，应该定义在data里面
    columns: {
      type: Array,
      default: () => []
    },
    // 源数据
    data: {
      type: Array,
      default: () => []
    },
    // 是否显示标题头
    showTitle: {
      type: Boolean,
      default: true
    },
    // 是否显示列表数据
    showList: {
      type: Boolean,
      default: true
    },
    // 是否显示空状态
    showEmpty: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rowTitleId: 'rowTitle' + Math.ceil(Math.random() * 10 ** 10),
      rowListId: 'rowList' + Math.ceil(Math.random() * 10 ** 10),
      fixedWidthDefault: 0.7, // 单元格默认宽度
      viewWidth: 360, // 屏幕默认宽度
      scopedSlotsKeys: [], // 插槽name数组
      htmlFontSize: 0, // 1rem对应px值
      // columns // 测试多级表头
    }
  },
  created() {
    this.getScopedSlotsKeys()
    this.throttleFn = throttle(30) 
  },
  mounted() {
    window.addEventListener('resize', this.init)
    this.init()
  },
  beforeUpdate() {
    this.getScopedSlotsKeys()
    // this.scrollToTarget()
  },
  methods: {
    init() {
      this.getViewWidth()
      this.getHtmlFontSize()
    },
    // 屏幕宽度
    getViewWidth() {
      this.$nextTick(() => {
        const tableDom = this.$refs.tableRef
        if (!tableDom) {
          return
        }
        const tableBlockStyle = window.getComputedStyle(tableDom)
        const width = +tableBlockStyle.width.replace('px', '')
        const paddingLeft = +tableBlockStyle.paddingLeft.replace('px', '')
        const paddingRight = +tableBlockStyle.paddingRight.replace('px', '')
        const widthSum = width - paddingLeft - paddingRight
        this.viewWidth = !isNaN(widthSum) ? widthSum : this.viewWidth
      })
    },
    // 获取1rem对应的px值
    getHtmlFontSize() {
      this.$nextTick(() => {
        const htmldom = document.querySelector('html')
        this.htmlFontSize = +window.getComputedStyle(htmldom).fontSize.slice(0, -2)
      })
    },
    // 表头数据
    getColumnArr(list) {
      return list.reduce(
        (pre, cur) => {
          pre[cur.deep - 1].push(cur)
          return pre
        },
        Array.from({ length: this.maxDeep }).map(() => [])
      )
    },
    // 获取插槽name数组
    getScopedSlotsKeys() {
      const slotKeys = Object.keys(this.$scopedSlots || {})
      // console.log('slotKeys===>', slotKeys, this.$scopedSlots)
      this.scopedSlotsKeys = slotKeys.reduce((pre, key) => {
        if (typeof this.$scopedSlots[key] === 'function') {
          pre.push(key)
        }
        return pre
      }, [])
    },
    // 获取列宽和
    getColWidth(arr) {
      return +arr
        .reduce((pre, cur) => {
          if (!cur.hasChildren) {
            pre += cur.width ? +cur.width : this.fixedWidthDefault
          }
          return pre
        }, 0)
        .toFixed(2)
    },
    // 获取title 插槽
    getHeaderSlots(arr) {
      return arr.filter(item => item.slotHeader && this.scopedSlotsKeys.includes(item.slotHeader))
    },
    // 获取列表插槽
    getListSlots(arr) {
      return arr.filter(item => this.scopedSlotsKeys.includes(item.key))
    },
    // title和list同步滚动
    onscrollHandler(e, id) {
      this.throttleFn(function() {
        const dom = document.querySelector(`#${id}`)
        // console.log('e===>', e?.target?.scrollLeft)
        // console.log('dom===>', dom.scrollLeft)
        if (dom) {
          // scrollLeftTo(dom, e?.target?.scrollLeft || 0, 0.3);
          dom.scrollLeft = e?.target?.scrollLeft
        }
      })
    },
    // 滚动重置到左侧
    resetScrollLeft() {
      this.$nextTick(() => {
        const domTitle = document.querySelector(`#${this.rowTitleId}`)
        const domList = document.querySelector(`#${this.rowListId}`)
        if (domTitle) {
          scrollLeftTo(domTitle, 0, 0.3);
        }
        if (domList) {
          scrollLeftTo(domList, 0, 0.3);
        }
      })
    },
    // 表头和内容列对齐
    scrollToTarget() {
      const domTitle = document.querySelector(`#${this.rowTitleId}`)
      const domList = document.querySelector(`#${this.rowListId}`)
      if (!domTitle) {
        return
      }
      const domTitleScrollLeft = domTitle.scrollLeft
      if (domList) {
        scrollLeftTo(domList, domTitleScrollLeft, 0);
      }
    },
    changeSort(obj) {
      let target = null
      this.columns.forEach(element => {
        if (element.key === obj.key) {
          if (element.sort === 0) {
            element.sort = 2
          } else {
            element.sort = element.sort === 1 ? 2 : 1
          }
          target = {
            ...element
          }
        } else if (hasOwn(element, 'sort')) {
          element.sort = 0
        }
      })
      // console.log('columns', this.columns)
      this.$emit('changeSort', target)
    },
    /**
     * 数据处理
     * @params columns: 遍历的数组
     * @params obj: 处理后的结果
     * @params deep: 当前深度
     * @params isFirst: 是否是第一次调用函数
     * @params currentKey: 从父级到当前子级的key
     * @params fixed: 固定列子集添加fixed值
     */
    getColumnList(columns, obj, deep, isFirst, currentKey, fixed) {
      columns.forEach(item => {
        // 重置深度
        if (isFirst) {
          deep = 1
        }
        const ob = {
          ...item
        }
        ob.keysStr = isFirst ? ob.key : currentKey + '-' + ob.key
        ob.deep = deep
        if (fixed) {
          ob.fixed = fixed
        }
        if (!ob.children) {
          ob.hasChildren = false
          obj.list.push(ob)
        } else {
          ob.hasChildren = true
          deep++
          if (deep > obj.maxDeep) {
            obj.maxDeep = deep
          }
          obj.list.push({
            ...ob,
            children: []
          })
          this.getColumnList(item.children, obj, deep, false, ob.keysStr, ob.fixed || undefined)
        }
      })
    }
  },
  computed: {
    columnObj() {
      const obj = {
        list: [], // 扁平化数据列表
        maxDeep: 1 // 最大深度
      }
      this.getColumnList(this.columns, obj, 1, true, '', undefined)
      obj.list.forEach((item) => {
        item.colSpan = obj.list.filter(ite => {
          const arr = ite.keysStr.split('-')
          return arr.includes(item.key) && !ite.hasChildren
        }).length
        if (!item.hasChildren) {
          item.rowSpan = obj.maxDeep - item.deep + 1 // 根据表格得出规律
        } else {
          item.rowSpan = 1
        }
      })
      // console.log('list===>', obj.list, obj.maxDeep)
      return obj
    },
    // 标题list
    titleList() {
      return this.columnObj.list
    },
    // 标题行数
    maxDeep() {
      return this.columnObj.maxDeep
    },
    // 要展示得列数
    columnsList() {
      return this.titleList.filter(item => !item.hasChildren)
    },
    // 所有列宽和
    rowWidth() {
      return this.columnsList.reduce((pre, cur) => {
        pre += cur.width ? +cur.width : this.fixedWidthDefault
        return pre
      }, 0)
    },
    // x轴宽度超出屏幕宽度
    isXScroll() {
      // console.log('isXScroll', this.rowWidth, this.viewWidth, this.htmlFontSize)
      return this.rowWidth * this.htmlFontSize - this.viewWidth > 0
    },
    // 左侧固定列
    fixedLeftLength() {
      const arr = this.columnsList.filter(item => item.fixed === 'left')
      return arr.length
    },
    centerColumnLength() {
      return this.columnsList.filter(item => !['left', 'right'].includes(item.fixed)).length
    },
    // 列list
    columnArr() {
      let obj = {
        left: [],
        center: [],
        right: []
      }
      this.titleList.forEach((item) => {
        // fixed 值为 String
        if (item.fixed === 'left' || item.fixed === 'right') {
          obj[item.fixed].push(item)
        } else {
          obj.center.push(item)
        }
      })
      const wt = {
        left: this.getColWidth(obj.left),
        center: this.getColWidth(obj.center),
        right: this.getColWidth(obj.right)
      }
      const arr = []
      Object.keys(obj).forEach(key => {
        if (obj[key].length > 0) {
          arr.push({
            titleList: this.getColumnArr(obj[key]),
            col: obj[key].filter(item => !item.hasChildren),
            fixed: key,
            colWidth: wt[key], // 列宽度
            // 此处宽度需动态计算,屏幕宽度不一样对应的1rem等于多少px不一样
            width: ['left', 'right'].includes(key) ? wt[key] + 'rem' : `calc(100% - ${wt.left + wt.right}rem)`,
            headerSlots: this.getHeaderSlots(obj[key]),
            colSlots: this.getListSlots(obj[key]),
            shadow: key !== 'center' ? this.isXScroll : false
          })
        }
      })
      // 最后一列添加类名
      const obje = arr[arr.length - 1]
      if (obje) {
        const objCol = obje.col
        const lastCol = objCol[objCol.length - 1]
        if (lastCol) {
          lastCol.isLastCol = true
        }
        obje.titleList.forEach(item => {
          const last = item[item.length - 1]
          if (last) {
            last.isLastCol = true
          }
        })
      }
      // console.log('arr===>', arr)
      return arr
    }
  }
}
</script>

<style lang="less" scoped>
.table-block {
  width: 100%;
  max-width: 100%;
  .table-block-list {
    width: 100%;
    max-width: 100%;
    padding: 0 0.1rem;
    display: flex;
    justify-content: flex-start;
    &-content {
      position: relative;
      &.content-left::before,
      &.content-right::before {
        content: '';
        position: absolute;
        width: 8px;
        height: 100%;
        top: 0;
        bottom: 0;
        right: -7px;
        background: linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, #f1f1f1 100%);
        z-index: 80;
      }
      &.content-right::before {
        left: -1px;
      }
    }
  }
  /deep/ .page-empty {
    height: 3rem !important;
    img {
      margin-top: 0.2rem;
    }
  }
}
</style>
