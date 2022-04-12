import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import menuData from './menuData';
import '@ant-design/pro-layout/dist/layout.css';
import { Link } from 'umi';
import { inject, observer } from 'mobx-react';
import { useStores } from '@/utils/useStores';
//import  useStores  from '@/hooks/useStores'
import styled from 'styled-components';
import ExtraCallback from './extraCallback';
import { chatType, miraiContent } from '@/stores/ChatStore';
import 'antd/dist/antd.css';
import type { MenuDataItem } from '@ant-design/pro-layout';
import { Input, Button, notification } from 'antd';
import Root from '@/stores/RootStore';
import Switch from '@mui/material/Switch';
import { Tooltip } from '@mui/material';
import { FormControlLabel } from '@material-ui/core';

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


const ProDiv = styled.div`
  .ant-modal-wrap{
    pointer-events: none;
    z-Index: 800!important;
  }
  .ant-modal-wrap:focus-within{
    z-Index: 900!important;
  }
  .ant-modal-body {
    overflow: auto;
  }
  .ant-pro-page-container-children-content {
    margin:6px 6px 0;
  }
  .ant-pro-page-container-children-content > div > div > div{
    display: block;
  }
  .ant-page-header {
    box-shadow:0 0 3px #999;
    border-radius:0px;
    padding:0 23px 0;
  }
  .ant-pro-page-container-warp {
    border-radius:0px;
  }
  .ant-pro-global-header {
    background: #333;
  }
  .ant-pro-basicLayout .ant-pro-basicLayout-is-children.ant-pro-basicLayout-fix-siderbar {
    height:814px;
    transform:None;
  }
  .ant-table-cell {
    overflow-x: auto;
  }
  .ant-input-group.ant-input-group-compact {
    display: flex;
  }
  .ant-popover {
    z-index:1030 !important;
  }
`;




const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};



const DynamicMenu: React.FC = (props) => {
  const [pathname, setPathname] = useState('/commander/groupManage');
  const [menuRoutes, setMenuRoutes] = useState(localStorage.getItem('routes') || menuData[0].routes);
  const [keyWord, setKeyWord] = useState('');
  const [refresh, setRefresh] = useState(0);
  const actionRef = useRef<{
    reload: () => void;
  }>();
  const { RootStore } = useStores();
  useEffect(() => {
    setRefresh(refresh + 1)
  }, [RootStore.currentGroup])
  // const webSocketInit = useCallback(() => {
  //   const stateArr = [
  //     '正在链接中',
  //     '已经链接并且可以通讯',
  //     '连接正在关闭',
  //     '连接已关闭或者没有链接成功',
  //   ];
  //   if (!ws.current || ws.current.readyState === 3) {
  //     ws.current = new WebSocket('ws://localhost:8080/message?verifyKey=1234567890');
  //     ws.current.onopen = e => {
  //       setReadyState(stateArr[ws.current?.readyState ?? 0]);
  //       RootStore.ws = ws.current;
  //       console.log(RootStore.ws === ws.current)
  //     }
  //     ws.current.onclose = e =>
  //       setReadyState(stateArr[ws.current?.readyState ?? 0]);
  //     ws.current.onerror = e =>
  //       setReadyState(stateArr[ws.current?.readyState ?? 0]);
  //     ws.current.onmessage = e => {
  //       var eJson = JSON.parse(e.data)
  //       if(lastValue != eJson) {
  //         for(var i in eJson.data) {
  //           newChatMsg[i] = eJson.data[i];
  //         }
  //         if(eJson.syncId != '' && newChatMsg.type == chatType.FriendMessage) {
  //           RootStore.chatAdd(newChatMsg)
  //         }
  //         console.log(newChatMsg)
  //         if(newChatMsg.type == chatType.FriendMessage) {
  //           if(RootStore.qqNumberInChatList(newChatMsg.sender?.id) == -1) {
  //             openNotification(newChatMsg.sender?.nickname || "未知错误", newChatMsg.sender?.id || 0)
  //           }
  //         }
  //         lastValue = eJson;
  //       } else {

  //       }
  //     };
  //   }
  // }, [ws]);

  // useLayoutEffect(() => {
  //   return () => {
  //     ws.current?.close();
  //   };
  // }, [ws, webSocketInit])
  return (
    <ProDiv>
      <ProLayout
        fixSiderbar
        fixedHeader
        title={'月莓'}
        breadcrumbRender={false}
        actionRef={actionRef}
        menu={{
          autoClose: false,
          //@ts-ignore
          request: async () => {
            await waitTime(10);
            return menuRoutes;
          },
        }}
        location={{
          pathname,
        }}
        waterMarkProps={{
          content: '',
        }}
        menuExtraRender={({ collapsed }) =>
          !collapsed && (
            <Input.Search
              onChange={(e) => {
                setKeyWord(e.target.value);
              }}
            />
          ) && (
            <Tooltip title="此选项启用时,将禁用柳絮的自动链接" placement="top">
              <FormControlLabel control={<Switch onChange={(e, checked) => { setRefresh(refresh + 1); RootStore.setUe4Enable(checked) }} checked={RootStore.config.Ue4Enable} />} label={<p style={{ color: 'white' }}>链接到柳絮?</p>} />
            </Tooltip>
          )
        }
        menuHeaderRender={(props) => {
          return (
            <>
              <h1>{RootStore.groups.length > 0 ? '<' + RootStore.groups[RootStore.currentGroup].name + '>' : '未选择任何团'}</h1>
            </>
          );
        }}
        menuFooterRender={(props) => {
          return (
            <a
              style={{
                lineHeight: '48rpx',
                display: 'flex',
                height: 48,
                color: 'rgba(255, 255, 255, 0.65)',
                alignItems: 'center',
              }}
              href="https://preview.pro.ant.design/dashboard/analysis"
              target="_blank"
              rel="noreferrer"
            >
              版本号:{'0.0.1'}
            </a>
          );
        }}
        postMenuData={(menus) => filterByMenuDate(menus || [], keyWord)}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item, dom) => (
          //@ts-ignore
          <Link to={item.path}

            onClick={() => {
              setPathname(item.path || '/');
            }}

          >
            {dom}
          </Link>
        )}
        rightContentRender={() => (
          <div>
            <Avatar shape="square" size="small" icon={<UserOutlined />} />
          </div>
        )}
      >
        <PageContainer
          fixedHeader
          style={{
          }}
          extra={<ExtraCallback localPath={pathname}></ExtraCallback>}
        >
          <div
            style={{
              minHeight: '820px',
              width: '100%',
              backgroundColor: '#151515d9',
              borderRadius: '5px',
              padding: '5px',
              boxShadow: '0 0 3px #999',
              overflowX: 'hidden',
            }}
          >
            {RootStore.groups.length > 0?props.children:<h1 style={{color:'#fff', fontSize:40}}>尚未有任何团,请先在团管理中新建团</h1>}
          </div>
        </PageContainer>

      </ProLayout>
    </ProDiv>
  );
};
export default observer(DynamicMenu) //inject('RootStore')(observer(DynamicMenu));

