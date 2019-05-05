import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Breadcrumbs from '../app/breadcrumbs'
import ActionHeader from '../app/action-header'
import WrapperBox from '../ui/wrapper-box'
import Notice from '../app/notice'
import { resourceType, matchType } from '../../types'

import actions from '../actions'

class RecordAction extends React.Component {
  static actionComponent({ action, isClient }) {
    let Action = actions[action.name]
    if (isClient && action.component) {
      Action = AdminBro.UserComponents[action.component]
    }
    return Action || (() => (<div />))
  }

  constructor(props) {
    super(props)
    this.state = {
      isClient: false,
      recordTitle: '',
    }
  }

  componentDidMount() {
    this.setState({ isClient: true })
  }

  render() {
    const { match, resources } = this.props
    const { resourceId, actionName, recordId } = match.params
    const { isClient, recordTitle } = this.state

    const resource = resources.find(r => r.id === resourceId)
    const action = resource.recordActions.find(r => r.name === actionName)

    const Action = RecordAction.actionComponent({ action, isClient })

    return (
      <WrapperBox>
        <Breadcrumbs resource={resource} actionName={actionName} recordTitle={recordTitle} />
        <Notice />
        <ActionHeader
          resource={resource}
          recordId={recordId}
          action={action}
        />
        <Action action={action} resource={resource} recordId={recordId} />
      </WrapperBox>
    )
  }
}


const mapStateToProps = state => ({
  resources: state.resources,
})

RecordAction.propTypes = {
  resources: PropTypes.arrayOf(resourceType).isRequired,
  match: matchType.isRequired,
}

export default connect(mapStateToProps)(RecordAction)
