import React, { Component } from 'react'
import { connect } from 'react-redux'
import { authHandler } from '../actions'
import OktaLogin from './OktaLogin'
import DemoLogin from './DemoLogin'

class LoginPage extends Component {
  componentWillMount() {
    this.props.authHandler() 
  }

  componentDidMount() {

  }

  render() {
    let next = this.props.location.query.next ? this.props.location.query : '/'
    let handler = <div></div>

    switch(this.props.handler) {
      case 'demo':
        handler = <DemoLogin next={next}/>
      break;
      case 'okta':
        handler = <OktaLogin next={next}/>
      break;
      default:
    }
    return handler
  }
}

const mapStateToProps = (state, ownProps) => ({
  handler: state.auth.handler
})

export default connect(mapStateToProps, {
  authHandler
})(LoginPage)
