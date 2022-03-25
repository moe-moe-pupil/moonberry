import React, { useState } from 'react';

import type { MenuDataItem } from '@ant-design/pro-layout';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { Input } from 'antd';
import Error from '@/pages/error/page404';
import ChatList from './ChatList';
import styled from 'styled-components';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useStores } from '@/utils/useStores';
import { inject, observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { rootConfig } from '@/stores/RootStore';

const ProDrag = styled.aside`
  .ant-pro-sider.ant-layout-sider.ant-pro-sider-fixed {
    position:inherit;
    
  }
`

const ProDiv = styled.div`
  section.ant-layout.ant-layout-has-sider > div {
    display: None;
  }
  .ant-layout {
    display: flex!important;
  }
`

const filterByMenuDate = (data: MenuDataItem[], keyWord: string): MenuDataItem[] =>
  data
    .map((item) => {
      if (
        (item.name && item.name.includes(keyWord)) ||
        filterByMenuDate(item.children || [], keyWord).length > 0
      ) {
        return {
          ...item,
          children: filterByMenuDate(item.children || [], keyWord),
        };
      }

      return undefined;
    })
    .filter((item) => item) as MenuDataItem[];

const ChatLayout: React.FC = (props) => {
  const { RootStore } = useStores();
  const [keyWord, setKeyWord] = useState('');
  const [config] = useState(RootStore.config)
  return (
    <ProDiv>
      <ProDrag>
        <ProLayout
          style={{ height: 814 }}
          navTheme={'light'}
          location={{
            pathname: '/home/overview',
          }}
          menuContentRender={() => { return <ChatList />; }}
          fixSiderbar={true}
          menuHeaderRender={false}
          headerRender={false}
          footerRender={false}
          title={false}
          menuExtraRender={({ collapsed }) =>
            !collapsed && (
              <>
                <Tooltip title="此选项启用时，其他未在列表上的好友向您的qq机器人发送消息时，会自动提示你是否将他加入列表" placement="top">
                  <FormControlLabel control={<Switch onChange={() => { RootStore.switchConfig(rootConfig.canChatListAdd) }} checked={RootStore.config.canChatListAdd} />} label="接受新团员?" />
                </Tooltip>
                <Tooltip title="保持按照回合数从小到大依次从上到下排列" placement="top">
                  <FormControlLabel control={<Switch onChange={() => { RootStore.switchConfig(rootConfig.orderByTurn) }} checked={RootStore.config.orderByTurn} />} label="按回合数排列?" />
                </Tooltip>
                <Tooltip title="当一半的PL进入下一轮次后,未回复ST消息的PL开始1分钟倒计时,计时结束后仍未进入下一轮次则会跳过此轮次并叠加一层消极" placement="top">
                  <FormControlLabel control={<Switch onChange={() => { RootStore.switchConfig(rootConfig.negative) }} checked={RootStore.config.negative} />} label="启用消极?" />
                </Tooltip>
                <Input.Search
                  onChange={(e) => {
                    setKeyWord(e.target.value);
                  }} />
              </>
            )
          }

          postMenuData={(menus) => filterByMenuDate(menus || [], keyWord)}
        >
          <PageContainer content={false}>
            {props.children}
          </PageContainer>
        </ProLayout>
      </ProDrag>
    </ProDiv>
  );
};
export default (observer(ChatLayout));