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
  text: string; // 文本内容，shadow时支持传DOM模板字符串（注：尽量传string文案）
  type?: 'shadow' | 'ellipsis'; // 文案处理类型
  isDefaultFold?: boolean; // 是否默认折叠，false为默认展开
  isRenderShowAllDOM?: boolean; // 是否渲染被隐藏的全部文案展示DOM
  unfoldButtonText?: string  | JSX.Element | JSX.Element[]; // 展开时按钮文案
  foldButtonText?: string  | JSX.Element | JSX.Element[]; // 折叠时按钮文案
  buttonBeforeSlot?: string | JSX.Element | JSX.Element[]; // 按钮前面的空格可以传''空去除（注：仅ellipsis时有效）
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
  lineHeight?: number;
  ellipsisLineClamp?: number; // type类型为ellipsis时控制显示的行数
  className?: string;
  style?: React.CSSProperties;
  isShowAllContent?: boolean; // 当选择展示所有内容时将不提供操作按钮
  isMustButton?: boolean; // 是否常驻显示按钮（注：shadow时考虑到可以传DOM模板字符串，按钮将始终展示在文案的下方）
  isMustNoButton?: boolean; // 是否不要显示按钮
  shadowInitBoxShowH?: number; // shadow时显示的高度，超出这个高度才出现操作按钮
  onClick?: () => void;
  getIsFold?: (v: boolean) => void; // 获取文案是否超出范围被折叠
  /**
   * 是否使用Js逻辑计算文字开始折叠时显示的文案，可以传字号大小
   * 注意：
   * 1、启用此功能是为了兼容部分浏览器不支持display: -webkit-box;属性的使用（或出现异常）
   * 2、计算出来的文案可能不够完美，可以通过extraOccupiedW调整计算的误差
   * 3、这时只支持传string类型内容
   * 4、此时textEndSlot、buttonBeforeSlot，以及foldButtonText是非string类型（string类型除外）
   * 所额外占用的宽度，都需要通过extraOccupiedW告知组件
   * 5、仅ellipsis时有效
   */
  isJsComputed?: boolean;
  fontSize?: number; // 字号大小，不传时，字号大小默认12，计算出来的结果会有误差
  /**
   * 紧跟文字内容尾部的额外内容，可以是icon等任意内容，例如超链接icon，点击跳转到外部网站
   * 文案溢出时显示在...后面，不溢出时在文字尾部
   * 注意：
   * 1、启用isJsComputed时，textEndSlot所占的宽需要通过extraOccupiedW告知才能精确计算
   * 2、仅ellipsis时有效
   */
  textEndSlot?: any;
  // 占用文本的额外宽度，启用isJsComputed时，此属性可以调整计算误差（注：仅ellipsis时有效）
  extraOccupiedW?: number;
}
对应默认值：
TextOverflowProcessor.defaultProps = {
  text: '',
  type: 'shadow',
  isDefaultFold: true,
  isRenderShowAllDOM: false,
  unfoldButtonText: 'Show Less',
  foldButtonText: 'Show All',
  buttonBeforeSlot: null,
  buttonClassName: '',
  buttonStyle: {},
  lineHeight: 24,
  ellipsisLineClamp: 2,
  className: '',
  style: {},
  isShowAllContent: false,
  isMustButton: false,
  isMustNoButton: false,
  shadowInitBoxShowH: 76,
  onClick: null,
  getIsFold: null,
  isJsComputed: false,
  fontSize: 12,
  textEndSlot: null,
  extraOccupiedW: 0,
}
```

注：

1、type为`ellipsis`时，默认`...`省略号的展示是通过CSS属性display: -webkit-box实现的，顾不是谷歌内核的浏览器使用时无法达到预期折叠省略的效果（甚至可能出现文案展示为空白的情况，例如：低版本的safari浏览器），为此在`1.1.0`版增加isJsComputed属性，文案内容在折叠时通过js计算得出。

2、提供去渲染两套dom，通过属性isRenderShowAllDOM控制，class类名分别为text-overflow-processor-on /text-overflow-processor-off，text-overflow-processor-on为文案被正常处理展示效果的dom（默认显示），text-overflow-processor-off为文案未处理全部展示的dom（默认隐藏），如果需要，可以合理应用它们。

## 四、更新日志

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
