import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProjectList from '../components/ProjectList'

class ProjectsPage extends Component {
  render() {
    return (
      <div>
        <ProjectList projects={this.props.projects}/>
      </div>
    )
  }
}

const mapStateToProps = (_state, _ownProps) => ({})

export default connect(mapStateToProps, {
})(ProjectsPage)
