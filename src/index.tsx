/**
 * node版本: 14.17.4
 */
export { default } from './TextOverflowProcessor';
export * from './TextOverflowProcessor/types';

/* import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
// import TextOverflowProcessor from './TextOverflowProcessor';
import TextOverflowProcessor from 'text-overflow-processor-react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Con />
  </React.StrictMode>
);

function Con() {
  const [isShowAll, setIsShowAll] = useState<boolean>(false);
  const t = setTimeout(() => {
    setIsShowAll(true);
    clearTimeout(t);
  }, 2000);

  return (
    <TextOverflowProcessor
      type="ellipsis"
      // shadowInitBoxShowH={48}
      // shadowFoldButtonPlacement="inner"
      text="In all the parting, I like it best see you tomorrow.Of all the blessings I prefer, as you wish. Sometimes you look at the wrong person, not because you are jealous, but because you are kind. You never know how strong you really are until being strong is the only choice you have. Never bend your head. Always hold it high. Look the world straight in the face. Life is alive, there is not much, only helpless. Life is a wonderful journey. Make it your journey and not someone else\'s."
      isJsComputed
      fontSize={12}
      fontStyle={{
        fontSize: 16,
      }}
      extraOccupiedW={0}
      foldButtonText={<div style={{marginLeft: 10}}>More</div>}
      // isShowAllContent={isShowAll}
      reRenderDependentProperties={['isShowAllContent']}
    />
  );
} */

/**
 * 测试调试：
 * （注意：可以先npm unlink一下，防止上次这个包还在link中，且此时必须以管理员身份运行，否则可能出bug把代码全删了一点痕迹不留）
 * 项目中打包组件后执行npm link（此时会把本组件link到全局）
 * 然后随便选个项目（这个项目可以是当前项目）执行npm link 包名（此时会把全局中刚才link的包link到当前项目中，此时可以调试）
 * 调试完毕后，回到组件项目中执行npm unlink（去除link软连接）
 */
/**
 * 注意：发布前镜像源切换成npm镜像源，package.json文件的相关依赖及其他无用配置全部暂时去掉
 * （否则低版本npm下载下来的包也会去下载相应的依赖耗费流量及下载时间）
 */
/**
 * npm login --registry=https://registry.npmjs.org/
 * npm publish --registry=https://registry.npmjs.org/
 * 或：npm version patch
 * npm unpublish 包名@版本号 --force
 */
