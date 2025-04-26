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
import TextOverflowProcessor from 'text-overflow-processor-react'
```

## 三、参数注解及默认值

```typescript
参数含义：
interface TextOverflowProcessorPropsType {
  /** >>>>>>公共配置 */
  text: string; // 文本内容，shadow时支持传DOM模板字符串（注：尽量传string文案）
  /**
   * 自定义组件刷新依赖的自身属性：依赖中的属性发生变化时，会触发组件刷新。建议不要使用all，伤性能
   * 其实通过key或其它方式也能实现同样的效果，这里只是为了方便而提供
   * 注意：
   * 属性中unfoldButtonText/foldButtonText/textEndSlot/buttonBeforeSlot作为组件监听依赖项时，
   * 传递的属性值为string字符串类型时将正常使用，当为Element复杂类型时将不作为监听依赖项，
   * 此时结构发生变化可以给组件加key告知变化实现刷新效果
   */
  reRenderDependentProperties?: ReRenderDependentPropertiesEnum[];
  type?: 'shadow' | 'ellipsis'; // 文案处理类型
  className?: string; // 组件类名
  style?: React.CSSProperties; // 组件样式
  buttonClassName?: string; // 按钮外出容器span的类名
  buttonStyle?: React.CSSProperties; // 按钮外出容器span的样式
  onClick?: (( // 按钮点击事件
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    isFold: boolean, // 文案是否是折叠的（文案是否溢出）
  ) => void) | null;
  isClickOriginalEvent?: boolean; // 当传了onClick时，点击事件是否触发原始事件
  getIsFold?: (( // 获取文案的折叠状态，折叠状态发生改变时会触发，相当于onChange
    isFold: boolean, // 文案是否是折叠的（文案是否溢出）
    isInitState: boolean, // 返回的是否是初始化状态，有时初始化状态可能会影响组件的使用，可以用这个区分
  ) => void) | null;
  isDefaultFold?: boolean; // 是否默认折叠
  unfoldButtonText?: string | JSX.Element | JSX.Element[] | null; // 展开时按钮文案
  foldButtonText?: string | JSX.Element | JSX.Element[] | null; // 折叠时按钮文案
  isShowAllContent?: boolean; // 是否展示所有内容，为true时将不提供操作按钮
  isMustButton?: boolean; // 是否常驻显示按钮
  isMustNoButton?: boolean; // 是否不要显示按钮
  lineHeight?: number; // 文案行高
  isRenderShowAllDOM?: boolean; // 是否渲染被隐藏的全部文案展示DOM
  
  /** >>>>>>仅ellipsis配置 */
  ellipsisLineClamp?: number; // 控制显示的行数
  /**
   * 是否使用JS逻辑计算文字开始折叠时显示的文案，可以传字号大小
   * 注意：
   * 1、启用此功能是为了兼容部分浏览器不支持display: -webkit-box;属性的使用（或出现异常）
   * 2、计算出来的文案可能不够完美，可以通过extraOccupiedW调整计算的误差
   * 3、这时只支持传string类型内容
   * 4、此时textEndSlot、buttonBeforeSlot所额外占用的宽度，都需要通过extraOccupiedW告知组件
   */
  isJsComputed?: boolean;
  fontSize?: number; // 字号大小，不传时，字号大小默认12，计算出来的结果会有误差
  fontClassName?: string; // 字体容器类名，仅用于JS计算
  /**
   * 字体容器相关样式（当字体样式比较丰富时，代替掉fontSize属性），仅用于JS计算
   * 注意：
   * 1、字号大小将覆盖fontSize属性
   * 2、仅JS_COMPUTED_VALID_CSS_PROPERTIES（下方将标出）中的CSS属性有效
   */
  fontStyle?: React.CSSProperties;
  /**
   * 紧跟文字内容尾部的额外内容，可以是icon等任意内容，例如超链接icon，点击跳转到外部网站
   * 文案溢出时显示在...后面，不溢出时在文字尾部
   * 注意：启用isJsComputed时，textEndSlot所占的宽需要通过extraOccupiedW告知才能精确计算
   */
  textEndSlot?: any;
  // 占用文本的额外宽度，启用isJsComputed时，此属性可以调整计算误差
  extraOccupiedW?: number;
  // 按钮前面的占位内容
  buttonBeforeSlot?: string | JSX.Element | JSX.Element[] | null;

