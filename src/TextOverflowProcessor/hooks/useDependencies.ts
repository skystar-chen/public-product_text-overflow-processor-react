import { useMemo } from 'react';
import { filterComplexDependencies } from '../utils';
import {
  EllipsisOptionType,
  ShadowOptionType,
  OptionType,
  TextOverflowProcessorPropsType,
} from '../types';

function useDependencies(
  props: TextOverflowProcessorPropsType
    & OptionType
    & Omit<EllipsisOptionType, 'renderToString'>
    & ShadowOptionType
  ,
  inView: boolean,
) {
  const {
    text,
    reRenderDependencies,
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
    shadowFoldShowH,
    shadowFoldButtonPlacement,
    isShadowLayer,
    shadowClassName,
    shadowStyle,
    isListenVisible,
  } = props;

  // 组件刷新依赖的属性添加
  const dependencies = useMemo(() => {
    if (!Array.isArray(reRenderDependencies)) return [text];
    if (Array.isArray(reRenderDependencies) && !reRenderDependencies.length) return [];
    let newDependencies: any[] = [];
    switch (true) {
      case reRenderDependencies.includes('all'):
        newDependencies = [
          text,
          type,
          className,
          JSON?.stringify(style),
          buttonClassName,
          JSON?.stringify(buttonStyle),
          isClickOriginalEvent,
          isDefaultFold,
          filterComplexDependencies(unfoldButtonText),
          filterComplexDependencies(foldButtonText),
          isShowAllContent,
          isMustButton,
          isMustNoButton,
          lineHeight,
          isRenderShowAllDOM,
          ellipsisLineClamp,
          isJsComputed,
          fontSize,
          fontClassName,
          JSON?.stringify(fontStyle),
          filterComplexDependencies(textEndSlot),
          extraOccupiedW,
          shadowFoldShowH,
          shadowFoldButtonPlacement,
          isShadowLayer,
          shadowClassName,
          JSON?.stringify(shadowStyle),
          isListenVisible,
        ];
        break;

      default:
        if (reRenderDependencies.includes('text')) newDependencies.push(text);
        if (reRenderDependencies.includes('type')) newDependencies.push(type);
        if (reRenderDependencies.includes('className')) newDependencies.push(className);
        if (reRenderDependencies.includes('style')) newDependencies.push(JSON?.stringify(style));
        if (reRenderDependencies.includes('buttonClassName')) newDependencies.push(buttonClassName);
        if (reRenderDependencies.includes('buttonStyle')) newDependencies.push(JSON?.stringify(buttonStyle));
        if (reRenderDependencies.includes('isClickOriginalEvent')) newDependencies.push(isClickOriginalEvent);
        if (reRenderDependencies.includes('isDefaultFold')) newDependencies.push(isDefaultFold);
        if (reRenderDependencies.includes('unfoldButtonText')) newDependencies.push(filterComplexDependencies(unfoldButtonText));
        if (reRenderDependencies.includes('foldButtonText')) newDependencies.push(filterComplexDependencies(foldButtonText));
        if (reRenderDependencies.includes('isShowAllContent')) newDependencies.push(isShowAllContent);
        if (reRenderDependencies.includes('isMustButton')) newDependencies.push(isMustButton);
        if (reRenderDependencies.includes('isMustNoButton')) newDependencies.push(isMustNoButton);
        if (reRenderDependencies.includes('lineHeight')) newDependencies.push(lineHeight);
        if (reRenderDependencies.includes('isRenderShowAllDOM')) newDependencies.push(isRenderShowAllDOM);
        if (reRenderDependencies.includes('ellipsisLineClamp')) newDependencies.push(ellipsisLineClamp);
        if (reRenderDependencies.includes('isJsComputed')) newDependencies.push(isJsComputed);
        if (reRenderDependencies.includes('fontSize')) newDependencies.push(fontSize);
        if (reRenderDependencies.includes('fontClassName')) newDependencies.push(fontClassName);
        if (reRenderDependencies.includes('fontStyle')) newDependencies.push(JSON?.stringify(fontStyle));
        if (reRenderDependencies.includes('textEndSlot')) newDependencies.push(filterComplexDependencies(textEndSlot));
        if (reRenderDependencies.includes('extraOccupiedW')) newDependencies.push(extraOccupiedW);
        if (reRenderDependencies.includes('shadowFoldShowH')) newDependencies.push(shadowFoldShowH);
        if (reRenderDependencies.includes('shadowFoldButtonPlacement')) newDependencies.push(shadowFoldButtonPlacement);
        if (reRenderDependencies.includes('isShadowLayer')) newDependencies.push(isShadowLayer);
        if (reRenderDependencies.includes('shadowClassName')) newDependencies.push(shadowClassName);
        if (reRenderDependencies.includes('shadowStyle')) newDependencies.push(JSON?.stringify(shadowStyle));
        if (reRenderDependencies.includes('isListenVisible')) newDependencies.push(isListenVisible);
        break;
    }

    return newDependencies;
  }, [JSON?.stringify(reRenderDependencies)]);

  return [...dependencies, inView];
}

export default useDependencies;
