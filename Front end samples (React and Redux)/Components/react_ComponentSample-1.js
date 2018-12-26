import React, { Component } from 'react';
import {connect} from 'react-redux'
import NavigationView from '../Navigation/NavigationView'
import { withRouter } from 'react-router-dom'
import LeftLanding from './LeftLanding'
import RightLanding from './RightLanding'
import {Grid,Row} from 'react-bootstrap'
import {getUserContents,getPopularContent} from '../../actions'


class LandingView extends Component {

  componentDidMount(){
    const {getUserContents,getPopularContent} = this.props
    getUserContents(true)
    getPopularContent()
  }

  state={loading:false}

  render() {
    const {loading} = this.state
    return (
      <div className="padding-sides-15">
        <Grid>
          <Row>
            <NavigationView landingView handleOpen={this.handleOpen} handleClose={this.handleClose}/>
          </Row>
          <Row>
            <div className="hidden-xs hidden-sm"><LeftLanding noCancel landingView/></div>
            <RightLanding loading={loading}/>
          </Row>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(initialState){
  return {
    currentUser: initialState.userReducers.currentUser,
    start: initialState.userReducers.start
  }
}


export default withRouter(connect(mapStateToProps,{getUserContents,getPopularContent})(LandingView));
