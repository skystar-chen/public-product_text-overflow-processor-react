import { useMemo } from 'react';
import { filterComplexDependentProperties } from '../utils';
import { TextOverflowProcessorPropsType } from '../types';

function useRefreshDependentProperties(props: TextOverflowProcessorPropsType) {
  const {
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
  } = props;

  // 组件刷新依赖的属性添加
  const refreshDependentProperties = useMemo(() => {
    if (!Array.isArray(reRenderDependentProperties)) return [text];
    if (Array.isArray(reRenderDependentProperties) && !reRenderDependentProperties.length) return [];
    let dependence: any[] = [];
    switch (true) {
      case reRenderDependentProperties.includes('all'):
        dependence = [
          text,
          type,
          className,
          JSON?.stringify(style),
          buttonClassName,
          JSON?.stringify(buttonStyle),
          isClickOriginalEvent,
          isDefaultFold,
          filterComplexDependentProperties(unfoldButtonText),
          filterComplexDependentProperties(foldButtonText),
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
          filterComplexDependentProperties(textEndSlot),
          extraOccupiedW,
          filterComplexDependentProperties(buttonBeforeSlot),
          shadowInitBoxShowH,
          shadowFoldButtonPlacement,
          isShadowLayer,
          shadowClassName,
          JSON?.stringify(shadowStyle),
        ];
        break;

      default:
        if (reRenderDependentProperties.includes('text')) dependence.push(text);
        if (reRenderDependentProperties.includes('type')) dependence.push(type);
        if (reRenderDependentProperties.includes('className')) dependence.push(className);
        if (reRenderDependentProperties.includes('style')) dependence.push(JSON?.stringify(style));
        if (reRenderDependentProperties.includes('buttonClassName')) dependence.push(buttonClassName);
        if (reRenderDependentProperties.includes('buttonStyle')) dependence.push(JSON?.stringify(buttonStyle));
        if (reRenderDependentProperties.includes('isClickOriginalEvent')) dependence.push(isClickOriginalEvent);
        if (reRenderDependentProperties.includes('isDefaultFold')) dependence.push(isDefaultFold);
        if (reRenderDependentProperties.includes('unfoldButtonText')) dependence.push(filterComplexDependentProperties(unfoldButtonText));
        if (reRenderDependentProperties.includes('foldButtonText')) dependence.push(filterComplexDependentProperties(foldButtonText));
        if (reRenderDependentProperties.includes('isShowAllContent')) dependence.push(isShowAllContent);
        if (reRenderDependentProperties.includes('isMustButton')) dependence.push(isMustButton);
        if (reRenderDependentProperties.includes('isMustNoButton')) dependence.push(isMustNoButton);
        if (reRenderDependentProperties.includes('lineHeight')) dependence.push(lineHeight);
        if (reRenderDependentProperties.includes('isRenderShowAllDOM')) dependence.push(isRenderShowAllDOM);
        if (reRenderDependentProperties.includes('ellipsisLineClamp')) dependence.push(ellipsisLineClamp);
        if (reRenderDependentProperties.includes('isJsComputed')) dependence.push(isJsComputed);
        if (reRenderDependentProperties.includes('fontSize')) dependence.push(fontSize);
        if (reRenderDependentProperties.includes('fontClassName')) dependence.push(fontClassName);
        if (reRenderDependentProperties.includes('fontStyle')) dependence.push(JSON?.stringify(fontStyle));
        if (reRenderDependentProperties.includes('textEndSlot')) dependence.push(filterComplexDependentProperties(textEndSlot));
        if (reRenderDependentProperties.includes('extraOccupiedW')) dependence.push(extraOccupiedW);
        if (reRenderDependentProperties.includes('buttonBeforeSlot')) dependence.push(filterComplexDependentProperties(buttonBeforeSlot));
        if (reRenderDependentProperties.includes('shadowInitBoxShowH')) dependence.push(shadowInitBoxShowH);
        if (reRenderDependentProperties.includes('shadowFoldButtonPlacement')) dependence.push(shadowFoldButtonPlacement);
        if (reRenderDependentProperties.includes('isShadowLayer')) dependence.push(isShadowLayer);
        if (reRenderDependentProperties.includes('shadowClassName')) dependence.push(shadowClassName);
        if (reRenderDependentProperties.includes('shadowStyle')) dependence.push(JSON?.stringify(shadowStyle));
        break;
    }

    return dependence;
  }, [JSON?.stringify(reRenderDependentProperties)]);

  return refreshDependentProperties || [];
}

export default useRefreshDependentProperties;
