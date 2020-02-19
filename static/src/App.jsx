import React from "react"
import ReactDOM from 'react-dom'
import './App.css'
import {NavLink, BrowserRouter, Route, Redirect, Switch, withRouter} from 'react-router-dom'
import PropTypes from "prop-types"

import {Layout, Menu, Icon, Dropdown, Button} from "antd"

import IssueList from './IssueList.jsx'
import IssueEdit from "./IssueEdit.jsx"

const { Header, Footer, Sider, Content } = Layout
const { SubMenu } = Menu


const contentNode = document.getElementById('contents');
const NoMatch = () => <p>Page not Found</p>

const menu = (
    <Menu>
        <Menu.Item key="userinfo">
            <Icon type="user" />
            用户中心
        </Menu.Item>
        <Menu.Item key="setting">
            <Icon type="setting" />
            设置
        </Menu.Item>
    </Menu>
)

class HeaderNav  extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current: '/issues'
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(e){
        console.log('click ', e)
        this.setState({
            current: e.key
        })
    }
    render(){
        return (
            <div style={{display:"flex", flex: 1}}>
                <Menu style={{lineHeight: '64px', flex: 1}} onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                    <Menu.Item key="/issues">
                        <NavLink to="/issues">
                            Issues
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="/reports">
                        <NavLink to="/reports">
                            Reports
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="createIssue" style={{float: "right"}} className="nounderline">
                        <Icon type="plus" />Create Issue
                    </Menu.Item>
                </Menu>
                <div id="userInfoDropdown">
                        <Dropdown overlay={menu} placement="bottomCenter">
                        <Icon type="unordered-list" />
                        </Dropdown>
                </div>
            </div>
              
            
        )
    }
}

const App = (props) => {
    const {match} = props;
      return (
            <div>
                <Layout className="layout" style={{ minHeight: '100vh' }}>
                    <Header style={{display: "flex", padding: 0, backgroundColor:'#fff',paddingRight:"20px"}}>
                        <div className="logo">Issues Tracker</div>
                        <HeaderNav />
                    </Header>
                    <Content style={{margin: '24px 16px 0'}}>
                        <Route exact path={match.path} component={withRouter(IssueList)} />
                        <Route path={`${match.path}/:id`} component={IssueEdit} />
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        Full source code available at this <a href=
                        "https://github.com/vasansr/pro-mern-stack">
                        GitHub repository</a>
                    </Footer>
                </Layout>
                {/* <div className="header">
                    <h1>Issue Tracker</h1>
                </div> */}
                {/* <div className="contents">
                    <Route exact path={match.path} component={withRouter(IssueList)} />
                    <Route path={`${match.path}/:id`} component={IssueEdit} />
                </div> */}
                {/* <div className="footer">
                    Full source code available at this <a href=
                    "https://github.com/vasansr/pro-mern-stack">
                    GitHub repository</a>
                </div> */}
            </div>
        )
    }
const RouteApp = () => (
    <BrowserRouter>
        <Switch>
            <Redirect exact from = "/" to="/issues" />
            <Route  path="/issues" component={App} />
            <Route  component={NoMatch} />
        </Switch>
    </BrowserRouter>
)


ReactDOM.render(<RouteApp />, contentNode)


if(module.hot){ //在根组件这里添加这一段可以使得webpack-dev-server在热刷新的时候做到局部刷新而不会去刷新整个页面
    module.hot.accept();
}

