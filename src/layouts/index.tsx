import DynamicMenu from '@/component/menu'
import { IRouteComponentProps } from '@umijs/types';
import Chat from '@/pages/chat/index'
import { PageContainer } from '@ant-design/pro-layout';

const Layout: React.FC<IRouteComponentProps> = (props) =>{
  if (props.location.pathname === '/login') {
    return(
      <> 
      { props.children } 
      </>
      );
  }

  return (
    <DynamicMenu>
      { props.children }
    </DynamicMenu>
  );
};

export default Layout;