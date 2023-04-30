# 文本溢出处理

当文案在给定容器显示不下，要对文案进行折叠/展开切换处理，获取文案是否被折叠的状态进行多功能定制时，可以尝试使用本组件TextOverflowProcessor，它也许能帮到你！目前提供`ellipsis`和`shadow`两种处理方式。

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
import TextOverFlowProcessor from 'text-overflow-processor-react'
```

## 三、参数注解及默认值

```typescript
参数含义：
interface TextProcessProps {
  /** >>>>>>公共配置 */
  text: string, // 文本内容，shadow时支持传DOM模板字符串（注：尽量传string文案）
  className?: string,
  style?: React.CSSProperties,
  onClick?: (() => void) | null,
  getIsFold?: ((v: boolean) => void) | null, // 获取文案的折叠状态
  option?: {
    type?: 'ellipsis' | 'shadow', // 文案处理类型
    /** >>>>>>ellipsis配置 */
    ellipsisOption?: {
      ellipsisLineClamp?: number, // 控制显示的行数
      /**
       * 是否使用Js逻辑计算文字开始折叠时显示的文案，可以传字号大小
       * 注意：
       * 1、启用此功能是为了兼容部分浏览器不支持display: -webkit-box,属性的使用（或出现异常）
       * 2、计算出来的文案可能不够完美，可以通过extraOccupiedW调整计算的误差
       * 3、这时只支持传string类型内容
       * 4、此时textEndSlot、buttonBeforeSlot，以及foldButtonText是非string类型（string类型除外）
       * 所额外占用的宽度，都需要通过extraOccupiedW告知组件
       */
      isJsComputed?: boolean,
      fontSize?: number, // 字号大小，不传时，字号大小默认12，计算出来的结果会有误差
      /**
       * 紧跟文字内容尾部的额外内容，可以是icon等任意内容，例如超链接icon，点击跳转到外部网站
       * 文案溢出时显示在...后面，不溢出时在文字尾部
       * 注意：启用isJsComputed时，textEndSlot所占的宽需要通过extraOccupiedW告知才能精确计算
       */
      textEndSlot?: any,
      // 占用文本的额外宽度，启用isJsComputed时，此属性可以调整计算误差
      extraOccupiedW?: number,
      // 按钮前面的占位内容，isJsComputed为false时默认会有一些空格，isJsComputed为true时此属性无效
      buttonBeforeSlot?: string | JSX.Element | JSX.Element[] | null,
    },
    /** >>>>>>shadow配置 */
    shadowOption?: {
      shadowInitBoxShowH?: number, // 折叠时显示的文案高度，超出这个高度才出现操作按钮
      isShadowLayer?: boolean, // 是否需要阴影遮罩层
      shadowClassName?: string, // 阴影遮罩层自定义类名
      shadowStyle?: React.CSSProperties, // 阴影遮罩层自定义样式
    },
    buttonClassName?: string,
    buttonStyle?: React.CSSProperties,
    isClickOriginalEvent?: boolean, // 当传了onClick时，点击事件是否触发原始事件
    isDefaultFold?: boolean, // 是否默认折叠
    unfoldButtonText?: string  | JSX.Element | JSX.Element[], // 展开时按钮文案
    foldButtonText?: string  | JSX.Element | JSX.Element[], // 折叠时按钮文案
    isShowAllContent?: boolean, // 当选择展示所有内容时将不提供操作按钮
    isMustButton?: boolean, // 是否常驻显示按钮
    isMustNoButton?: boolean, // 是否不要显示按钮
    lineHeight?: number,
    isRenderShowAllDOM?: boolean, // 是否渲染被隐藏的全部文案展示DOM
  },
}
对应默认值：
TextOverflowProcessor.defaultProps = {
  text: '',
  className: '',
  style: {},
  onClick: null,
  getIsFold: null,
  option: {
    type: 'ellipsis',
    /** >>>>>>ellipsis配置 */
    ellipsisOption: {
      ellipsisLineClamp: 2,
      isJsComputed: false,
      fontSize: 12,
      textEndSlot: null,
      extraOccupiedW: 0,
      buttonBeforeSlot: null,
    },
    /** >>>>>>shadow配置 */
    shadowOption: {
      shadowInitBoxShowH: 76,
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
```

注：

1、type为`ellipsis`时，默认`...`省略号的展示是通过CSS属性display: -webkit-box实现的，顾不是谷歌内核的浏览器使用时无法达到预期折叠省略的效果（甚至可能出现文案展示为空白的情况，例如：低版本的safari浏览器），为此在`1.1.0`版增加isJsComputed属性，文案内容在折叠时通过js计算得出。

2、本组件及本组件之内的元素标签尽量不要使用CSS属性white-space: nowrap，否则可能影响getIsFold获取的正确性。

3、提供去渲染两套dom，通过属性isRenderShowAllDOM控制，class类名分别为text-overflow-processor-on /text-overflow-processor-off，text-overflow-processor-on为文案被正常处理展示效果的dom（默认显示），text-overflow-processor-off为文案未处理全部展示的dom（默认隐藏），如果需要，可以合理应用它们。

## 四、更新日志

### ↪2.0.1

`2023-04-30`

☆ 属性配置项规则变化。

### ↪2.0.0

`2023-04-29`

注：2.x.x版本不兼容1.x.x版本（配置项），且type属性默认值变更，升级需谨慎！！！至此，1.x.x版本和2.x.x版本将分开维护。

☆ 属性配置项规则变化；

☆ type属性默认值修改为`ellipsis`。

### ↪1.1.8

`2023-04-24`

☆ 组件样式white-space: pre-wrap修改为white-space: break-spaces，`ellipsis`时文案全是空格时兼容换行；

☆ 增加isShadowLayer属性。

### ↪1.1.7

`2023-03-11`

☆ 组件样式增加white-space: pre-wrap，以免被组件外部样式white-space: nowrap影响，导致getIsFold获取的结果不正确。

### ↪1.1.6

`2023-03-04`

☆ 增加isClickOriginalEvent属性。

### ↪1.1.5-remedying

`2023-02-20`

☆ 修复1.1.5修改带来的bug：视口变小，不折叠的文案应该变成折叠无效。

### ↪1.1.5

`2023-02-15`

☆ 修复isShowAllContent为true时，视口大小改变导致文案被折叠或出现按钮。

### ↪1.1.4-remedying

`2023-02-01`

☆ 修复下载下来的包自动下载了相关额外无用依赖；

☆ 增加修改shadow阴影样式属性shadowClassName和shadowStyle。

### ↪1.1.4

`2023-01-31`

☆ 修复在ellipsis下，屏幕缩放时，原本文案是折叠的，屏幕放大再缩小时文案不折叠；

☆ 修改仅当ellipsis时，且没有开启isJsComputed、文案是折叠的、显示操作按钮时，文案对齐方式才是`justify`，其他情况使用默认对齐方式；

☆ 组件属性描述位置优化。

### ↪1.1.3

`2022-11-28`

☆ 修复isJsComputed开启时，“按钮文案尽量传DOM结构”的错误描述。

### ↪1.1.2

`2022-11-26`

☆ 增加textEndSlot和extraOccupiedW属性，extraOccupiedW解决isJsComputed计算不精确问题；

☆ 修复isShowAllContent属性传`true`时，isMustButton传`true`按钮没有显示。

### ↪1.1.0

`2022-11-19`

☆ 增加isJsComputed和fontSize属性，以适配不支持display: -webkit-box的浏览器去`...`折叠展示文案。
