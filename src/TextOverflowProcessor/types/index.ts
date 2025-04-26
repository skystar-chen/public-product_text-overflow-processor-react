type ProcessType = 'shadow' | 'ellipsis';
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
| 'shadowStyle';

interface TextOverflowProcessorPropsType {
  /** >>>>>>公共配置 */
  /**
   * 文本内容，shadow时支持传DOM模板字符串（注：尽量传string文案）
   * 
   * 默认值：空
   */
  text: string;
  /**
   * 自定义组件刷新依赖的自身属性：依赖中的属性发生变化时，会触发组件刷新。建议不要使用all，伤性能
   * 
   * 其实通过key或其它方式也能实现同样的效果，这里只是为了方便而提供，使用到的频率相对较小
   * 
   * 默认值：['text']
   * 
   * 注意：
   * 
   * 属性中unfoldButtonText/foldButtonText/textEndSlot/buttonBeforeSlot作为组件监听依赖项时，
   * 
   * 传递的属性值为string字符串类型时将正常使用，当为Element复杂类型时将不作为监听依赖项，
   * 
   * 此时结构发生变化可以给组件加key告知变化实现刷新效果
   */
  reRenderDependentProperties?: ReRenderDependentPropertiesEnum[];
  /**
   * 文案处理类型
   * 
   * 默认值：shadow
   */
  type?: ProcessType;
  /**
   * 组件类名
   * 
   * 默认值：空
   */
  className?: string;
  /**
   * 组件样式
   * 
   * 默认值：{}
   */
  style?: React.CSSProperties;
  /**
   * 按钮外出容器span的类名
   * 
   * 默认值：空
   */
  buttonClassName?: string;
  /**
   * 按钮外出容器span的样式
   * 
   * 默认值：{}
   */
  buttonStyle?: React.CSSProperties;
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
  ) => void) | null;
  /**
   * 当传了onClick时，点击事件是否触发原始事件
   * 
   * 默认值：false
   */
  isClickOriginalEvent?: boolean;
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
  ) => void) | null;
  /**
   * 是否默认折叠
   * 
   * 默认值：true
   */
  isDefaultFold?: boolean;
  /**
   * 展开时按钮文案
   * 
   * 默认值：Show Less
   */
  unfoldButtonText?: DOMElementType;
  /**
   * 折叠时按钮文案
   * 
   * 默认值：Show All
   */
  foldButtonText?: DOMElementType;
  /**
   * 是否展示所有内容，为true时将不提供操作按钮
   * 
   * 默认值：false
   */
  isShowAllContent?: boolean;
  /**
   * 是否常驻显示按钮
   * 
   * 默认值：false
   */
  isMustButton?: boolean;
  /**
   * 是否不要显示按钮
   * 
   * 默认值：false
   */
  isMustNoButton?: boolean;
  /**
   * 文案行高
   * 
   * 默认值：24
   */
  lineHeight?: number;
  /**
   * 是否渲染被隐藏的全部文案展示DOM
   * 
   * 默认值：false
   */
  isRenderShowAllDOM?: boolean;
  
  /** >>>>>>仅ellipsis配置 */
  /**
   * 控制显示的行数
   * 
   * 默认值：2
   */
  ellipsisLineClamp?: number;
  /**
   * 是否使用JS逻辑计算文字开始折叠时显示的文案，可以传字号大小
   * 
   * 默认值：false
   * 
   * 注意：
   * 
   * 1、启用此功能是为了兼容部分浏览器不支持display: -webkit-box;属性的使用（或出现异常）
   * 
   * 2、计算出来的文案可能不够完美，可以通过extraOccupiedW调整计算的误差
   * 
   * 3、这时只支持传string类型内容
   * 
   * 4、此时textEndSlot、buttonBeforeSlot所额外占用的宽度，都需要通过extraOccupiedW告知组件
   */
  isJsComputed?: boolean;
  /**
   * 字号大小，不传时，字号大小默认12，计算出来的结果会有误差
   * 
   * 默认值：12
   */
  fontSize?: number;
  /**
   * 字体容器类名，仅用于JS计算
   * 
   * 默认值：空
   */
  fontClassName?: string;
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
  fontStyle?: React.CSSProperties;
  /**
   * 紧跟文字内容尾部的额外内容，可以是icon等任意内容，例如超链接icon，点击跳转到外部网站
   * 
   * 文案溢出时显示在...后面，不溢出时在文字尾部
   * 
   * 默认值：null
   * 
   * 注意：启用isJsComputed时，textEndSlot所占的宽需要通过extraOccupiedW告知才能精确计算
   */
  textEndSlot?: any;
  /**
   * 占用文本的额外宽度，启用isJsComputed时，此属性可以调整计算误差
   * 
   * 默认值：0
   */
  extraOccupiedW?: number;
  /**
   * 按钮前面的占位内容，isJsComputed为false时默认会有4个空格（使用频率低）
   * 
   * 默认值：null
   */
  buttonBeforeSlot?: DOMElementType;

  /** >>>>>>仅shadow配置 */
  /**
   * 折叠时显示的文案高度，超出这个高度才出现操作按钮
   * 
   * 默认值：76
   */
  shadowInitBoxShowH?: number;
  /**
   * 折叠态时按钮位置在文案外部还是内部
   * 
   * 默认值：outer
   */
  shadowFoldButtonPlacement?: 'outer' | 'inner';
  /**
   * 是否需要阴影遮罩层
   * 
   * 默认值：true
   */
  isShadowLayer?: boolean;
  /**
   * 阴影遮罩层自定义类名
   * 
   * 默认值：空
   */
  shadowClassName?: string;
  /**
   * 阴影遮罩层自定义样式
   * 
   * 默认值：{}
   */
  shadowStyle?: React.CSSProperties;
}

export {
  ProcessType,
  DOMElementType,
  ProcessTypeArr,
  TextOverflowProcessorPropsType,
  ReRenderDependentPropertiesEnum,
}
