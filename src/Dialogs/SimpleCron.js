import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles/index';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import IconOk from '@material-ui/icons/Check';
import IconCancel from '@material-ui/icons/Cancel';

import SimpleCron from '../Components/SimpleCron';

import I18n from '../i18n';

// Generate cron expression

const styles = theme => ({
    headerID: {
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    radio: {
        display: 'inline-block'
    },
    dialogPaper: {
        height: 'calc(100% - 96px)'
    },
});

class DialogSimpleCron extends React.Component {
    constructor(props) {
        super(props);

        let cron;
        if (this.props.cron && typeof this.props.cron === 'string' && this.props.cron.replace(/^["']/, '')[0] !== '{') {
            cron = this.props.cron.replace(/['"]/g, '').trim();
        } else {
            cron = this.props.cron || '{}';
            if (typeof cron === 'string') {
                cron = cron.replace(/^["']/, '').replace(/["']\n?$/, '');
            }
        }

        this.state =  {
            cron,
        };
    }

    handleCancel() {
        this.props.onClose();
    }

    handleOk() {
        this.props.onOk(this.state.cron);
        this.props.onClose();
    }

    render() {
        return <Dialog
            onClose={() => {}}
            maxWidth="md"
            fullWidth={true}
            classes={{paper: this.props.classes.dialogPaper}}
            open={true}
            aria-labelledby="cron-dialog-title"
        >
            <DialogTitle id="cron-dialog-title">{this.props.title || I18n.t('ra_Define CRON...')}</DialogTitle>
            <DialogContent style={{height: '100%', overflow: 'hidden'}}>
                <SimpleCron
                    cronExpression={this.state.cron}
                    onChange={cron => this.setState({cron})}
                    language={I18n.getLanguage()}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={() => this.handleOk()} color="primary" startIcon={<IconOk />}>{this.props.ok || I18n.t('ra_Ok')}</Button>
                <Button variant="contained" onClick={() => this.handleCancel()} startIcon={<IconCancel />}>{this.props.cancel || I18n.t('ra_Cancel')}</Button>
            </DialogActions>
        </Dialog>;
    }
}

DialogSimpleCron.propTypes = {
    classes: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    title: PropTypes.string,
    cron: PropTypes.string,
    cancel: PropTypes.string,
    ok: PropTypes.string,
    simple: PropTypes.bool,
    language: PropTypes.string

};

export default withStyles(styles)(DialogSimpleCron);
