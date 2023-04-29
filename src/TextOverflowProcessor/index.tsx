import { useRef, useState, useEffect, memo, useCallback, useMemo } from 'react';
import { getFixedWidthText, getClassNames } from './utils';
import './index.scss';

/**TS类型声明 start */
// #region
type ProcessType = 'ellipsis' | 'shadow';
type ProcessTypeArr = ['ellipsis', 'shadow'];
type OptionType = {
  type?: ProcessType, // 文案处理类型
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
};
type EllipsisOptionType = {
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
};
type ShadowOptionType = {
  shadowInitBoxShowH?: number, // 折叠时显示的文案高度，超出这个高度才出现操作按钮
  isShadowLayer?: boolean, // 是否需要阴影遮罩层
  shadowClassName?: string, // 阴影遮罩层自定义类名
  shadowStyle?: React.CSSProperties, // 阴影遮罩层自定义样式
};
interface TextProcessProps {
  /** >>>>>>公共配置 */
  text: string, // 文本内容，shadow时支持传DOM模板字符串（注：尽量传string文案）
  className?: string,
  style?: React.CSSProperties,
  onClick?: (() => void) | null,
  getIsFold?: ((v: boolean) => void) | null, // 获取文案的折叠状态
  option?: OptionType,
  /** >>>>>>仅ellipsis配置 */
  ellipsisOption?: EllipsisOptionType,
  /** >>>>>>仅shadow配置 */
  shadowOption?: ShadowOptionType,
};
// #endregion
/**TS类型声明 end */

/**常量声明 start */
// #region
const TYPE: ProcessTypeArr = ['ellipsis', 'shadow'];
const DEFAULT_OPTION: OptionType = {
  type: 'ellipsis',
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
};
const DEFAULT_ELLIPSIS_OPTION: EllipsisOptionType = {
  ellipsisLineClamp: 2,
  isJsComputed: false,
  fontSize: 12,
  textEndSlot: null,
  extraOccupiedW: 0,
  buttonBeforeSlot: null,
};
const DEFAULT_SHADOW_OPTION: ShadowOptionType = {
  shadowInitBoxShowH: 76,
  isShadowLayer: true,
  shadowClassName: '',
  shadowStyle: {},
};
const DEFAULT_PROPS: TextProcessProps = {
  text: '',
  className: '',
  style: {},
  onClick: null,
  getIsFold: null,
  option: DEFAULT_OPTION,
  /** >>>>>>仅ellipsis配置 */
  ellipsisOption: DEFAULT_ELLIPSIS_OPTION,
  /** >>>>>>仅shadow配置 */
  shadowOption: DEFAULT_SHADOW_OPTION,
};
// #endregion
/**常量声明 end */

