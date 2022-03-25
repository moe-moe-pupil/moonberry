import { Result, Button } from 'antd';
import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Error extends Component {
  render() { 
    return(
      <Result 
        status="404"
        title="404"
        subTitle="抱歉，页面走丢了。"
        extra={<Button type="primary" ><Link to ="">回到主页</Link></Button>}>
      </Result>
    );
  }
}

