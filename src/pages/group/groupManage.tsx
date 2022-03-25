import React, { } from 'react'
import { EditOutlined, EllipsisOutlined, SettingOutlined, SelectOutlined, DeleteOutlined } from '@ant-design/icons';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { Avatar, Button, Card, Col, Row, Popover } from 'antd';
//@ts-ignore
import papaImg from '../../assets/img/papa.jpg'
//@ts-ignore
import geziImg from '../../assets/img/gezi.jpg'
import Meta from 'antd/lib/card/Meta';
import { useStores } from '@/utils/useStores';
import { FormItemProvide } from '@ant-design/pro-form';
import Root from '@/stores/RootStore';
const GroupManage: React.FC = (props, ref) => {
  //const [RootStore] = useState(stores);
  const { RootStore }: Record<string, Root> = useStores();
  return (
    <>
      <br />
      <Row gutter={[16, 50]}>
        {RootStore.AllGroupsMsg.slice().map((item, index) => (
          <Col span={8} key={index}>
            <Card
              hoverable
              key={index}
              style={{ maxWidth: 300 }}
              cover={<img alt="example" src={item.picBase64 || papaImg} />}
              actions={[
                <SelectOutlined key="setting" onClick={(e) => { RootStore.setCurrentGroup(index) }} />,
                <>
                  <Popover
                    content={
                      <Button
                        style={{
                          margin: 8,
                        }}
                        onClick={() => {
                          RootStore.groupDel(index);
                        }}
                        danger
                      >
                        删除此团
                      </Button>
                    }
                    title="确认要删除吗？这极其危险而且不会自动备份"
                    trigger="click"
                  >
                    <DeleteOutlined key="delete" />
                  </Popover>
                </>,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                key={index}
                avatar={<Avatar src={geziImg} />}
                title={item.name}
                description={item.description} />
            </Card>
          </Col>
        ))}
      </Row>
      <br />
    </>
  )
}

export default (observer(GroupManage));