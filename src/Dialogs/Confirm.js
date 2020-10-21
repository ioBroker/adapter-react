/**
 * Copyright 2019 bluefox <dogafox@gmail.com>
 *
 * MIT License
 *
 **/

import {Component} from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import I18n from '../i18n';

/**
 * @typedef {object} DialogConfirmProps
 * @property {string} [key] The key to identify this component.
 * @property {string} [title] The dialog title; default: Are you sure? (translated)
 * @property {string} text The dialog text.
 * @property {string} [ok] The ok button text; default: OK (translated)
 * @property {string} [cancel] The cancel button text; default: Cancel (translated)
 * @property {(ok: boolean) => void} [onClose] Close handler.
 * 
 * @extends {Component<DialogConfirmProps>}
 */
class DialogConfirm extends Component {
    handleOk() {
        this.props.onClose && this.props.onClose(true);
    };

    handleCancel() {
        this.props.onClose && this.props.onClose(false);
    };

    render() {
        return <Dialog
            key={this.props.key}
            disableBackdropClick
            disableEscapeKeyDown
            open={true}
            maxWidth="md"
            fullWidth={true}
            onClose={() => this.handleCancel()}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
        >
            <DialogTitle id="confirmation-dialog-title">{this.props.title || I18n.t('ra_Are you sure?')}</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirmation-dialog-description">
                    {this.props.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.handleOk()} color="primary" autoFocus>{this.props.ok || I18n.t('ra_Ok')}</Button>
                <Button onClick={() => this.handleCancel()}>{this.props.cancel || I18n.t('ra_Cancel')}</Button>
            </DialogActions>
        </Dialog>;
    }
}

DialogConfirm.propTypes = {
    key: PropTypes.string,
    onClose: PropTypes.func,
    title: PropTypes.string,
    text: PropTypes.string,
    ok: PropTypes.string,
    cancel: PropTypes.string,
    icon: PropTypes.object
};

export default DialogConfirm;
