
<!-- <template>
  <div class="table-list">
    <ul
      :style="{
        width: rowWidth + 'rem'
      }"
    >
      <li 
        v-for="(v, index) in data"
        :key="index"
        :style="{
          height: height === 'auto' ? 'auto' : height + 'rem'
        }"
        @click="e => $emit('handlerClick', v)"
      >
        <div
          v-for="item in columns"
          :key="item.key"
          class="li-cell"
          :class="[
            { 'flex-auto': item.widthAuto}, item.key,
            {'border-bottom': borderBottom},
            {'sticky-left': item.fixed === 'left' && item.stickyLast && isXScroll},
            {'sticky-right': item.fixed === 'right' && item.stickyLast && isXScroll}
          ]"
          :style="{
            width: item.width + 'rem',
            position: 'fixed' in item ? 'sticky' : '',
            'z-index': 'fixed' in item ? '50' : '',
            'flex-grow': item.widthAuto ? 1 : 0,
            [ 'fixed' in item ? item.fixed : '']: item.distance ? item.distance + 'rem' : '',
            'text-align': item.align || 'left',
            'justify-content': justifyContent(item.align) 
          }"
        >
        
          <div class="li-cell-content"
            :class="{ ellipsis: item.ellipsis }"
          >
            <slot :name="item.key" :item="v" :titleItem="item">
              <span class="li-cell-span">
                {{ item.formatter ? item.formatter(v, item, index) : v[item.key] || '-' }}
              </span>
            </slot>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template> -->
