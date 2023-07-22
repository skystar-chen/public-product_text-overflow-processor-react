import TextOverflowProcessor from "./TextOverflowProcessor";
export default TextOverflowProcessor;

/* import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import TextOverflowProcessor from "./TextOverflowProcessor";
// import TextOverflowProcessor from 'text-overflow-processor-react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Con />
  </React.StrictMode>
);

export default function Con() {
  const [a, setA] = useState<number>(46);

  return (
    <>
      <TextOverflowProcessor
        text="In all the parting, I like it best see you tomorrow.Of all the blessings I prefer, as you wish. Sometimes you look at the wrong person, not because you are jealous, but because you are kind. You never know how strong you really are until being strong is the only choice you have. Never bend your head. Always hold it high. Look the world straight in the face. Life is alive, there is not much, only helpless. Life is a wonderful journey. Make it your journey and not someone else\'s."
        option={{
          type: 'ellipsis',
          ellipsisOption: {
            isJsComputed: true,
            fontSize: 12,
            fontStyle: {
              fontSize: 16,
            },
            extraOccupiedW: 0,
          },
          shadowOption: {
            shadowInitBoxShowH: a,
          },
          foldButtonText: (<div style={{marginLeft: 10}}>More</div>),
          unfoldButtonText: (<div style={{marginLeft: 10}}>Less</div>),
        }}
      />
      <button onClick={() => {
        setA(70);
      }}>click</button>
    </>
  )
} */

/**
 * 测试调试：
 * 项目中打包组件后执行npm link（此时会把本组件link到全局）
 * 然后随便选个项目执行npm link 包名（此时会把全局中刚才link的包link到当前项目中，此时可以调试）
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