function TextOverflowProcessor(props: TextProcessProps) {

  const {
    text,
    className,
    style,
    onClick,
    getIsFold,
    option,
    ellipsisOption,
    shadowOption,
  } = props;

  // #region
  /** >>>>>>公共配置 */
  const {
    type = 'ellipsis',
    buttonClassName = '',
    buttonStyle = {},
    isClickOriginalEvent = false,
    isDefaultFold = true,
    unfoldButtonText = 'Show Less',
    foldButtonText = 'Show All',
    isShowAllContent = false,
    isMustButton = false,
    isMustNoButton = false,
    lineHeight = 24,
    isRenderShowAllDOM = false,
  } = option || DEFAULT_OPTION;
  /** >>>>>>仅ellipsis配置 */
  const {
    ellipsisLineClamp = 2,
    isJsComputed = false,
    fontSize = 12,
    textEndSlot = null,
    extraOccupiedW = 0,
    buttonBeforeSlot = null,
  } = ellipsisOption || DEFAULT_ELLIPSIS_OPTION;
  /** >>>>>>仅shadow配置 */
  const {
    shadowInitBoxShowH = 76,
    isShadowLayer = true,
    shadowClassName = '',
    shadowStyle = {},
  } = shadowOption || DEFAULT_SHADOW_OPTION;

  // 文案是否折叠
  const [isFold, setIsFold] = useState<boolean>(true);
  // 判断是否出现操作按钮
  const [isShowBtn, setIsShowBtn] = useState<boolean>(false);
  // 是否触发handleResize
  const [isViewResize, setIsViewResize] = useState<boolean>(false);
  // 上一次触发handleResize时的时间戳
  const [lastViewResizeTime, setLastViewResizeTime] = useState<number>(0);
  // 触发handleResize时启用的定时器
  const intervalTimer = useRef<any>(null);
  // 文案可视区域DOM
  const viewingArea = useRef<HTMLParagraphElement>(null);
  // 文案整体容器DOM
  const textArea = useRef<HTMLSpanElement>(null);
  const shadowShowH = useRef<number>(66);

  // 使用js来计算展示的文案时使用
  const [width, setWidth] = useState(0);
  const computedList = useMemo(() => {
    let finalText = '', isEllipsis = false;
    // 为了获取该组件的宽度，组件第一次render时按所有text文字显示
    if (width && isJsComputed) {
      const sumWidth = width * (ellipsisLineClamp as number);
      const str = getFixedWidthText(text, sumWidth - (extraOccupiedW as number), fontSize);
      // 如果返回有省略号，说明文字超出了范围
      if (str?.endsWith('...')) {
        isEllipsis = true;
      }
      if (isEllipsis) {
        // 需要展示按钮时
        if ((foldButtonText || isMustButton) && !isMustNoButton) {
          const span = document.createElement('span');
          span.style.visibility = 'hidden';
          span.style.padding = '0';
          span.style.whiteSpace = 'nowrap';
          span.style.overflowX = 'auto';
          span.style.fontSize = fontSize + 'px';
          document.body.appendChild(span);
          span.innerHTML = `...${(typeof foldButtonText === 'string') ? foldButtonText : ''}`;
          const sumWidth = width * (ellipsisLineClamp as number) - span.offsetWidth;
          document.body.removeChild(span);
          finalText = getFixedWidthText(
            text,
            sumWidth - 10 - (extraOccupiedW as number), // 由于计算出来的文案有精确度误差，屏幕缩放时保留10px范围距离确保按钮不会被挤下来
            fontSize,
          );
        } else {
          finalText = str?.substr(0, str.length - 6) + '...';
        }
      } else {
        finalText = text;
      }
    }
    if (isJsComputed) {
      setIsFold(isEllipsis);
      !isMustButton && !isMustNoButton && setIsShowBtn(isEllipsis);
      if (isMustButton) setIsShowBtn(true);
      if (isMustNoButton) setIsShowBtn(false);
    }

    return {
      finalText,
      isFold: isEllipsis,
    };
  }, [
    text,
    width,
    ellipsisLineClamp,
    foldButtonText,
    fontSize,
    isMustButton,
    isMustNoButton,
    isJsComputed,
    extraOccupiedW,
  ]);

  const isJustifyTextLayout = useMemo(() => {
    return (type === 'ellipsis') && isShowBtn && isFold && !isJsComputed;
  }, [type, isShowBtn, isFold, isJsComputed]);

  const isVisibleShadowLayer = useMemo(() => {
    return isShadowLayer && isShowBtn && isFold;
  }, [isShadowLayer, isShowBtn, isFold]);

  const isHiddenOccupyButtonBlock = useMemo(() => {
    return (isMustNoButton && !textEndSlot) || !isShowBtn;
  }, [isMustNoButton, textEndSlot, isShowBtn]);

  const getIsShowBtn = useCallback(() => {
    const childrens: any = textArea.current?.childNodes;
    let childSumH: number = 0; // 所有子元素标签加起来的高度
    for (let i = 0; i < childrens?.length; i++) {
      const t = childrens?.[i];
      childSumH += t?.offsetHeight;
    }
    // @ts-ignore
    const shadowFlag = type === 'shadow' && textArea?.current?.offsetHeight > shadowShowH.current;
    // @ts-ignore
    const generalFlag = textArea?.current?.offsetHeight > viewingArea?.current?.clientHeight;
    
    if (!!childSumH) {
      return (shadowFlag && childSumH > shadowShowH.current) || generalFlag;
    } else {
      return shadowFlag || generalFlag;
    }
  }, []);

  const handleResize = useCallback(() => {
    if (isShowAllContent) return;

    setIsViewResize(true);
    setLastViewResizeTime(Date.now());
    if (isJsComputed && viewingArea?.current) {
      setWidth(viewingArea?.current?.getBoundingClientRect()?.width || 0);
    } else {
      const flag = getIsShowBtn();
      !isMustButton && !isMustNoButton && setIsShowBtn(flag);
      // 当isMustButton为true时，按钮占据一定空间，此时文案可能因此被折叠而返回结果有误，待优化...
      setIsFold(flag);
    }
  }, [
    isJsComputed,
    isMustButton,
    isMustNoButton,
    isShowAllContent,
  ]);

  const handleClick = useCallback(() => {
    onClick && onClick?.();
    onClick && isClickOriginalEvent && setIsFold(!isFold);
    onClick || setIsFold(!isFold);
  }, [isFold, isClickOriginalEvent]);

  const getButtonContent = useCallback(() => {
    return isFold ? foldButtonText : unfoldButtonText ;
  }, [isFold, unfoldButtonText, foldButtonText]);

  const getButtonStyle = useCallback(() => {
    const defalutStyle = {
      display: isShowBtn ? 'inline-block' : 'none',
      lineHeight: lineHeight + 'px',
    };

    if (Object.prototype.toString.call(buttonStyle) !== '[object Object]') {
      console.error('buttonStyle格式不正确！');
      return defalutStyle;
    }

    return Object?.assign(defalutStyle, buttonStyle);
  }, [isShowBtn, lineHeight, buttonStyle]);

  // 一定不展示按钮时，折叠状态，textEndSlot有的话要展示出来
  const getTextFoldNoButtonEndSlot = () => {
    return (isMustNoButton && isFold && textEndSlot && (
      <span
        className="click-btn"
        style={{
          display: 'inline-block',
          lineHeight: lineHeight + 'px',
        }}
      >
        {textEndSlot}
      </span>
    ));
  }

  // 初始化
  const init = () => {
    if (!TYPE.includes(type as ProcessType)) {
      console.error('文案处理类型type不在可选范围！');
      return;
    }
    if (isShowAllContent) {
      isMustButton && setIsShowBtn(true);
      setIsFold(false);
      return;
    }
    // @ts-ignore
    shadowShowH.current = shadowInitBoxShowH - 10; // 减去shadow阴影的一半高度

    if (!isJsComputed) {
      if (getIsShowBtn()) {
        setIsFold(isDefaultFold as boolean);
        setIsShowBtn(true);
      } else {
        setIsFold(false);
      }
    }

    if (isMustButton) setIsShowBtn(true);
    if (isMustNoButton) setIsShowBtn(false);
    if (isJsComputed && viewingArea?.current) {
      setWidth(viewingArea?.current?.getBoundingClientRect()?.width || 0);
    }
  }

  // 初始化判断是否显示操作按钮
  useEffect(() => {
    init();

    // 页面缩放时判断是否显示操作按钮
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [text]);

  // 触发handleResize时，开启定时器，当不触发时关闭定时器
  useEffect(() => {
    if (isViewResize && !intervalTimer.current) {
      intervalTimer.current = setInterval(() => {
        if ((Date.now() - lastViewResizeTime) > 100) {
          setIsViewResize(false);
          clearInterval(intervalTimer.current);
          intervalTimer.current = null;
        }
      }, 100);
    }
  }, [isViewResize]);

  useEffect(() => { getIsFold?.(isFold); }, [isFold]);
  // #endregion

  return (
    <section className={`text-overflow-processor-content ${className}`} style={style}>
      {isRenderShowAllDOM && <p className="all-text text-overflow-processor-off" style={{display: 'none'}} dangerouslySetInnerHTML={{ __html: text }}></p>}
      <p
        ref={viewingArea}
        className={getClassNames({
          'text-overflow-processor-on': true,
          'p-shadow-info': type === 'shadow',
          'p-ellipsis-info': type === 'ellipsis',
          'text-show-less': isFold && type !== 'shadow',
          'text-show-all': !isFold,
        })}
        style={{
          display: isJsComputed ? 'inline-block' : ((type === 'ellipsis' && isViewResize) ? '-webkit-box' : ''),
          WebkitLineClamp: ellipsisLineClamp,
          lineHeight: lineHeight + 'px',
          textAlign: isJustifyTextLayout ? 'justify' : 'inherit',
        }}
      >
        {type === 'shadow' && (
          <>
            <span
              ref={textArea}
              className={getClassNames({
                'text': true,
                'text-show-btn-box': isShowBtn,
                'text-show-all-box': !isFold,
              })}
              style={{height: isShowBtn ? shadowInitBoxShowH : 'auto'}}
              dangerouslySetInnerHTML={{ __html: text }}
            ></span>
            {isVisibleShadowLayer && (
              <span
                className={`shadow ${shadowClassName}`}
                style={
                  Object?.assign(
                    {bottom: lineHeight},
                    shadowStyle,
                  )
                  || {bottom: lineHeight}
                }
              ></span>
            )}
            <span
              className={getClassNames({
                'click-btn': true,
                [buttonClassName as string]: !!buttonClassName,
              })}
              style={getButtonStyle()}
            >
              <label onClick={handleClick}>{getButtonContent()}</label>
            </span>
          </>
        )}
        {type === 'ellipsis'
          ? (
            <>
              {/* 把按钮撑到下面的DOM */}
              {isHiddenOccupyButtonBlock || (
                <i
                  className="click-btn-before"
                  style={{height: `calc(100% - ${lineHeight}px)`}}
                ></i>
              )}
              <span
                className={getClassNames({
                  'click-btn': true,
                  [buttonClassName as string]: !!buttonClassName,
                })}
                style={getButtonStyle()}
              >
                {(textEndSlot && isFold) && textEndSlot}
                {buttonBeforeSlot || (isJsComputed ? null : <>&nbsp;&nbsp;&nbsp;&nbsp;</>)}
                <label onClick={handleClick}>{getButtonContent()}</label>
              </span>
              {/* 一定不展示按钮时，折叠状态，textEndSlot有的话要展示出来 */}
              {getTextFoldNoButtonEndSlot()}
              <span
                ref={textArea}
                className="text"
              >
                <span dangerouslySetInnerHTML={{ __html: (isJsComputed && isFold) ? computedList?.finalText || '' : text }}></span>
                {(textEndSlot && !isFold) && textEndSlot}
              </span>
            </>
          )
          : null}
      </p>
    </section>
  )
}

TextOverflowProcessor.defaultProps = DEFAULT_PROPS;

export default memo(TextOverflowProcessor);