<script>
import { commaSplice } from '@/utils/tool.js'
const _toString = Object.prototype.toString
const getValueType = val => {
  return _toString.call(val).slice(8, -1)
}
export default {
  name: 'tableList',
  props: {
    // 标题
    columns: {
      type: Array,
      default: () => []
    },
    // 数据
    data: {
      type: Array,
      default: () => []
    },
    // 列表渲染中key使用的字段，不传rowKey默认使用index
    rowKey: {
      type: String,
      default: ''
    },
    // 是否显示边框
    showBorder: {
      type: Boolean,
      default: false
    },
    // 是否显示底部边框
    borderBottom: {
      type: Boolean,
      default: true
    },
    rowWidth: {
      type: Number,
      default: 3.75
    },
    // 行高
    height: {
      type: [Number, String],
      default: 0.5 // 'auto' 默认 0.5rem
    },
    fixedCol: {
      type: String,
      default: 'center'
    },
    // 合并单元格方法
    mergeCellMethods: {
      type: Function,
      default: () => [1, 1]
    },
    // 当前1rem对应px值
    htmlFontSize: {
      type: [Number, String],
      default: 100
    },
    // 单元格默认宽度
    fixedWidthDefault: {
      type: [Number, String],
      default: 0.7
    },
    // 固定在左侧的长度
    fixedLeftLength: {
      type: Number,
      default: 0
    },
    // 未固定的列长度
    centerColumnLength: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  computed: {
    // 是否有单元格合并方法
    hasMergeCellMethods() {
      return Object.prototype.toString.call(this.$options.propsData?.mergeCellMethods) === '[object Function]'
    }
  },
  created() {
    // console.log('this.$scopedSlots', this.$scopedSlots)
    // console.log(Object.prototype.toString.call(this.$options.propsData.mergeCellMethods))
  },
  render(h) {
    // 自定义单元格展示内容
    const liCellSpan = (item, v, rowIndex) => {
      let val = ![null, undefined, ''].includes(v[item.key]) ? v[item.key] : ''
      if (item.commaSplice && !isNaN(+val)) {
        val = commaSplice(val)
      }
      val = val ? val + (item.util || '') : ''
      // console.log('val===>', val)
      return h('span', {
        class: 'li-cell-span',
        domProps: {
          innerHTML: typeof item.formatter === 'function' ? item.formatter(h, v, item, rowIndex) : val || '-'
        }
      })
    }
    // 插槽
    const cellContent = (item, v, rowIndex) => {
      const slotName = this.$scopedSlots[item.key]
      // console.log('slotName', typeof slotName, this.$scopedSlots)
      return h(
        'div',
        {
          class: ['li-cell-content', { ellipsis: item.ellipsis }],
          style: {
            'max-height': this.height === 'auto' ? 'auto' : this.height + 'rem'
          }
        },
        [
          typeof slotName === 'function'
            ? slotName({
                item: v,
                titleItem: item
              })
            : liCellSpan(item, v, rowIndex)
        ]
      )
    }
    // 单元格样式
    const tdCell = (v, rowIndex) => {
      return this.columns.map((item, index) => {
        let [rowspan, colspan] = [1, 1]
        // 单元格合并方法
        if (this.hasMergeCellMethods) {
          let spans = [1, 1]
          let columnIndex = index
          if (this.fixedCol === 'center') {
            columnIndex = this.fixedLeftLength + index
          } else if (this.fixedCol === 'right') {
            columnIndex = this.fixedLeftLength + this.centerColumnLength + index
          }
          spans = this.mergeCellMethods(v, item, rowIndex, columnIndex) || [1, 1]
          if (getValueType(spans) === 'Array') {
            rowspan = spans[0]
            colspan = spans[1]
          } else if (getValueType(spans) === 'Object') {
            rowspan = spans.rowspan
            colspan = spans.colspan
          }
          // console.log('rowspan===>', rowIndex, this.mergeCellMethods(v, item, rowIndex, columnIndex) )
        }
        if (rowspan === 0 && colspan === 0) {
          return false
        }
        return h(
          'td',
          {
            key: item.key,
            attrs: {
              rowspan: rowspan,
              colspan: colspan
            },
            class: [
              'li-cell',
              item.key,
              { 'show-border': this.showBorder },
              { 'border-bottom': this.borderBottom },
              { 'column-last': item.isLastCol }
            ],
            style: {
              'text-align': item.align || 'left'
            },
            on: {
              click: e => this.$emit('handlerCellClick', v, item, e)
            }
          },
          [cellContent(item, v, rowIndex)]
        )
      })
    }
    // 行样式
    const tableTbody = () => {
      return h(
        'tbody',
        {
          class: ['table-tbody']
        },
        this.data.map((item, index) => {
          return h(
            'tr',
            {
              key: this.rowKey in item ? item[this.rowKey] : index,
              style: {
                height: this.height === 'auto' ? 'auto' : this.height + 'rem'
              },
              on: {
                click: () => this.$emit('handlerClick', item, index)
              }
            },
            tdCell(item, index)
          )
        })
      )
    }
    // 列样式
    const colgroups = () => {
      return h(
        'colgroup',
        this.columns.map((item) => {
          let colWidth = 100
          try {
            colWidth = ((+item.width || this.fixedWidthDefault) * this.htmlFontSize).toFixed(2)
          } catch (e) {
            console.log('e==>', e)
          }
          return h('col', {
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
    return h(
      'div',
      {
        class: ['table-list', { 'table-list-scroll': this.fixedCol === 'center' }]
      },
      [
        h(
          'table',
          {
            style: {
              width: this.rowWidth + 'rem'
            }
          },
          [colgroups(), tableTbody()]
        )
      ]
    )
  },
  methods: {
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
.table-list {
  max-width: 100%;
  &-scroll {
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
      width: 0;
      background: transparent;
    }
  }
  table {
    min-width: 100%;
    background-color: #fff;
    table-layout: fixed;
    tr {
      min-width: 100%;
      min-height: 0.3rem;
      flex-direction: row;
      align-items: center;
      font-size: 0.14rem;
      font-weight: 400;
      color: #222222;
      box-sizing: border-box;
      position: relative;

      .li-cell {
        text-align: left;
        font-size: 0.14rem;
        line-height: 0.2rem;
        font-weight: 400;
        color: #222222;
        background-color: #fff;
        align-items: center;
        position: relative;
        vertical-align: middle;
        &-content {
          padding: 0.04rem 0.08rem;
          max-width: 100%;
          overflow: hidden;
          // white-space: nowrap;
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
        &.ellipsis {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          white-space: nowrap;
        }

        &.box-right {
          text-align: right;
          padding-right: 0.1rem;
        }
      }
    }
  }
}
</style>
