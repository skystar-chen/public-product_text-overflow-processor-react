import { type FC, useRef, useState, useEffect, memo, useCallback, useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import useRefreshDependentProperties from './hooks/useRefreshDependentProperties';
import { getFixedWidthText, getClassNames, filterComplexDependentProperties } from './utils';
import {
  PROCESS_TYPE_LIST,
  DEFAULT_ELLIPSIS_OPTION,
  DEFAULT_SHADOW_OPTION,
  DEFAULT_OPTION,
  DEFAULT_PROPS,
  JS_COMPUTED_VALID_CSS_PROPERTIES,
  JS_COMPUTED_NUMBER_TO_PX_PROPERTIES,
} from './constants';
import { TextOverflowProcessorPropsType } from './types';
import './index.scss';

/**
 * 文本溢出处理组件
 * @author chenxingxing
 */
const TextOverflowProcessor: FC<TextOverflowProcessorPropsType> = (props) => {

  const {
    text,
    className,
    style,
    onClick,
    getIsFold,
    option,
  } = props;

  // #region
  /** >>>>>>公共配置 */
  const {
    reRenderDependentProperties = ['text'],
    type = 'ellipsis',
    ellipsisOption = DEFAULT_ELLIPSIS_OPTION,
    shadowOption = DEFAULT_SHADOW_OPTION,
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
  /** >>>>>>ellipsis配置 */
  const {
    ellipsisLineClamp = 2,
    isJsComputed = false,
    fontSize = 12,
    fontClassName = '',
    fontStyle = {},
    textEndSlot = null,
    extraOccupiedW = 0,
    buttonBeforeSlot = null,
  } = ellipsisOption || DEFAULT_ELLIPSIS_OPTION;
  /** >>>>>>shadow配置 */
  const {
    shadowInitBoxShowH = 76,
    shadowFoldButtonPlacement = 'outer',
    isShadowLayer = true,
    shadowClassName = '',
    shadowStyle = {},
  } = shadowOption || DEFAULT_SHADOW_OPTION;

  // 用于初始化需要特殊处理的地方
  const [isInitEntry, setIsInitEntry] = useState<boolean>(true);
  // 文案是否折叠
  const [isFold, setIsFold] = useState<boolean>(true);
  // 判断是否出现操作按钮
  const [isShowBtn, setIsShowBtn] = useState<boolean>(false);
  // 是否触发handleResize
  const [isViewResize, setIsViewResize] = useState<boolean>(false);
  // 执行触发handleResize后要做的事情，为了能够在事件中拿到最新的相关状态
  const [executeResizeEvent, setExecuteResizeEvent] = useState<number>(0);
  // 触发handleResize时启用的定时器
  const timer = useRef<NodeJS.Timeout | null>(null);
  // 文案可视区域DOM
  const viewingArea = useRef<HTMLParagraphElement>(null);
  // 文案整体容器DOM
  const textArea = useRef<HTMLSpanElement>(null);
  const shadowShowH = useRef<number>(76);
  // 使用js来计算展示的文案时使用
  const [width, setWidth] = useState<number>(0);
  const [isReJsComputed, setIsReJsComputed] = useState<number>(0);
  const prevComputedList = useRef<{
    finalText: string,
    isFold: boolean,
  }>({
    finalText: '',
    isFold: true,
  });

  const cssText = useMemo(() => {
    let cssText = '';
    if (
      fontStyle
      && Object.prototype.toString.call(fontStyle) === '[object Object]'
      && JSON?.stringify(fontStyle) !== '{}'
    ) {
      const reg = new RegExp('[A-Z]', 'g');
      for (const styleKey in fontStyle) {
        const realStyleKey = styleKey.replaceAll(reg, (str: string) => ('-' + str.toLowerCase()));
        const styleValue = fontStyle[styleKey];
        if (JS_COMPUTED_VALID_CSS_PROPERTIES.includes(realStyleKey)) {
          const flag = JS_COMPUTED_NUMBER_TO_PX_PROPERTIES.includes(realStyleKey) && (typeof styleValue === 'number');
          cssText += `${realStyleKey}:${styleValue}${flag ? 'px' : ''};`;
        }
      }
    }

    return cssText;
  }, [JSON?.stringify(fontStyle)]);

  // 使用js来计算展示的文案
  const computedList = useMemo(() => {
    let finalText = '', isEllipsis = false;
    // 为了获取该组件的宽度，组件第一次render时按所有text文字显示
    if (width && isJsComputed) {
      const sumWidth = width * (ellipsisLineClamp as number);
      const span = document.createElement('span');
      span.style.cssText = 'position:absolute;visibility:hidden;';
      span.innerHTML = `${!!foldButtonText ? renderToString(<>{foldButtonText}</>) : ''}`;
      viewingArea.current ? viewingArea.current.appendChild(span) : document.body.appendChild(span);
      const buttonWidth = span.offsetWidth || 0; // 按钮占的宽度
      viewingArea.current ? viewingArea.current.removeChild(span) : document.body.removeChild(span);
      const str = getFixedWidthText(
        text,
        width,
        sumWidth - (extraOccupiedW as number),
        fontSize,
        400,
        true,
        cssText,
        fontClassName,
        viewingArea.current,
      );
      // 如果返回有省略号，说明文字超出了范围
      isEllipsis = str.endsWith('...');
      const noButtonSumWidth = sumWidth - buttonWidth;
      // 下面计算折叠与否及是否展示按钮情况下得到的最终文案内容
      if (isEllipsis) {
        // 需要展示按钮时
        if ((foldButtonText || isMustButton) && !isMustNoButton) {
          const str = getFixedWidthText(
            text,
            width,
            noButtonSumWidth - (extraOccupiedW as number),
            fontSize,
            400,
            true,
            cssText,
            fontClassName,
            viewingArea.current,
          );
          finalText = str;
        } else {
          finalText = str;
        }
      } else {
        // 需要展示按钮时
        if (foldButtonText && isMustButton && !isMustNoButton) {
          const str = getFixedWidthText(
            text,
            width,
            noButtonSumWidth - (extraOccupiedW as number),
            fontSize,
            400,
            true,
            cssText,
            fontClassName,
            viewingArea.current,
          );
          isEllipsis = str.endsWith('...');
          finalText = isEllipsis ? str : text;
        } else {
          finalText = text;
        }
      }
    }
    // 有操作按钮时，展开态并且最终文案还是展示不下，不用处理
    if (isShowBtn && !isFold && isEllipsis) return prevComputedList.current;
    if (isJsComputed) {
      setIsFold(isEllipsis);
      !isMustButton && !isMustNoButton && setIsShowBtn(isEllipsis);
      if (isMustButton) setIsShowBtn(true);
      if (isMustNoButton) setIsShowBtn(false);
    }
    prevComputedList.current = {
      finalText,
      isFold: isEllipsis,
    };

    return prevComputedList.current;
  }, [
    text,
    width,
    isReJsComputed,
    ellipsisLineClamp,
    filterComplexDependentProperties(foldButtonText),
    fontSize,
    cssText,
    fontClassName,
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

  const buttonCon = useMemo(() => {
    return isFold ? foldButtonText : unfoldButtonText;
  }, [
    isFold,
    filterComplexDependentProperties(unfoldButtonText),
    filterComplexDependentProperties(foldButtonText),
  ]);

  const realButtonStyle = useMemo(() => {
    const defalutStyle = {
      display: isShowBtn ? 'inline-block' : 'none',
      lineHeight: lineHeight + 'px',
    };

    if (Object.prototype.toString.call(buttonStyle) !== '[object Object]') {
      console.error('buttonStyle格式不正确！');
      return defalutStyle;
    }

    return {...defalutStyle, ...(buttonStyle || {})};
  }, [isShowBtn, lineHeight, JSON?.stringify(buttonStyle)]);

  // 一定不展示按钮时，折叠状态，textEndSlot有的话要展示出来
  const textFoldNoButtonEndSlot = useMemo(() => {
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
  }, [
    isMustNoButton,
    isFold,
    filterComplexDependentProperties(textEndSlot),
    lineHeight,
  ]);

  const renderShadowLayer = useMemo(() => {
    const baseStyle = {
      top: (shadowFoldButtonPlacement === 'inner' && isFold) ? 0 : (shadowInitBoxShowH as number) - 20,
    };

    return isVisibleShadowLayer && (
      <span
        className={`shadow ${shadowClassName}`}
        style={{...baseStyle, ...(shadowStyle || {})}}
      ></span>
    );
  }, [
    isVisibleShadowLayer,
    shadowFoldButtonPlacement,
    shadowInitBoxShowH,
    shadowClassName,
    JSON?.stringify(shadowStyle),
  ]);

  const getIsOverflow = useCallback(() => {
    const childrens: NodeListOf<ChildNode> | undefined = textArea.current?.childNodes;
    let childSumH: number = 0; // 所有子元素标签加起来的高度
    if (childrens) {
      for (let i = 0, l = childrens.length; i < l; i++) {
        const t = childrens[i];
        childSumH += ((t as HTMLElement)?.offsetHeight || 0);
      }
    }
    // @ts-ignore
    const shadowFlag = type === 'shadow' && textArea.current?.offsetHeight > shadowShowH.current;
    // @ts-ignore
    const generalFlag = textArea.current?.offsetHeight > viewingArea.current?.clientHeight;
    
    let res;
    if (!!childSumH) {
      res = (shadowFlag && childSumH > shadowShowH.current) || generalFlag;
    } else {
      res = shadowFlag || generalFlag;
    }

    return res;
  }, []);

  const handleResize = useCallback(() => { setExecuteResizeEvent(Date.now()); }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // 有操作按钮时，展开态并且按钮存在时没有触发文案计算，这时点击折叠需要触发重新计算
    if (isShowBtn && !isFold && isJsComputed && viewingArea.current) {
      setIsReJsComputed(Date.now());
    }
    onClick && onClick(e, isFold);
    onClick && isClickOriginalEvent && setIsFold(!isFold);
    onClick || setIsFold(!isFold);
  }, [isFold, isClickOriginalEvent, isShowBtn, isJsComputed]);

  // 初始化
  const init = () => {
    if (!type || !PROCESS_TYPE_LIST.includes(type)) {
      console.error('文案处理类型type不在可选范围！');
      return;
    }
    if (isShowAllContent) {
      setIsShowBtn(!!isMustButton);
      setIsFold(false);
      return;
    }
    shadowShowH.current = shadowInitBoxShowH as number;

    if (!isJsComputed) {
      if (getIsOverflow()) {
        setIsFold(!!isDefaultFold);
        setIsShowBtn(true);
      } else {
        setIsFold(false);
        setIsShowBtn(false);
      }
    }

    if (isMustButton) setIsShowBtn(true);
    if (isMustNoButton) setIsShowBtn(false);
    if (isJsComputed && viewingArea.current) {
      setWidth(viewingArea.current.getBoundingClientRect().width || 0);
    }
    setIsInitEntry(false);
  }

  // 初始化判断是否显示操作按钮
  useEffect(
    () => { init(); },
    useRefreshDependentProperties({
      text,
      reRenderDependentProperties,
      type,
      className,
      style,
      buttonClassName,
      buttonStyle,
      isClickOriginalEvent,
      isDefaultFold,
      unfoldButtonText,
      foldButtonText,
      isShowAllContent,
      isMustButton,
      isMustNoButton,
      lineHeight,
      isRenderShowAllDOM,
      ellipsisLineClamp,
      isJsComputed,
      fontSize,
      fontClassName,
      fontStyle,
      textEndSlot,
      extraOccupiedW,
      buttonBeforeSlot,
      shadowInitBoxShowH,
      shadowFoldButtonPlacement,
      isShadowLayer,
      shadowClassName,
      shadowStyle,
    }),
  );

  useEffect(() => { getIsFold?.(isFold, isInitEntry); }, [isFold, isInitEntry]);

  useEffect(() => {
    // 页面缩放时判断是否显示操作按钮
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  // 相当于handleResize事件
  useEffect(() => {
    if (!executeResizeEvent || isShowAllContent) return;
    // 防抖处理
    setIsViewResize(true);
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (isJsComputed && viewingArea.current) {
        setWidth(viewingArea.current.getBoundingClientRect().width || 0);
      } else {
        const flag = getIsOverflow();
        // 有操作按钮时，展开态并且最终文案还是展示不下，不用处理
        if (isShowBtn && !isFold && flag) {} else {
          !isMustButton && !isMustNoButton && setIsShowBtn(flag);
          setIsFold(flag);
        }
      }
      setIsViewResize(false);
      clearTimeout(timer.current as NodeJS.Timeout);
      timer.current = null;
    }, 200);
  }, [executeResizeEvent]);
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
          display: isJsComputed
            ? 'inline-block'
            // 屏幕在缩放时必须变回折叠态，不然确定不了文案是否有益处
            : ((type === 'ellipsis' && isViewResize)
              ? '-webkit-box'
              : ''),
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
              style={{height: (isFold && !isViewResize && !isInitEntry) ? shadowInitBoxShowH : 'auto'}}
              dangerouslySetInnerHTML={{ __html: text }}
            ></span>
            {/* 按钮和阴影 */}
            {!isViewResize && (
              <>
                {(shadowFoldButtonPlacement === 'outer' || !isFold) && renderShadowLayer}
                <span
                  className={getClassNames({
                    'click-btn': true,
                    'click-btn-inner': shadowFoldButtonPlacement === 'inner' && isFold,
                    [buttonClassName as string]: !!buttonClassName,
                  })}
                  style={realButtonStyle}
                >
                  {shadowFoldButtonPlacement === 'inner' && isFold && renderShadowLayer}
                  <label onClick={handleClick}>{buttonCon}</label>
                </span>
              </>
            )}
          </>
        )}
        {type === 'ellipsis'
          ? (
            <>
              {/* 把按钮撑到下面的DOM */}
              {((isMustNoButton && !textEndSlot) || !isShowBtn) || (
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
                style={realButtonStyle}
              >
                {(textEndSlot && isFold) && textEndSlot}
                {buttonBeforeSlot}
                {!isViewResize && (<label onClick={handleClick}>{buttonCon}</label>)}
              </span>
              {/* 一定不展示按钮时，折叠状态，textEndSlot有的话要展示出来 */}
              {textFoldNoButtonEndSlot}
              <span
                ref={textArea}
                className="text"
              >
                <span dangerouslySetInnerHTML={{ __html: (isJsComputed && isFold) ? computedList.finalText || '' : text }}></span>
                {(textEndSlot && !isFold) && textEndSlot}
              </span>
            </>
          )
          : null}
      </p>
    </section>
  )
}

if (process.env.NODE_ENV !== 'production') { TextOverflowProcessor.displayName = 'TextOverflowProcessor'; }
TextOverflowProcessor.defaultProps = DEFAULT_PROPS;

export default memo(TextOverflowProcessor);
