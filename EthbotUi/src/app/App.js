import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import jwt from 'jsonwebtoken'
import './App.scss';
import Login from './user-pages/Login';
import BasicTable from './tables/BasicTable'
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import SettingsPanel from './shared/SettingsPanel';
import Footer from './shared/Footer';
import { withTranslation } from "react-i18next";

class App extends Component {
  state = {
    isLogin: this.checkLogin()
  }
  componentDidMount() {
    this.onRouteChanged();
  }

  checkLogin()  {
    const token = localStorage.getItem('token');
    if(token){
      try {
        var decoded = jwt.verify(token, 'secret');
        return true
      } catch (error) {
      return false
      }
      
    }else {
      return false
    }
  }

  handleLogin = (user, pass) => {
    if(pass === process.env.USER && user === process.env.PASSWORD){
      let token = jwt.sign({
        data: { test: 'foobar' }
      }, 'secret', { expiresIn: '1h' });
  
      localStorage.setItem('token', token);
      this.checkLogin()
      window.location.reload();
    }

  }

  handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  }
  render() {
    let navbarComponent = !this.state.isFullPageLayout ? <Navbar handleLogout={this.handleLogout}/> : '';
    let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar /> : '';
    let SettingsPanelComponent = !this.state.isFullPageLayout ? <SettingsPanel /> : '';
    let footerComponent = !this.state.isFullPageLayout ? <Footer /> : '';
    return (
      <div className="container-scroller">
        { navbarComponent}
        <div className="container-fluid page-body-wrapper">
          {sidebarComponent}
          <div className="main-panel">
            <div className="content-wrapper">
              {!this.state.isLogin ? <Login handleLogin={this.handleLogin}></Login> : <BasicTable checkLogin={this.checkLogin} />}
              {SettingsPanelComponent}
            </div>
            {footerComponent}
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    console.log("ROUTE CHANGED");
    const { i18n } = this.props;
    const body = document.querySelector('body');
    if (this.props.location.pathname === '/layout/RtlLayout') {
      body.classList.add('rtl');
      i18n.changeLanguage('ar');
    }
    else {
      body.classList.remove('rtl')
      i18n.changeLanguage('en');
    }
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = ['/user-pages/login-1', '/user-pages/login-2', '/user-pages/register-1', '/user-pages/register-2', '/user-pages/lockscreen', '/error-pages/error-404', '/error-pages/error-500', '/general-pages/landing-page'];
    for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
      if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
        this.setState({
          isFullPageLayout: true
        })
        document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
        break;
      } else {
        this.setState({
          isFullPageLayout: false
        })
        document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
      }
    }
  }

}

export default withTranslation()(withRouter(App));
