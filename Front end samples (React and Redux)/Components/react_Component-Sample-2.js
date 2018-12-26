import React, { Component } from 'react';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import '../styles/index.css'
import {updateQuery,queryContent} from '../../actions'
import CategoryNav from '../Navigation/CategoryNav'
import SearchNav from './Components/SearchNav'
import ContentDropdown from './Components/ContentDropdown'
import {Col} from 'react-bootstrap'
import TopLeftMenu from './Components/TopLeftMenu'


class LeftLanding extends Component {

  updateQuery=(input)=>{
    if(input){
      const {queryContent} = this.props
      queryContent(input,{prop:'name'})
    }
    this.props.updateQuery(input)
  }

  state={input:''}

  render() {
    const {input} = this.state
    const {landingView,noCancel,toggleSidebar,query} = this.props
    return (
      <Col className="vh100 scroll font-15 leftText mainBackground borderRight" sm={12} md={4} lg={4}>
        <TopLeftMenu toggleSidebar={toggleSidebar} exclusions={[noCancel&&'cancel',landingView&&'home']}/>
        <br/>
        <SearchNav assignedInput={query} onChanger={(e)=>this.updateQuery(e.target.value)}/>
        <br/>
        <ContentDropdown />
        <CategoryNav input={input} />
      </Col>
    );
  }
}

function mapStateToProps(initialState){
  return {
    query:initialState.messageReducers.query
  }
}

export default withRouter(connect(mapStateToProps,{updateQuery,queryContent})(LeftLanding))
