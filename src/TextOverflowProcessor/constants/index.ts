import {
  ProcessTypeArr,
  EllipsisOptionType,
  ShadowOptionType,
  OptionType,
  TextOverflowProcessorPropsType,
} from '../types';

const PROCESS_TYPE_LIST: ProcessTypeArr = ['ellipsis', 'shadow'];
const DEFAULT_ELLIPSIS_OPTION: EllipsisOptionType = {
  ellipsisLineClamp: 2,
  isJsComputed: false,
  renderToString: null,
  fontSize: 12,
  fontClassName: '',
  fontStyle: {},
  textEndSlot: null,
  extraOccupiedW: 0,
};
const DEFAULT_SHADOW_OPTION: ShadowOptionType = {
  shadowFoldShowH: 76,
  shadowFoldButtonPlacement: 'outer',
  isShadowLayer: true,
  shadowClassName: '',
  shadowStyle: {},
};
const DEFAULT_OPTION: OptionType = {
  reRenderDependencies: ['text'],
  type: 'ellipsis',
  /** >>>>>>ellipsis配置 */
  ellipsisOption: DEFAULT_ELLIPSIS_OPTION,
  /** >>>>>>shadow配置 */
  shadowOption: DEFAULT_SHADOW_OPTION,
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
  isListenVisible: false,
};
const DEFAULT_PROPS: TextOverflowProcessorPropsType = {
  text: '',
  className: '',
  style: {},
  onClick: null,
  onFoldChange: null,
  option: DEFAULT_OPTION,
};

const JS_COMPUTED_VALID_CSS_PROPERTIES = [
  'font-size',
  'font-weight',
  'font-style',
  'font-family',
  'font-feature-settings',
  'font-kerning',
  'font-language-override',
  'font-optical-sizing',
  'font-stretch',
  'font-size-adjust',
  // 'font-smooth',
  'font-synthesis',
  'font-variant',
  'font-variant-alternates',
  'font-variant-caps',
  'font-variant-east-asian',
  'font-variant-emoji',
  'font-variant-ligatures',
  'font-variant-numeric',
  'font-variant-position',
  'font-variation-settings',
  'initial-letter',
  'inline-size',
  'line-height',
  'line-height-step',
  // 'line-break',
  'letter-spacing',
  // 'text-shadow',
  'text-transform',
  'text-indent',
  'text-combine-upright',
  'text-emphasis',
  'text-emphasis-position',
  'text-emphasis-style',
  'text-orientation',
  'text-rendering',
  'text-size-adjust',
  // 'vertical-align',
  // 'white-space',
  'word-spacing',
  // 'word-break',
  // 'word-wrap',
  // 'writing-mode',
];

const JS_COMPUTED_NUMBER_TO_PX_PROPERTIES = [
  'font-size',
  'letter-spacing',
  'word-spacing',
  'text-indent',
  'line-height-step',
  'inline-size',
];

export {
  PROCESS_TYPE_LIST,
  DEFAULT_ELLIPSIS_OPTION,
  DEFAULT_SHADOW_OPTION,
  DEFAULT_OPTION,
  DEFAULT_PROPS,
  JS_COMPUTED_VALID_CSS_PROPERTIES,
  JS_COMPUTED_NUMBER_TO_PX_PROPERTIES,
};
