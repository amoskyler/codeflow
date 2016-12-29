import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import ProjectServiceForm from '../components/ProjectServiceForm'
import { fetchProjectServices, createProjectService, updateProjectService, deleteProjectService } from '../actions'
import { fetchProjectExtensions, createProjectExtension, updateProjectExtension, deleteProjectExtension } from '../actions'
import * as Extensions from '../components/project_extensions/'

const loadData = props => {
  props.fetchProjectServices(props.project.slug)
  props.fetchProjectExtensions(props.project.slug)
}

class ProjectResources extends Component {
  constructor(props) {
    super(props)
    this.state = {
      edit: null,
      editExtension: null
    }
  }

  componentWillMount() {
    loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project.slug !== this.props.project.slug) {
      loadData(nextProps)
    }
  }

  renderService(service) {
    return(
      <li className="list-group-item service" key={service.id}>
        <div className="feed-element">
          <div className="media-body">
            <div className="row">
              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-10">
                    <h5>
                      <span className="tag tag-default">{service.count}x</span> {service.name}
                    </h5> 
                  </div>
                  <div className="col-xs-2">
                    <button type="button" className="btn btn-secondary btn-sm float-xs-right btn-edit-resource" onClick={() => this.onEditService(service.id)}>
                      <i className="fa fa-pencil" aria-hidden="true" /> Edit
                    </button>
                  </div>
                  <div className="col-xs-12">
                    <i className="fa fa-terminal" aria-hidden="true" /><code>{service.command}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    )    
  }
  
  renderEditService(service) {
    let edit = false
    if (service.id) {
      edit = true 
    }
    return(
      <li className="list-group-item" key={service.id}>
        <div className="feed-element">
          <div className="media-body ">
            <ProjectServiceForm initialValues={service} edit={edit} onSave={() => this.onSaveService()} onCancel={() => this.onCancelEditService()} onDelete={() => this.onDeleteService()}/>
          </div>
        </div>
      </li>
    )    
  }

  renderServices() {
    let { services } = this.props
    let services_jsx = []

    _.forEach(services, service => {
      if (this.state.edit && this.state.edit === service.id) {
        services_jsx.push(this.renderEditService(service))
      } else {
        services_jsx.push(this.renderService(service))
      }
    })
    if (this.state.edit === 0) {
      services_jsx.push(this.renderEditService({ count: 1 }))
    }
    return services_jsx
  }

  renderAddButton() {
    if (this.state.edit === 0) {
      return null
    } else {
      return (<div><br/><button type="submit" className="btn btn-primary float-xs-right" onClick={(e) => this.onAddService(e)}>Add new service</button><br/></div>) 
    }
  }

  renderAddExtensions() {
    return (
      <div>
        <br/>
        <button type="button" className="btn btn-primary float-xs-right" onClick={(e) => this.onAddExtension('LoadBalancer', e)}>Add new load balancer</button>
      </div>
    )
  }

  renderExtensions() {
    let { extensions } = this.props
    let extensions_jsx = []

    _.forEach(extensions, extension => {
      if (this.state.editExtension && this.state.extensionId === extension.id) {
        extensions_jsx.push(this.renderEditExtension(extension))
      } else {
        extensions_jsx.push(this.renderExtension(extension))
      }
    })

    if (typeof this.state.editExtension === 'string') {
      extensions_jsx.push(this.renderEditExtension({ extension: this.state.editExtension, type: 'internal' }))
    }

    return extensions_jsx
  }

  renderExtension(extension) {
    let { services } = this.props
    var Extension = Extensions[extension.extension + 'Extension']
    return (
      <li className="list-group-item service" key={extension.id}>
        <div className="feed-element">
          <div className="media-body">
            <div className="row">
              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-10">
                    <Extension extension={extension} services={services}/>
                  </div>
                  <div className="col-xs-2">
                    <button type="button" className="btn btn-secondary btn-sm float-xs-right btn-edit-resource" onClick={(e) => this.onEditExtension(extension.id, e)}>
                      <i className="fa fa-pencil" aria-hidden="true" /> Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }

  renderEditExtension(extension) {
    let { services } = this.props
    var Extension = Extensions[extension.extension + 'Extension']
    return(
      <li className="list-group-item" key={extension.id+''}>
        <div className="feed-element">
          <div className="media-body ">
            <Extension key={extension.id} services={services} edit initialValues={extension} onSave={() => this.onSaveExtension()} onCancel={() => this.onCancelEditExtension()} onDelete={() => this.onDeleteExtension()}/>
          </div>
        </div>
      </li>
    )    
  }
  
  onAddService(e) {
    e.preventDefault()
    this.setState({ edit: 0 })
  }

  onEditService(id) {
    this.setState({ edit: id })
  }

  onSaveService() {
    const { project } = this.props
    if(this.props.projectService.values.id) {
      this.props.updateProjectService(project.slug, this.props.projectService.values)
    } else {
      this.props.createProjectService(project.slug, this.props.projectService.values)
    }
    this.setState({ edit: null })
  }
  
  onDeleteService() {
    const { project } = this.props
    this.props.deleteProjectService(project.slug, this.props.projectService.values)
    this.setState({ edit: null })
  }

  onCancelEditService() {
    this.setState({ edit: null })
  }


  onAddExtension(name, e) {
    e.preventDefault()
    this.setState({ editExtension: name, extensionId: null })
  }

  onEditExtension(id) {
    this.setState({ editExtension: true, extensionId: id })
  }

  onSaveExtension() {
    const { project } = this.props
    if(this.props.projectExtension.values.id) {
      this.props.updateProjectExtension(project.slug, this.props.projectExtension.values)
    } else {
      this.props.createProjectExtension(project.slug, this.props.projectExtension.values)
    }
    this.setState({ editExtension: null })
  }
  
  onDeleteExtension() {
    const { project } = this.props
    this.props.deleteProjectExtension(project.slug, this.props.projectExtension.values)
    this.setState({ edit: null })
  }

  onCancelEditExtension() {
    this.setState({ editExtension: null })
  }

  render() {
    const { project } = this.props

    if (_.isEmpty(project)) {
      return null
    }

    return (
      <div>
        <div className="hr-divider m-t-md m-b">
          <h3 className="hr-divider-content hr-divider-heading">Services</h3>
        </div>
        <ul className="list-group">
          {this.renderServices()}
        </ul>
        {this.renderAddButton()}
        <div className="hr-divider m-t-md m-b">
          <h3 className="hr-divider-content hr-divider-heading">Extensions</h3>
        </div>
        <ul className="list-group">
          {this.renderExtensions()}
        </ul>
        {this.renderAddExtensions()}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  projectService: state.form.projectService,
  projectExtension: state.form.projectExtension,
  services: state.projectServices,
  extensions: state.projectExtensions
})

export default connect(mapStateToProps, {
  fetchProjectServices, 
  createProjectService, 
  updateProjectService, 
  deleteProjectService,
  fetchProjectExtensions, 
  createProjectExtension, 
  updateProjectExtension, 
  deleteProjectExtension
})(ProjectResources)