  /** >>>>>>仅shadow配置 */
  shadowInitBoxShowH?: number; // 折叠时显示的文案高度，超出这个高度才出现操作按钮
  isShadowLayer?: boolean; // 是否需要阴影遮罩层
  shadowFoldButtonPlacement?: 'outer' | 'inner'; // 折叠态时按钮位置在文案外部还是内部
  shadowClassName?: string; // 阴影遮罩层自定义类名
  shadowStyle?: React.CSSProperties; // 阴影遮罩层自定义样式
}
type ReRenderDependentPropertiesEnum = 'all'
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
| 'buttonBeforeSlot'
| 'shadowInitBoxShowH'
| 'shadowFoldButtonPlacement'
| 'isShadowLayer'
| 'shadowClassName'
| 'shadowStyle';
对应默认值：
TextOverflowProcessor.defaultProps = {
  text: '',
  reRenderDependentProperties: ['text'],
  type: 'shadow',
  className: '',
  style: {},
  buttonClassName: '',
  buttonStyle: {},
  onClick: null,
  isClickOriginalEvent: false,
  getIsFold: null,
  isDefaultFold: true,
  unfoldButtonText: 'Show Less',
  foldButtonText: 'Show All',
  isShowAllContent: false,
  isMustButton: false,
  isMustNoButton: false,
  lineHeight: 24,
  isRenderShowAllDOM: false,
  /** >>>>>>仅ellipsis配置 */
  ellipsisLineClamp: 2,
  isJsComputed: false,
  fontSize: 12,
  fontClassName: '',
  fontStyle: {},
  textEndSlot: null,
  extraOccupiedW: 0,
  buttonBeforeSlot: null,
  /** >>>>>>仅shadow配置 */
  shadowInitBoxShowH: 76,
  shadowFoldButtonPlacement: 'outer',
  isShadowLayer: true,
  shadowClassName: '',
  shadowStyle: {},
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

2、本组件及本组件之内的元素标签尽量不要使用CSS属性white-space: nowrap，否则可能影响getIsFold获取的正确性。

3、提供去渲染两套dom，通过属性isRenderShowAllDOM控制，class类名分别为text-overflow-processor-on /text-overflow-processor-off，text-overflow-processor-on为文案被正常处理展示效果的dom（默认显示），text-overflow-processor-off为文案未处理全部展示的dom（默认隐藏），如果需要，可以合理应用它们。

## 四、更新日志（1.x.x低版本将不记录高版本更新日志）

### ↪1.1.22

`2025-04-26`

☆ CSS文件分离，浏览器兼容前缀添加；

☆ 组件属性注解优化，使用时注解提示更合理；

☆ 代码优化。

### ↪1.1.21

`2024-11-24`

☆ onClick事件返回参数增加isFold当前文案折叠状态。

### ↪1.1.20

`2024-08-25`

☆ TS代码优化。

### ↪1.1.19-optimize

`2024-01-08`

☆ readme文档使用说明修正更新。

### ↪1.1.19

`2024-01-07`

☆ 增加shadowFoldButtonPlacement属性，`shadow`时，控制折叠态时按钮位置在文案外部还是内部；

☆ 修复reRenderDependentProperties属性带来的死循环问题；

☆ 优化展开态屏幕缩放变成折叠态问题；

☆ 优化屏幕缩放时，显示效果；

☆ 优化复杂依赖属性的依赖项使用；

☆ `ellipsis`时，去除按钮前的`&nbsp;`空格占位。

### ↪1.1.18

`2023-11-25`

☆ 增加reRenderDependentProperties属性。

### ↪1.1.17

`2023-11-19`

☆ 代码优化。

### ↪1.1.16

`2023-08-01`

☆ package.json文件repository地址修改。

### ↪1.1.15

`2023-07-31`

☆ 修复`shadow`时，初始化折叠状态错误；

☆ getIsFold方法增加返回的状态是否是初始化状态标识；

☆ onClick方法增加事件对象返回，可用于阻止事件冒泡及默认行为等。

### ↪1.1.14-correction

`2023-07-23`

☆ 优化代码。

### ↪1.1.13

`2023-07-08`

☆ fontStyle属性有效CSS属性更新，去除部分暂不支持的属性，例如white-space；

☆ 其他优化。

### ↪1.1.12

`2023-05-27`

☆ isJsComputed开启时，支持textarea文本。

### ↪1.1.11

`2023-05-23`

☆ 修复`shadow`时，屏幕缩放文案展示状态错误。

### ↪1.1.10-optimize

`2023-05-10`

☆ package.json文件补充及代码优化。

### ↪1.1.10

`2023-05-08`

☆ `ellipsis`JS计算，增加fontClassName、fontStyle属性，弥补当文案样式比较丰富时，仅fontSize属性无法满足要求；

☆ 优化isJsComputed计算逻辑。

### ↪1.1.9

`2023-05-03`

☆ readme文档添加gif使用效果演示。

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
