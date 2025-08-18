type ProcessType = 'ellipsis' | 'shadow';
type DOMElementType = string | JSX.Element | JSX.Element[] | null;
type ProcessTypeArr = ProcessType[];
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
| 'shadowStyle'
| 'isListenVisible';
type EllipsisOptionType = {
  /**
   * 控制显示的行数
   * 
   * 默认值：2
   */
  ellipsisLineClamp?: number,
  /**
   * 是否使用JS逻辑计算文字在折叠态时显示的文案，可以传字号大小
   * 
   * 默认值：false
   * 
   * 注意（启用此功能时）：
   * 
   * 1、此功能是为了兼容部分浏览器不支持display: -webkit-box属性的使用（或出现异常）
   * 
   * 2、计算出来的文案可能不够完美，可以通过extraOccupiedW调整计算的误差
   * 
   * 3、此时只支持传string类型内容
   * 
   * 4、此时textEndSlot、buttonBeforeSlot所额外占用的宽度，都需要通过extraOccupiedW告知组件
   */
  isJsComputed?: boolean,
  /**
   * 字号大小，不传时，字号大小默认12，计算出来的结果会有误差
   * 
   * 默认值：12
   */
  fontSize?: number,
  /**
   * 字体容器类名，仅用于JS计算
   * 
   * 默认值：空
   */
  fontClassName?: string,
  /**
   * 字体容器相关样式（当字体样式比较丰富时，代替掉fontSize属性），仅用于JS计算
   * 
   * 默认值：{}
   * 
   * 注意：
   * 
   * 1、字号大小将覆盖fontSize属性
   * 
   * 2、仅JS_COMPUTED_VALID_CSS_PROPERTIES中的CSS属性有效
   */
  fontStyle?: React.CSSProperties,
  /**
   * 紧跟文字内容尾部的额外内容，可以是icon等任意内容，例如超链接icon，点击跳转到外部网站
   * 
   * 文案溢出时显示在...后面，不溢出时在文字尾部
   * 
   * 默认值：null
   * 
   * 注意：启用isJsComputed时，textEndSlot所占的宽需要通过extraOccupiedW告知才能精确计算
   */
  textEndSlot?: DOMElementType,
  /**
   * 占用文本的额外宽度，启用isJsComputed时，此属性可以调整计算误差
   * 
   * 默认值：0
   */
  extraOccupiedW?: number,
  /**
   * 按钮前面的占位内容（使用频率低）
   * 
   * 默认值：null
   */
  buttonBeforeSlot?: DOMElementType,
};
type ShadowOptionType = {
  /**
   * 折叠态时显示的文案高度，超出这个高度才出现操作按钮
   * 
   * 默认值：76
   */
  shadowInitBoxShowH?: number,
  /**
   * 折叠态时按钮位置在文案外部还是内部
   * 
   * 默认值：outer
   */
  shadowFoldButtonPlacement?: 'outer' | 'inner',
  /**
   * 是否需要阴影遮罩层
   * 
   * 默认值：true
   */
  isShadowLayer?: boolean,
  /**
   * 阴影遮罩层自定义类名
   * 
   * 默认值：空
   */
  shadowClassName?: string,
  /**
   * 阴影遮罩层自定义样式
   * 
   * 默认值：{}
   */
  shadowStyle?: React.CSSProperties,
};
type OptionType = {
  /**
   * 自定义组件刷新依赖的自身属性：依赖中的属性发生变化时，会触发组件刷新。建议不要使用all，伤性能
   * 
   * 其实通过key或其它方式也能实现同样的效果，这里只是为了方便而提供，使用到的频率极小
   * 
   * 默认值：['text']
   * 
   * 注意：由于2.x.x版本大部分配置在option属性中，属于引用状态类型，故配置变化一般都能够触发组件刷新，
   * 
   *       因此本属性在2.x.x版本几乎用不上...
   */
  reRenderDependentProperties?: ReRenderDependentPropertiesEnum[],
  /**
   * 文案处理类型
   * 
   * 默认值：ellipsis
   */
  type?: ProcessType,
  /** >>>>>>ellipsis配置 */
  ellipsisOption?: EllipsisOptionType,
  /** >>>>>>shadow配置 */
  shadowOption?: ShadowOptionType,
  /**
   * 按钮外层容器span的类名
   * 
   * 默认值：空
   */
  buttonClassName?: string,
  /**
   * 按钮外层容器span的样式
   * 
   * 默认值：{}
   */
  buttonStyle?: React.CSSProperties,
  /**
   * 当传了onClick时，点击事件是否触发原始事件
   * 
   * 默认值：false
   */
  isClickOriginalEvent?: boolean,
  /**
   * 是否默认折叠
   * 
   * 默认值：true
   */
  isDefaultFold?: boolean,
  /**
   * 展开时按钮文案
   * 
   * 默认值：Show Less
   */
  unfoldButtonText?: DOMElementType,
  /**
   * 折叠时按钮文案
   * 
   * 默认值：Show All
   */
  foldButtonText?: DOMElementType,
  /**
   * 是否展示所有内容，为true时将不提供操作按钮
   * 
   * 默认值：false
   */
  isShowAllContent?: boolean,
  /**
   * 是否常驻显示按钮
   * 
   * 默认值：false
   */
  isMustButton?: boolean,
  /**
   * 是否不要显示按钮
   * 
   * 默认值：false
   */
  isMustNoButton?: boolean,
  /**
   * 文案行高，默认24，期望传递，否则isFold计算的结果会有误差
   * 
   * 默认值：24
   */
  lineHeight?: number,
  /**
   * 是否渲染被隐藏的全部文案展示DOM
   * 
   * 默认值：false
   */
  isRenderShowAllDOM?: boolean,
  /**
   * 是否监听组件自身的显示状态变化
   * 
   * 解决在弹窗、tooltip等场景下视口大小变化使用无效的问题
   * 
   * 默认值：false
   */
  isListenVisible?: boolean,
};
interface TextOverflowProcessorPropsType {
  /**
   * 文本内容，shadow时支持传DOM模板字符串（注：尽量传string文案）
   * 
   * 默认值：空
   */
  text: string,
  /**
   * 组件类名
   * 
   * 默认值：空
   */
  className?: string,
  /**
   * 组件样式
   * 
   * 默认值：{}
   */
  style?: React.CSSProperties,
  /**
   * 按钮点击事件
   * 
   * 参数注解：
   * 
   * e -> 事件对象
   * 
   * isFold -> 文案是否是折叠的（文案是否溢出）
   */
  onClick?: ((
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    /** 文案是否是折叠的（文案是否溢出） */
    isFold: boolean,
  ) => void) | null,
  /**
   * 获取文案的折叠状态，折叠状态发生改变时会触发，相当于onChange
   * 
   * 参数注解：
   * 
   * isFold -> 文案是否是折叠的（文案是否溢出）
   * 
   * isInitState -> 返回的是否是初始化状态，有时初始化状态可能会影响组件的使用，可以用这个区分
   */
  getIsFold?: ((
    /** 文案是否是折叠的（文案是否溢出） */
    isFold: boolean,
    /** 返回的是否是初始化状态，有时初始化状态可能会影响组件的使用，可以用这个区分 */
    isInitState: boolean,
  ) => void) | null,
  /** >>>>>>具体配置 */
  option?: OptionType,
};

export {
  ProcessType,
  DOMElementType,
  ProcessTypeArr,
  EllipsisOptionType,
  ShadowOptionType,
  OptionType,
  TextOverflowProcessorPropsType,
  ReRenderDependentPropertiesEnum,
}