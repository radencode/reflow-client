import React from 'react';

//Animations
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

//Viewer components
import Navigation from './Navigation';

export default class Viewer extends React.Component{
  render(){
    return(
      <div id="viewer">
        <Navigation path={this.props.path}/>
        <ReactCSSTransitionGroup
          transitionName = "fade"
          transitionEnterTimeout = {1500}
          transitionLeaveTimeout = {500}>
          {this.props.modal}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
