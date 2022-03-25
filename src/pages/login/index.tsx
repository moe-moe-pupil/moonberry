/* eslint-disable import/no-anonymous-default-export */
import styled from 'styled-components';
import { LoginForm, ProFormText, ProFormCheckbox } from '@ant-design/pro-form';
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { Tabs } from 'antd';
import { useState } from 'react';
import { history } from 'umi';


type LoginType = 'local' | 'account' | 'qqAccount';

const ProFrom = styled.div `
  backgroundColor: white;
  height: auto; 
  width: 300px;
  margin: auto;
  text-Align: center;
  .ant-tabs-tab {
    padding: 12px 12.3px 0 12px;
  }
  .ant-pro-form-login-container {
    margin-top: 50%;
    overflow: visible;
  }
`;




export default () => {
  const [loginType, setLoginType] = useState<LoginType>('local');

  const handleSubmit = (values:any) => {
    localStorage.setItem('account', JSON.stringify(values))
    history.push('/commander')
    console.log(JSON.parse(localStorage.getItem('account') || '_undefined'))
  }

  return (
    <ProFrom>
    <div>
      <LoginForm onFinish = {async (values) => {
          await handleSubmit(values);
        }}
        title="月莓"
        subTitle="本项目AGPLv3开源免费，不众筹，不商用"
      >
        
        <Tabs activeKey={loginType} onChange={(activeKey) => setLoginType(activeKey as LoginType)}>
          <Tabs.TabPane key={'account'} tab={'线上登录'} />
          <Tabs.TabPane key={'local'} tab={'本地登录'} />
          <Tabs.TabPane key={'qqAccount'} tab={'QQ登录'} />
        </Tabs>
        
        {loginType === 'account' && (
          <>
            <ProFormText 
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              placeholder={'用户名'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </>
        )}
        {loginType === 'local' && (
          <>
            <ProFormText
              name="localUsername"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              placeholder={'本地用户名'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="localPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </>
        )}
        {loginType === 'qqAccount' && (
          <>
            <ProFormText 
              name="Account"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              placeholder={'QQ号'}
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/^[1-9]\d*$/, "g"),
                  message: '请输入正确的QQ号!',
                },
                { min:5,
                  message: 'QQ号不少于5位',
                }
              ]}
            />
            <ProFormText
              name="gmName"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              placeholder={'GM昵称'}
              rules={[
                {
                  required: true,
                  message: '请输入GM昵称'
                },
              ]}
            />         
          </>
        )}
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
        </div>
      </LoginForm>
    </div>
    </ProFrom>
  );
};