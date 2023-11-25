import { useMemo } from 'react';

function useRefreshDependentProperties(props) {
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
    isShadowLayer,
    shadowClassName,
    shadowStyle,
  } = props;

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

  return refreshDependentProperties;
}

export default useRefreshDependentProperties;
