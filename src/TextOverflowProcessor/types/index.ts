type ProcessType = 'shadow' | 'ellipsis';
type ProcessTypeArr = ['shadow', 'ellipsis'];

interface TextProcessProps {
  /** >>>>>>公共配置 */
  text: string; // 文本内容，shadow时支持传DOM模板字符串（注：尽量传string文案）
  type?: ProcessType; // 文案处理类型
  className?: string;
  style?: React.CSSProperties;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
  onClick?: (() => void) | null;
  isClickOriginalEvent?: boolean; // 当传了onClick时，点击事件是否触发原始事件
  getIsFold?: ((v: boolean) => void) | null; // 获取文案的折叠状态
  isDefaultFold?: boolean; // 是否默认折叠
  unfoldButtonText?: string  | JSX.Element | JSX.Element[]; // 展开时按钮文案
  foldButtonText?: string  | JSX.Element | JSX.Element[]; // 折叠时按钮文案
  isShowAllContent?: boolean; // 当选择展示所有内容时将不提供操作按钮
  isMustButton?: boolean; // 是否常驻显示按钮
  isMustNoButton?: boolean; // 是否不要显示按钮
  lineHeight?: number;
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
   * 2、仅JS_COMPUTED_VALID_CSS_PROPERTIES中的CSS属性有效
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
  // 按钮前面的占位内容，isJsComputed为false时默认会有4个空格（使用频率低）
  buttonBeforeSlot?: string | JSX.Element | JSX.Element[] | null;

  /** >>>>>>仅shadow配置 */
  shadowInitBoxShowH?: number; // 折叠时显示的文案高度，超出这个高度才出现操作按钮
  isShadowLayer?: boolean; // 是否需要阴影遮罩层
  shadowClassName?: string; // 阴影遮罩层自定义类名
  shadowStyle?: React.CSSProperties; // 阴影遮罩层自定义样式
}

export {
  ProcessType,
  ProcessTypeArr,
  TextProcessProps,
}
