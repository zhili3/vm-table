<!-- <template>
  <div
    class="table-title"
    :class="{ 'fixed-top': headerFixedTopValue || +headerFixedTopValue === 0 }"
    :style="{
      top: headerFixedTopValue + 'rem'
    }"
  >
    <ul
      :class="[{ 'title-top-border': titleTopBorder }]"
      :style="{
        width: rowWidth + 'rem',
        height: headerHeight + 'rem'
      }"
    >
      <li
        v-for="(item, index) in columns"
        :key="index"
        :style="{
          width: item.width + 'rem',
          position: 'fixed' in item ? 'sticky' : '',
          [item.fixed === 'left' ? 'left' : 'right']: item.distance + 'rem',
          'z-index': 'fixed' in item ? '60' : '',
          'flex-grow': item.widthAuto ? 1 : 0,
          'text-align': item.align || 'left',
          'justify-content': justifyContent(item.align) 
        }"
        :class="[
          { 'sticky-left': item.fixed === 'left' && item.stickyLast && isXScroll },
          { 'sticky-right': item.fixed === 'right' && item.stickyLast && isXScroll },
          { 'border-bottom': borderBottom }
        ]"
        @click="e => changeSort(item)"
      >
        <slot v-if="item.slotHeader" :name="item.slotHeader" :titleItem="item">
          <div
            class="table-title-cell" v-dompurify-html="item.title"
          ></div>
        </slot>
        <div
          v-else
          class="table-title-cell"
          :class="{'table-title-cell-sort': 'sort' in item}"
        >
          <span v-dompurify-html="item.title"></span>
          <div v-if="'sort' in item" class="table-title-cell-sort-block">
            <img :src="sortIcon(item)" alt="" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template> -->

<script>
export default {
  name: 'tableTitle',
  components: {},
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    titleList: {
      type: Array,
      default: () => []
    },
    maxDeep: {
      type: Number,
      default: 1
    },
    // 边框
    showBorder: {
      type: Boolean,
      default: false
    },
    // 单元格底部边框
    borderBottom: {
      type: Boolean,
      default: true
    },
    // 是否吸顶
    isHeaderFixed: {
      type: Boolean,
      default: true
    },
    // 吸顶,表头离顶部定位top值
    headerFixedTopValue: {
      type: [Number, String],
      default: 0.88
    },
    // 行宽
    rowWidth: {
      type: Number,
      default: 3.75
    },
    // 表头单元格高度
    headerHeight: {
      type: [Number, String],
      default: 0.42
    },
    // 标题顶部边框
    showTitleTopBorder: {
      type: Boolean,
      default: false
    },
    headerBackground: {
      type: String,
      default: ''
    },
    fixedCol: {
      type: String,
      default: 'center'
    },
    htmlFontSize: {
      type: [Number, String],
      default: 100
    },
    // 单元格默认宽度
    fixedWidthDefault: {
      type: [Number, String],
      default: 0.7
    },
  },
  data() {
    return {}
  },
  computed: {},
  created() {
    // console.log('index', this.columns)
  },
  render(h) {
    // 单元格样式
    const tableTitleCell = item => {
      // 注意！ 父组件再没有书写 v-slot 时子组件的 $scopedSlots 没有上述函数！
      // 因此再编写子组件渲染函数的时候注意检查
      let target = []
      const slotName = this.$scopedSlots[item.slotHeader]
      // console.log('slotName', typeof slotName)
      const isSlot = 'slotHeader' in item && typeof slotName === 'function'
      if (isSlot) {
        target.push(
          slotName({
            titleItem: item
          })
        )
      } else {
        target.push(
          h('span', {
            domProps: {
              innerHTML: item.title
            },
            class: ['table-title-cell-span']
          })
        )
        if ('sort' in item) {
          target.push(
            h(
              'div',
              {
                class: ['table-title-cell-sort-block']
              },
              [
                h('img', {
                  domProps: {
                    src: this.sortIcon(item)
                  }
                })
              ]
            )
          )
        }
      }
      return h(
        'div',
        {
          class: ['table-title-cell', { 'table-title-cell-sort': 'sort' in item && !isSlot }],
          style: {
            'justify-content': this.justifyContent(item.align)
          }
        },
        target
      )
    }
     // th标签样式
    const thDom = col => {
      return col.map((item, index) => {
        return h(
          'th',
          {
            key: index,
            attrs: {
              rowspan: item.rowSpan,
              colspan: item.colSpan
            },
            class: [
              { 'show-border': this.showBorder },
              { 'border-bottom': this.borderBottom },
              { 'column-last': item.isLastCol }
            ],
            style: {
              'z-index': 'fixed' in item ? '60' : '',
              'text-align': item.align || (item.hasChildren ? 'center' : 'left'),
              background: this.headerBackground || undefined
            },
            on: {
              click: () => this.changeSort(item)
            }
          },
          [tableTitleCell(item)]
        )
      })
    }
    // thead标签样式
    const theadDom = () => {
      return h(
        'thead',
        {
          class: [{ 'title-top-border': this.showTitleTopBorder }, 'table-thead']
        },
        [
          this.titleList.map((item, index) => {
            return h(
              'tr',
              {
                key: index,
                class: ['table-thead-th'],
                style: {
                  height: this.headerHeight + 'rem'
                }
              },
              thDom(item)
            )
          })
        ]
      )
    }
    // col标签样式,用来控制列的宽度
    const colgroups = () => {
      return h(
        'colgroup',
        this.columns.map((item, index) => {
          let colWidth = 100
          try {
            colWidth = ((+item.width || this.fixedWidthDefault) * this.htmlFontSize).toFixed(2)
          } catch (e) {
            console.log('e===>', e)
          }
          return h('col', {
            key: index,
            attrs: {
              key: item.key
            },
            style: {
              width: this.fixedCol === 'center' && item.widthAuto ? 'auto' : colWidth + 'px'
            }
          })
        })
      )
    }
    // table标签样式
    return h(
      'div',
      {
        class: [
          'table-title',
          { 'table-title-left': this.fixedCol === 'left' },
          { 'table-title-center': this.fixedCol === 'center' },
          { 'fixed-top': this.isHeaderFixed ? true : undefined }
        ],
        style: {
          top: this.headerFixedTopValue + 'rem'
        }
      },
      [
        h(
          'table',
          {
            style: {
              width: this.rowWidth + 'rem'
            }
          },
          [colgroups(), theadDom()]
        )
      ]
    )
  },
  methods: {
    // 切换排序
    changeSort(obj) {
      if (!('sort' in obj)) {
        return false
      }
      this.$emit('changeSortHandler', { ...obj })
    },
    // 排序图标
    sortIcon(item) {
      const down = [1, 'up']
      const up = [2, 'down']
      if (down.includes(item.sort)) {
        return require('@axamples/assets/sjg2.png')
      }
      if (up.includes(item.sort)) {
        return require('@axamples/assets/zxFd.png')
      }
      return require('@axamples/assets/order_start_new.png')
    },
    justifyContent(item) {
      const obj = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end'
      }
      return obj[item || 'left']
    }
  }
}
</script>

