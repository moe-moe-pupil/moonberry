import { PageLoading } from "@ant-design/pro-layout";
import React from 'react';
import { Provider, ProviderProps } from 'mobx-react';

export const initialStateConfig = {
  loding: <PageLoading />,
};




// const MobxProvider = (props: JSX.IntrinsicAttributes & ProviderProps) => <Provider {...stores} {...props} />;

// export function rootContainer(container: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined, opts: any) {
//   return React.createElement(MobxProvider, opts, container);
// }