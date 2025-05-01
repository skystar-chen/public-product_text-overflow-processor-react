# 文本溢出处理

当文案在给定容器显示不下，要对文案进行折叠/展开切换处理，获取文案是否被折叠的状态（例如：被折叠时气泡展示全部）进行多功能定制时，可以尝试使用本组件TextOverflowProcessor，它也许能帮到你！目前提供`ellipsis`和`shadow`两种处理方式。

效果展示：
![demonstration](https://github.com/skystar-chen/public-product_text-overflow-processor-react/blob/main/assets/images/demonstration.gif)

> 作者：陈星~

## 一、安装

```shell
npm i text-overflow-processor-react -S
```

或

```shell
yarn add text-overflow-processor-react
```

## 二、使用

```react
import TextOverflowProcessor from 'text-overflow-processor-react';
```

## 三、参数注解及默认值

```typescript
参数含义：
interface TextOverflowProcessorPropsType {
  /** >>>>>>公共配置 */
  text: string, // 文本内容，shadow时支持传DOM模板字符串（注：尽量传string文案）
  className?: string, // 组件类名
  style?: React.CSSProperties, // 组件样式
  onClick?: (( // 按钮点击事件
    e: React.MouseEvent<HTMLElement, MouseEvent>, // 事件对象
    isFold: boolean, // 文案是否是折叠的（文案是否溢出）
  ) => void) | null,
  onFoldChange?: (( // 获取文案的折叠状态，折叠状态发生改变时会触发
    isFold: boolean, // 文案是否是折叠的（文案是否溢出）
    isInitState: boolean, // 返回的是否是初始化状态，有时初始化状态可能会影响组件的使用，可以用这个区分
  ) => void) | null,
  option?: {
    /**
     * 自定义组件刷新依赖的自身属性：依赖中的属性发生变化时，会触发组件刷新。建议不要使用all，伤性能
     * 其实通过key或其它方式也能实现同样的效果，这里只是为了方便而提供
     * 注意：由于3.x.x版本大部分配置在option属性中，属于引用状态类型，故配置变化一般都能够触发组件刷新，
     *       因此本属性在3.x.x版本几乎用不上...
     */
    reRenderDependencies?: ReRenderDependenciesEnum[],
    type?: 'ellipsis' | 'shadow', // 文案处理类型
    /** >>>>>>ellipsis配置 */
    ellipsisOption?: {
      ellipsisLineClamp?: number, // 控制显示的行数
      /**
       * 是否使用JS逻辑计算文字在折叠态时显示的文案，可以传字号大小
       * 注意（启用此功能时）：
       * 1、折叠态按钮宽度可以通过extraOccupiedW告知或者renderToString动态计算，
       *    推荐extraOccupiedW告知，这样可以节约renderToString转义带来的性能消耗
       * 2、此功能是为了兼容部分浏览器不支持display: -webkit-box属性的使用（或出现异常）
       * 3、计算出来的文案可能不够完美，可以通过extraOccupiedW调整计算的误差
       * 4、此时只支持传string类型内容
       * 5、此时textEndSlot所额外占用的宽度，需要通过extraOccupiedW告知组件
       */
      isJsComputed?: boolean,
      /**
       * ReactDOM转换成原始DOM字符串的方法，用于JS计算时获取折叠态操作按钮的宽度
       * 若折叠态操作按钮的宽度已经包含在extraOccupiedW中，此属性不要传
       * import { renderToString } from 'react-dom/server';
       */
      renderToString?: ((
        element: React.ReactNode,
        options?: { identifierPrefix?: string },
      ) => string) | null,
      fontSize?: number, // 字号大小，不传时，字号大小默认12，计算出来的结果会有误差
      fontClassName?: string, // 字体容器类名，仅用于JS计算
      /**
       * 字体容器相关样式（当字体样式比较丰富时，代替掉fontSize属性），仅用于JS计算
       * 注意：
       * 1、字号大小将覆盖fontSize属性
       * 2、仅JS_COMPUTED_VALID_CSS_PROPERTIES（下方将标出）中的CSS属性有效
       */
      fontStyle?: React.CSSProperties,
      /**
       * 紧跟文字内容尾部的额外内容，可以是icon等任意内容，例如超链接icon，点击跳转到外部网站
       * 文案溢出时显示在...后面，不溢出时在文字尾部
       * 注意：启用isJsComputed时，textEndSlot所占的宽需要通过extraOccupiedW告知才能精确计算
       */
      textEndSlot?: string | JSX.Element | JSX.Element[] | null,
      // 占用文本的额外宽度，启用isJsComputed时，此属性可以调整计算误差
      extraOccupiedW?: number,
    },
    /** >>>>>>shadow配置 */
    shadowOption?: {
      shadowFoldShowH?: number, // 折叠态时显示的文案高度，超出这个高度才出现操作按钮
      shadowFoldButtonPlacement?: 'outer' | 'inner', // 折叠态时按钮位置在文案外部还是内部
      isShadowLayer?: boolean, // 是否需要阴影遮罩层
      shadowClassName?: string, // 阴影遮罩层自定义类名
      shadowStyle?: React.CSSProperties, // 阴影遮罩层自定义样式
    },
    buttonClassName?: string, // 按钮外层容器span的类名
    buttonStyle?: React.CSSProperties, // 按钮外层容器span的样式
    isClickOriginalEvent?: boolean, // 当传了onClick时，点击事件是否触发原始事件
    isDefaultFold?: boolean, // 是否默认折叠
    unfoldButtonText?: string | JSX.Element | JSX.Element[] | null, // 展开时按钮文案
    foldButtonText?: string | JSX.Element | JSX.Element[] | null, // 折叠时按钮文案
    isShowAllContent?: boolean, // 是否展示所有内容，为true时将不提供操作按钮
    isMustButton?: boolean, // 是否常驻显示按钮
    isMustNoButton?: boolean, // 是否不要显示按钮
    lineHeight?: number, // 文案行高
    isRenderShowAllDOM?: boolean, // 是否渲染被隐藏的全部文案展示DOM
  },
}
type ReRenderDependenciesEnum = 'all'
| 'text'
| 'type'
| 'className'
| 'style'
| 'buttonClassName'
| 'buttonStyle'
| 'isClickOriginalEvent'
| 'isDefaultFold'
| 'unfoldButtonText'
| 'foldButtonText'
| 'isShowAllContent'
| 'isMustButton'
| 'isMustNoButton'
| 'lineHeight'
| 'isRenderShowAllDOM'
| 'ellipsisLineClamp'
| 'isJsComputed'
| 'fontSize'
| 'fontClassName'
| 'fontStyle'
| 'textEndSlot'
| 'extraOccupiedW'
| 'shadowFoldShowH'
| 'shadowFoldButtonPlacement'
| 'isShadowLayer'
| 'shadowClassName'
| 'shadowStyle';
对应默认值：
TextOverflowProcessor.defaultProps = {
  text: '',
  className: '',
  style: {},
  onClick: null,
  onFoldChange: null,
  option: {
    reRenderDependencies: ['text'],
    type: 'ellipsis',
    /** >>>>>>ellipsis配置 */
    ellipsisOption: {
      ellipsisLineClamp: 2,
      isJsComputed: false,
      fontSize: 12,
      fontClassName: '',
      fontStyle: {},
      textEndSlot: null,
      extraOccupiedW: 0,
    },
    /** >>>>>>shadow配置 */
    shadowOption: {
      shadowFoldShowH: 76,
      shadowFoldButtonPlacement: 'outer',
      isShadowLayer: true,
      shadowClassName: '',
      shadowStyle: {},
    },
    buttonClassName: '',
    buttonStyle: {},
    isClickOriginalEvent: false,
    isDefaultFold: true,
    unfoldButtonText: 'Show Less',
    foldButtonText: 'Show All',
    isShowAllContent: false,
    isMustButton: false,
    isMustNoButton: false,
    lineHeight: 24,
    isRenderShowAllDOM: false,
  },
}
fontStyle属性中有效的CSS属性：
JS_COMPUTED_VALID_CSS_PROPERTIES = [
  'font-size',
  'font-weight',
  'font-style',
  'font-family',
  'font-feature-settings',
  'font-kerning',
  'font-language-override',
  'font-optical-sizing',
  'font-stretch',
  'font-size-adjust',
  'font-synthesis',
  'font-variant',
  'font-variant-alternates',
  'font-variant-caps',
  'font-variant-east-asian',
  'font-variant-emoji',
  'font-variant-ligatures',
  'font-variant-numeric',
  'font-variant-position',
  'font-variation-settings',
  'initial-letter',
  'inline-size',
  'line-height',
  'line-height-step',
  'letter-spacing',
  'text-transform',
  'text-indent',
  'text-combine-upright',
  'text-emphasis',
  'text-emphasis-position',
  'text-emphasis-style',
  'text-orientation',
  'text-rendering',
  'text-size-adjust',
  'word-spacing',
]
```

注：

1、type为`ellipsis`时，默认`...`省略号的展示是通过CSS属性display: -webkit-box实现的，顾不是谷歌内核的浏览器使用时无法达到预期折叠省略的效果（甚至可能出现文案展示为空白的情况，例如：低版本的safari浏览器），为此在`1.1.0`版增加isJsComputed属性，文案内容在折叠时通过js计算得出。

2、本组件及本组件之内的元素标签尽量不要使用CSS属性white-space: nowrap，否则可能影响onFoldChange获取的正确性。

3、提供去渲染两套dom，通过属性isRenderShowAllDOM控制，class类名分别为text-overflow-processor-on /text-overflow-processor-off，text-overflow-processor-on为文案被正常处理展示效果的dom（默认显示），text-overflow-processor-off为文案未处理全部展示的dom（默认隐藏），如果需要，可以合理应用它们。

## 四、更新日志

### ↪3.0.0

`2025-xx-xx`

注：3.x.x版本不兼容其它低版本（配置项），升级需谨慎！！！不同版本之间将分开维护。

☆ 属性配置项变化；
