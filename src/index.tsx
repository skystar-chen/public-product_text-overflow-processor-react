import TextOverflowProcessor from "./TextOverflowProcessor";
export default TextOverflowProcessor;

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import TextOverflowProcessor from "./TextOverflowProcessor";
// // import TextOverflowProcessor from 'text-overflow-processor-react';

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// root.render(
//   <React.StrictMode>
//     <TextOverflowProcessor
//       text="In all the parting, I like it best see you tomorrow.Of all the blessings I prefer, as you wish. Sometimes you look at the wrong person, not because you are jealous, but because you are kind. You never know how strong you really are until being strong is the only choice you have. Never bend your head. Always hold it high. Look the world straight in the face. Life is alive, there is not much, only helpless. Life is a wonderful journey. Make it your journey and not someone else\'s."
//       option={{
//         type: 'shadow',
//         foldButtonText: (<div style={{marginLeft: 10}}>More</div>),
//         unfoldButtonText: (<div style={{marginLeft: 10}}>Less</div>),
//       }}
//       ellipsisOption={{
//         isJsComputed: true,
//         fontSize: 16,
//         extraOccupiedW: 51,
//       }}
//     />
//   </React.StrictMode>
// );

/**
 * 注意：发布前镜像源切换成npm镜像源，package.json文件的相关依赖及其他无用配置全部暂时去掉
 * （否则低版本npm下载下来的包也会去下载相应的依赖耗费流量及下载时间）
 */
/**
 * npm login --registry=https://registry.npmjs.org/
 * npm publish --registry=https://registry.npmjs.org/
 * 或：npm version patch
 */
