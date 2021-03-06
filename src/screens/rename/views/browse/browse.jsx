//React modules
import PropTypes from 'prop-types';
import React from 'react';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Electron modules
const { dialog } = require('electron').remote;

//Components
import Selector from './components/selector.jsx';
import Messages from './components/messages.jsx';

//Actions
import * as alert_actions from 'shared/notifications/alert/actions';
import * as files_actions from 'screens/rename/views/configure/containers/files/actions';
import * as progress_actions from 'shared/progress/actions';
import * as tags_actions from 'screens/rename/views/configure/containers/tags/actions';

//Reflow API
import APIController from 'lib/reflow';

class Browse extends React.Component {
	constructor() {
		super();
		this.state = { stage: 'browse' };
		this.reflow = new APIController();
	}

	handleBrowse = async () => {
		dialog.showOpenDialog({ properties: ['openDirectory'] }, async path => {
			if (path) {
				this.setState({ stage: 'loading' });
				try {
					const [files, tags] = await Promise.all([
						this.reflow.fetchFilesInDirectory(path[0]),
						this.reflow.fetchTags(),
					]);
					const count = await this.reflow.fetchFilesCount();
					console.log(count);
					this.props.actions.files.load(files);
					this.props.actions.files.setPath(path[0]);
					this.props.actions.tags.load(tags);
					this.props.actions.files.setCount(count);
					this.setState({ stage: 'configure' });
				} catch (err) {
					this.props.actions.alert.openAlert(
						'There has been an error in loading files',
						'Please try again or log error.',
						[
							{
								label: 'Log Error',
								action: err => {
									console.log(err);
									this.setState({ stage: 'browse' });
								},
							},
							{
								label: 'Cancel',
								action: () => {
									this.setState({ stage: 'browse' });
								},
							},
						],
						err
					);
				}
			}
		});
	};

	handleConfigure = () => {
		this.props.history.push('/app/rename/configure');
		this.props.actions.progress.progressToConfigure('up');
	};

	render() {
		return (
			<div class='rename-child browse'>
				<main>
					<Selector handleBrowse={this.handleBrowse} handleConfigure={this.handleConfigure} stage={this.state.stage} />
					<Messages count={this.props.store.files.count} handleBrowse={this.handleBrowse} stage={this.state.stage} />
				</main>
			</div>
		);
	}
}

Browse.propTypes = {
	actions: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	store: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
	return {
		store: { files: state.rename.files },
	};
};

const mapDispatchToProps = dispatch => {
	return {
		actions: {
			alert: bindActionCreators(alert_actions, dispatch),
			files: bindActionCreators(files_actions, dispatch),
			progress: bindActionCreators(progress_actions, dispatch),
			tags: bindActionCreators(tags_actions, dispatch),
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Browse);
