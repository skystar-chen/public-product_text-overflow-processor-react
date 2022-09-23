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
  type?: 'shadow' | 'ellipsis'; // 文案处理类型
  isDefaultFold?: boolean; // 是否默认折叠，false为默认展开
  isRenderShowAllDOM?: boolean; // 是否渲染被隐藏的全部文案展示DOM
  unfoldButtonText?: string  | JSX.Element | JSX.Element[]; // 展开时按钮文案
  foldButtonText?: string  | JSX.Element | JSX.Element[]; // 折叠时按钮文案
  buttonBeforeSlot?: string | JSX.Element | JSX.Element[]; // 按钮前面的空格可以传''空去除
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
  text: string; // 文本内容，shadow时支持传DOM模板字符串（注：尽量传string文案）
  lineHeight?: number;
  ellipsisLineClamp?: number; // type类型为ellipsis时控制显示的行数
  className?: string;
  style?: React.CSSProperties;
  isShowAllContent?: boolean; // 当选择展示所有内容时将不提供操作按钮
  isMustButton?: boolean; // 是否常驻显示按钮
  isMustNoButton?: boolean; // 是否不要显示按钮
  shadowInitBoxShowH?: number; // shadow时显示的高度，超出这个高度才出现操作按钮
  onClick?: () => void;
  getIsFold?: (v: boolean) => void; // 获取文案是否超出范围被折叠
}
对应默认值：
TextOverflowProcessor.defaultProps = {
  type: 'shadow',
  isDefaultFold: true,
  isRenderShowAllDOM: false,
  unfoldButtonText: 'Show Less',
  foldButtonText: 'Show All',
  buttonBeforeSlot: undefined,
  buttonClassName: '',
  buttonStyle: {},
  text: '',
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
}
```

注：提供去渲染两套dom，通过属性isRenderShowAllDOM控制，class类名分别为text-overflow-processor-on /text-overflow-processor-off，text-overflow-processor-on为文案被正常处理展示效果的dom（默认显示），text-overflow-processor-off为文案未处理全部展示的dom（默认隐藏），如果需要，可以合理应用它们。