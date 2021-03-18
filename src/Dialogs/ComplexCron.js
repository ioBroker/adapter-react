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

import ComplexCron from '../Components/ComplexCron';

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
    buttonIcon: {
        marginRight: theme.spacing(1),
    }
});

class DialogComplexCron extends React.Component {
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
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="md"
            fullWidth={true}
            classes={{paper: this.props.classes.dialogPaper}}
            open={true}
            aria-labelledby="cron-dialog-title"
        >
            <DialogTitle id="cron-dialog-title">{this.props.title || I18n.t('ra_Define schedule...')}</DialogTitle>
            <DialogContent style={{height: '100%', overflow: 'hidden'}}>
                <ComplexCron
                    cronExpression={this.state.cron}
                    onChange={cron => this.setState({cron})}
                    language={I18n.getLanguage()}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.handleOk()} color="primary"><IconOk className={this.props.classes.buttonIcon}/>{this.props.ok || I18n.t('ra_Ok')}</Button>
                <Button onClick={() => this.handleCancel()}><IconCancel className={this.props.classes.buttonIcon}/>{this.props.cancel || I18n.t('ra_Cancel')}</Button>
            </DialogActions>
        </Dialog>;
    }
}

DialogComplexCron.propTypes = {
    classes: PropTypes.object,
    onClose: PropTypes.func,
    onOk: PropTypes.func.isRequired,
    title: PropTypes.string,
    cron: PropTypes.string,
    cancel: PropTypes.string,
    ok: PropTypes.string,
    simple: PropTypes.bool,
    language: PropTypes.string

};

export default withStyles(styles)(DialogComplexCron);
