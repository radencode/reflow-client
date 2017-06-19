//Modules
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
//Actions
import * as titleActions from 'actions/title'
import { fireAlert } from 'actions/alert';
import { setActiveModal } from 'actions/navigation';
//Assets
import * as icon from 'assets/icons';

@connect((store) => {
  return{
    alert: store.alert
  };
})

export default class Linker extends React.Component{
	 constructor(props){
    super();
    this.props = props;
  }
	switchModal(active, event){
    if(active === 'active' || this.props.alert.alert){
      event.preventDefault();
      if(active != 'active')
        this.props.dispatch(fireAlert(this.props.link));
    }
		this.props.dispatch(setActiveModal(this.props.link));
  }
	hoverOverLink(){
		this.props.dispatch(titleActions.hoverInTitle(this.props.label));
	}
	hoverOutLink(){
		this.props.dispatch(titleActions.hoverOutTitle());
	}
	render(){
		return(
			<li>
				<div class="anchor">					
						<Link to={this.props.link} onClick={this.switchModal.bind(this, this.props.status)} onMouseOver={this.hoverOverLink.bind(this)} onMouseOut={this.hoverOutLink.bind(this)}>
							<div class="icon">
								{icon.generate(this.props.icon)}
							</div>
						</Link>					
				</div>
			</li>
		);
	}
}