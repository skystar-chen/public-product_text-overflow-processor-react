/**
 * 获取固定宽度的字符串，如果传入的text的宽度不够width，则返回原字符串
 * @text 将要被提取的原字符串
 * @width 想要提取的字符串长度
 * @fontSize 字符串显示时的字号大小
 * @isNeedEllipsis 当text的宽度大于width时是否需要省略号，会在传入的width基础上加，最后返回字符串宽度会>width
 */
const getFixedWidthText:
(
  text: string,
  width: number,
  fontSize?: number,
  fontWeight?: number,
  isNeedEllipsis?: boolean,
) => string
=
(
  text,
  width,
  fontSize = 12,
  fontWeight = 400,
  isNeedEllipsis = true,
) => {
  let returnText = '';
  let oldText = '';
  let newText = '';
  if (!text || width < fontSize || typeof text !== 'string') return text;
  const arr = text.split('');
  const span = document.createElement('span');
  span.style.visibility = 'hidden';
  span.style.padding = '0';
  span.style.whiteSpace = 'nowrap';
  span.style.overflowX = 'auto';
  span.style.fontSize = fontSize + 'px';
  span.style.fontWeight = String(fontWeight);
  document.body.appendChild(span);
  
  for (let i = 0, l = arr.length; i < l; i++) {
    const item = arr[i];
    oldText = newText;
    newText += item;
    returnText = newText;
    span.innerHTML = newText;
    const nowWidth = span.offsetWidth;
    if (nowWidth > width) {
      returnText = oldText + (isNeedEllipsis ? '...' : '');
      // console.log(nowWidth, width, returnText);
      break;
    }
  }
  
  document.body.removeChild(span);
  return returnText;
};

const getClassNames = (obj: {[keyName: string]: boolean}): string => {
  try {
    const classNamesArr: string[] = [];
    const objArr = Object.entries(obj);
    for (let i = 0; i < objArr.length; i++) {
      const t = objArr[i];
      !!t[1] && classNamesArr.push(t[0]);
    }
    return classNamesArr.join(' ');
  } catch (error) {
    console.error(error);
    return '';
  }
}

export {
  getFixedWidthText,
  getClassNames,
}