<style lang="less" scoped>
.table-title {
  max-width: 100%;
  &.fixed-top {
    position: sticky;
    left: 0;
    top: 0.88rem;
    z-index: 70;
  }
  &-center {
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
      width: 0;
      background: transparent;
    }
  }
  table {
    min-width: 100%;
    min-height: 0.3rem;
    table-layout: fixed;
    background-color: #fff;
    // position: relative;
    .title-top-border::before {
      content: '';
      width: 100%;
      height: 1px;
      background-color: #f1f1f1;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 80;
      transform: scale(1, 0.5);
    }

    th {
      background-color: #fff;
      position: relative;
      line-height: 1;
      vertical-align: inherit;
      img {
        width: 0.11rem;
        height: 0.14rem;
        margin-left: 0.04rem;
        vertical-align: middle;
      }
      .table-title-cell {
        padding: 0.04rem 0.08rem;
        &-sort {
          display: flex;
          align-items: center;
          &-block {
            display: inline-block;
          }
        }
        &-span {
          display: inline-block;
          vertical-align: middle;
        }
      }
      &.border-bottom::after {
        content: '';
        width: 100%;
        height: 1px;
        background-color: #f1f1f1;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 10;
        -webkit-transform: scale(1, 0.5);
        transform: scale(1, 0.5);
      }
      &.show-border::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 200%;
        height: 200%;
        background-color: transparent;
        // border-top: 1px solid #F1F1F1;
        border-left: 1px solid #f1f1f1;
        border-bottom: 1px solid #f1f1f1;
        transform-origin: 0 0;
        transform: scale(0.5);
        box-sizing: border-box;
        pointer-events: none;
      }
      &.show-border.column-last::after {
        border-right: 1px solid #f1f1f1;
      }
    }
  }
}
</style>
