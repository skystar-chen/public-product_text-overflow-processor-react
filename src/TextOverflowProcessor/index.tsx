import { useRef, useState, useEffect, memo, useCallback, useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import { getFixedWidthText, getClassNames } from './utils';
import {
  TYPE,
  DEFAULT_PROPS,
  JS_COMPUTED_VALID_CSS_PROPERTIES,
  JS_COMPUTED_NUMBER_TO_PX_PROPERTIES,
} from './constants';
import {
  ProcessType,
  TextProcessProps,
} from './types';
import './index.scss';

function TextOverflowProcessor(props: TextProcessProps) {

  const {
    text,
    reRenderDependentProperties,
    type,
    className,
    style,
    buttonClassName,
    buttonStyle,
    onClick,
    isClickOriginalEvent,
    getIsFold,
    isDefaultFold,
    unfoldButtonText,
    foldButtonText,
    isShowAllContent,
    isMustButton,
    isMustNoButton,
    lineHeight,
    isRenderShowAllDOM,
    /** >>>>>>仅ellipsis配置 */
    ellipsisLineClamp,
    isJsComputed,
    fontSize,
    fontClassName,
    fontStyle,
    textEndSlot,
    extraOccupiedW,
    buttonBeforeSlot,
    /** >>>>>>仅shadow配置 */
    shadowInitBoxShowH,
    isShadowLayer,
    shadowClassName,
    shadowStyle,
  } = props;

  // 用于初始化需要特殊处理的地方
  const [isInitEntry, setIsInitEntry] = useState<boolean>(true);
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
  const shadowShowH = useRef<number>(76);

  // 使用js来计算展示的文案时使用
  const [width, setWidth] = useState(0);
  const cssText = useMemo(() => {
    let cssText = '';
    if (
      fontStyle
      && Object.prototype.toString.call(fontStyle) === '[object Object]'
      && JSON?.stringify(fontStyle) !== '{}'
    ) {
      const reg = new RegExp('[A-Z]', 'g');
      for (const styleKey in fontStyle) {
        const realStyleKey = styleKey?.replaceAll(reg, (str: string) => ('-' + str?.toLowerCase()));
        const styleValue = (fontStyle as any)?.[styleKey];
        if (JS_COMPUTED_VALID_CSS_PROPERTIES?.includes(realStyleKey)) {
          const flag = JS_COMPUTED_NUMBER_TO_PX_PROPERTIES?.includes(realStyleKey) && (typeof styleValue === 'number');
          cssText += `${realStyleKey}:${styleValue}${flag ? 'px' : ''};`;
        }
      }
    }

    return cssText;
  }, [fontStyle]);
  const computedList = useMemo(() => {
    let finalText = '', isEllipsis = false;
    // 为了获取该组件的宽度，组件第一次render时按所有text文字显示
    if (width && isJsComputed) {
      const sumWidth = width * (ellipsisLineClamp as number);
      const span = document.createElement('span');
      span.style.cssText = 'position:absolute;visibility:hidden;';
      span.innerHTML = `${!!foldButtonText ? renderToString(<>{foldButtonText}</>) : ''}`;
      viewingArea?.current ? viewingArea?.current?.appendChild(span) : document.body.appendChild(span);
      const buttonWidth = span.offsetWidth || 0; // 按钮占的宽度
      viewingArea?.current ? viewingArea?.current?.removeChild(span) : document.body.removeChild(span);
      const str = getFixedWidthText(
        text,
        width,
        sumWidth - (extraOccupiedW as number),
        fontSize,
        400,
        true,
        cssText,
        fontClassName,
        viewingArea?.current,
      );
      // 如果返回有省略号，说明文字超出了范围
      isEllipsis = str?.endsWith('...');
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
            viewingArea?.current,
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
            viewingArea?.current,
          );
          isEllipsis = str?.endsWith('...');
          finalText = isEllipsis ? str : text;
        } else {
          finalText = text;
        }
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
    cssText,
    fontClassName,
    isMustButton,
    isMustNoButton,
    isJsComputed,
    extraOccupiedW,
  ]);

  // 组件刷新依赖的属性添加
  const refreshDependentProperties = useMemo(() => {
    if (!Array.isArray(reRenderDependentProperties)) return [text];
    if (Array.isArray(reRenderDependentProperties) && !reRenderDependentProperties?.length) return [];
    let dependence: any[] = [];
    switch (true) {
      case reRenderDependentProperties?.includes('all'):
        dependence = [
          text,
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
          isShadowLayer,
          shadowClassName,
          shadowStyle,
        ];
        break;
      
      case reRenderDependentProperties?.includes('text'):
        dependence.push(text);
      case reRenderDependentProperties?.includes('type'):
        dependence.push(type);
      case reRenderDependentProperties?.includes('className'):
        dependence.push(className);
      case reRenderDependentProperties?.includes('style'):
        dependence.push(style);
      case reRenderDependentProperties?.includes('buttonClassName'):
        dependence.push(buttonClassName);
      case reRenderDependentProperties?.includes('buttonStyle'):
        dependence.push(buttonStyle);
      case reRenderDependentProperties?.includes('isClickOriginalEvent'):
        dependence.push(isClickOriginalEvent);
      case reRenderDependentProperties?.includes('isDefaultFold'):
        dependence.push(isDefaultFold);
      case reRenderDependentProperties?.includes('unfoldButtonText'):
        dependence.push(unfoldButtonText);
      case reRenderDependentProperties?.includes('foldButtonText'):
        dependence.push(foldButtonText);
      case reRenderDependentProperties?.includes('isShowAllContent'):
        dependence.push(isShowAllContent);
      case reRenderDependentProperties?.includes('isMustButton'):
        dependence.push(isMustButton);
      case reRenderDependentProperties?.includes('isMustNoButton'):
        dependence.push(isMustNoButton);
      case reRenderDependentProperties?.includes('lineHeight'):
        dependence.push(lineHeight);
      case reRenderDependentProperties?.includes('isRenderShowAllDOM'):
        dependence.push(isRenderShowAllDOM);
      case reRenderDependentProperties?.includes('ellipsisLineClamp'):
        dependence.push(ellipsisLineClamp);
      case reRenderDependentProperties?.includes('isJsComputed'):
        dependence.push(isJsComputed);
      case reRenderDependentProperties?.includes('fontSize'):
        dependence.push(fontSize);
      case reRenderDependentProperties?.includes('fontClassName'):
        dependence.push(fontClassName);
      case reRenderDependentProperties?.includes('fontStyle'):
        dependence.push(fontStyle);
      case reRenderDependentProperties?.includes('textEndSlot'):
        dependence.push(textEndSlot);
      case reRenderDependentProperties?.includes('extraOccupiedW'):
        dependence.push(extraOccupiedW);
      case reRenderDependentProperties?.includes('buttonBeforeSlot'):
        dependence.push(buttonBeforeSlot);
      case reRenderDependentProperties?.includes('shadowInitBoxShowH'):
        dependence.push(shadowInitBoxShowH);
      case reRenderDependentProperties?.includes('isShadowLayer'):
        dependence.push(isShadowLayer);
      case reRenderDependentProperties?.includes('shadowClassName'):
        dependence.push(shadowClassName);
      case reRenderDependentProperties?.includes('shadowStyle'):
        dependence.push(shadowStyle);
        break;
    
      default:
        break;
    }

    return dependence;
  }, [reRenderDependentProperties]);

  const buttonCon = useMemo(() => {
    return isFold ? foldButtonText : unfoldButtonText;
  }, [isFold, unfoldButtonText, foldButtonText]);

  const realButtonStyle = useMemo(() => {
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
  }, [isMustNoButton, isFold, textEndSlot, lineHeight]);

  const getIsOverflow = useCallback(() => {
    const childrens: any = textArea?.current?.childNodes;
    let childSumH: number = 0; // 所有子元素标签加起来的高度
    for (let i = 0, l = childrens?.length; i < l; i++) {
      const t = childrens?.[i];
      childSumH += t?.offsetHeight;
    }
    // @ts-ignore
    const shadowFlag = type === 'shadow' && textArea?.current?.offsetHeight > shadowShowH.current;
    // @ts-ignore
    const generalFlag = textArea?.current?.offsetHeight > viewingArea?.current?.clientHeight;
    
    let res;
    if (!!childSumH) {
      res = (shadowFlag && childSumH > shadowShowH.current) || generalFlag;
    } else {
      res = shadowFlag || generalFlag;
    }

    return res;
  }, []);

  const handleResize = useCallback(() => {
    if (isShowAllContent) return;

    setIsViewResize(true);
    setLastViewResizeTime(Date.now());
    if (isJsComputed && viewingArea?.current) {
      setWidth(viewingArea?.current?.getBoundingClientRect()?.width || 0);
    } else {
      const flag = getIsOverflow();
      !isMustButton && !isMustNoButton && setIsShowBtn(flag);
      setIsFold(flag);
    }
  }, [isJsComputed, isMustButton, isMustNoButton, isShowAllContent]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    onClick && onClick?.(e);
    onClick && isClickOriginalEvent && setIsFold(!isFold);
    onClick || setIsFold(!isFold);
  }, [isFold, isClickOriginalEvent]);

  // 初始化
  const init = () => {
    if (!TYPE.includes(type as ProcessType)) {
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
    if (isJsComputed && viewingArea?.current) {
      setWidth(viewingArea?.current?.getBoundingClientRect()?.width || 0);
    }
    setIsInitEntry(false);
  }

  // 初始化判断是否显示操作按钮
  useEffect(() => { init(); }, refreshDependentProperties);

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

  useEffect(() => { getIsFold?.(isFold, isInitEntry); }, [isFold, isInitEntry]);

  useEffect(() => {
    // 页面缩放时判断是否显示操作按钮
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

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
          display: isJsComputed ? 'inline-block' : (type === 'ellipsis' && isViewResize) ? '-webkit-box' : '',
          WebkitLineClamp: ellipsisLineClamp,
          lineHeight: lineHeight + 'px',
          textAlign: ((type === 'ellipsis') && isShowBtn && isFold && !isJsComputed) ? 'justify' : 'inherit',
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
            {(isShadowLayer && isShowBtn && isFold) && (
              <span
                className={`shadow ${shadowClassName}`}
                style={Object?.assign({bottom: lineHeight}, shadowStyle) || {bottom: lineHeight}}
              ></span>
            )}
            <span
              className={getClassNames({
                'click-btn': true,
                [buttonClassName as string]: !!buttonClassName,
              })}
              style={realButtonStyle}
            >
              <label onClick={handleClick}>{buttonCon}</label>
            </span>
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
                {buttonBeforeSlot || (isJsComputed ? null : <>&nbsp;&nbsp;&nbsp;&nbsp;</>)}
                <label onClick={handleClick}>{buttonCon}</label>
              </span>
              {/* 一定不展示按钮时，折叠状态，textEndSlot有的话要展示出来 */}
              {textFoldNoButtonEndSlot}
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
