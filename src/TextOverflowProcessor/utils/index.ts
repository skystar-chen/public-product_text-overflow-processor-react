/**
 * 获取固定宽度的字符串，如果传入的text的宽度不够width，则返回原字符串
 * @text 将要被提取的原字符串
 * @lineWidth 单行宽度，用于换行符\n计算
 * @width 想要提取的字符串宽度
 * @fontSize 字号大小
 * @isNeedEllipsis 当text的宽度大于width时是否需要省略号
 * @fontStyleCSSText 文案样式
 * @fontClassName 文案类名
 * @containerEl 文案容器dom
 */
type GetFixedWidthTextFn = (
  text: string,
  lineWidth: number,
  width: number,
  fontSize?: number,
  fontWeight?: number,
  isNeedEllipsis?: boolean,
  fontStyleCSSText?: string,
  fontClassName?: string,
  containerEl?: HTMLElement | null,
) => string;
const getFixedWidthText: GetFixedWidthTextFn = (
  text,
  lineWidth,
  width,
  fontSize = 12,
  fontWeight = 400,
  isNeedEllipsis = true,
  fontStyleCSSText = '',
  fontClassName = '',
  containerEl = null,
) => {
  let returnText = '',
      oldText = '',
      newText = '',
      lastWidth = 0, // 上一次计算字符的宽度
      lineFeedWidth = 0, // 换行导致多出来的宽度
      endStrLineFeedWidth = 0, // 如果oldText尾部是换行符，记录换行符占的宽度
      lineFeeAccessed = false; // 记录换行符导致计算零界点是否有触碰到
  if (!text || width < fontSize || typeof text !== 'string') { return text; }
  const strArr = text.split('');
  const span = document.createElement('span');
  const fixedCSSText = `position:absolute;visibility:hidden;padding:0;white-space:nowrap;overflow-x:auto;font-size:${fontSize}px;font-weight:${fontWeight};`;
  span.style.cssText = fixedCSSText + fontStyleCSSText;
  span.setAttribute('class', fontClassName);
  containerEl ? containerEl.appendChild(span) : document.body.appendChild(span);
  
  for (let i = 0, l = strArr.length; i < l; i++) {
    const t = strArr[i],
          itemIsLineFeed = t === '\n',
          lastItemIsLineFeed = strArr[i - 1] === '\n';
    let currentLineFeedWidth = 0;
    oldText = newText;
    newText += t;
    span.innerHTML = newText;
    if (itemIsLineFeed) {
      currentLineFeedWidth = lastItemIsLineFeed ? lineWidth : (lineWidth - (lastWidth % lineWidth));
      lineFeedWidth += currentLineFeedWidth;
    }
    const nowWidth = span.offsetWidth + lineFeedWidth;
    if (itemIsLineFeed && (nowWidth === width)) { lineFeeAccessed = true; }
    if (nowWidth > width) {
      // 避免末尾换行符时，计算出来的宽度没有减去按钮占用的宽度提前一步程序跑进来，这时忽略这一次
      if (itemIsLineFeed && !lineFeeAccessed) {
        lineFeeAccessed = true;
        endStrLineFeedWidth = currentLineFeedWidth - (nowWidth - width);
        lastWidth = width;
        returnText = newText;
        continue;
      }
      if (isNeedEllipsis) {
        span.innerHTML = '...';
        const ellipsisWidth = span.offsetWidth; // 追加省略号占的宽度
        let finalStr = '...';
        // 尾部换行符占的宽度大于等于...省略号占的宽度时把换行符改成...省略号
        if (endStrLineFeedWidth >= ellipsisWidth) {
          finalStr = oldText.slice(0, -1) + '...';
        } else {
          const strArr = oldText.split('');
          // 计算尾部多少个字符等价...省略号占的宽度，并替换成...省略号
          for (let j = 0, l = strArr.length; j < l; j ++) {
            const k = -(j + 1);
            const lastStr = oldText.slice(k);
            span.innerHTML = lastStr;
            if ((span.offsetWidth + endStrLineFeedWidth) >= ellipsisWidth) {
              finalStr = oldText.slice(0, k) + '...';
              break;
            }
          }
        }
        returnText = finalStr;
      } else {
        returnText = oldText;
      }
      break;
    } else {
      endStrLineFeedWidth = itemIsLineFeed ? currentLineFeedWidth : 0;
    }
    lastWidth = nowWidth;
    returnText = newText;
  }
  
  containerEl ? containerEl.removeChild(span) : document.body.removeChild(span);
  return returnText;
};

const getClassNames = (obj: {[keyName: string]: boolean}): string => {
  if (Object.prototype.toString.call(obj) !== '[object Object]') return '';
  let classNames: string = '';
  for (const key in obj) {
    !!obj[key] && (classNames += `${key} `);
  }
  return classNames.trim();
}

const filterComplexDependencies = (value: any): string => (typeof value === 'string' ? value : '');

export {
  getFixedWidthText,
  getClassNames,
  filterComplexDependencies,
}
