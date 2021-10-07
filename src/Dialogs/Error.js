/**
 * Copyright 2018-2021 bluefox <dogafox@gmail.com>
 *
 * MIT License
 *
 **/
// please do not delete React, as without it other projects could not be compiled: ReferenceError: React is not defined
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import IconCheck from '@material-ui/icons/Check';

import I18n from '../i18n';

const styles = theme => ({
    titleBackground: {

    },
    titleColor: {

    }
});

/**
 * @typedef {object} DialogErrorProps
 * @property {string} [key] The key to identify this component.
 * @property {string} [title] The dialog title; default: Error (translated)
 * @property {string | JSX.Element} text The dialog text.
 * @property {() => void} [onClose] Close handler.
 * @property {{titleBackground: string; titleColor: string}} classes The styling class names.
 *
 * @extends {React.Component<DialogErrorProps>}
 */
class DialogError extends React.Component {
    handleOk() {
        this.props.onClose && this.props.onClose();
    };

    render() {
        return <Dialog
            open={true}
            maxWidth="sm"
            fullWidth={true}
            onClose={() => this.handleOk()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle className={this.props.classes.titleBackground}
                         classes={{root: this.props.classes.titleColor}}
                         id="alert-dialog-title">{this.props.title || I18n.t('ra_Error')}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {this.props.text || I18n.t('ra_Unknown error!')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={() => this.handleOk()} color="primary" autoFocus startIcon={<IconCheck />}>{I18n.t('ra_Ok')}</Button>
            </DialogActions>
        </Dialog>;
    }
}

DialogError.propTypes = {
    onClose: PropTypes.func,
    title: PropTypes.string,
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    icon: PropTypes.object
};

/** @type {typeof DialogError} */
const _export = withStyles(styles)(DialogError);
export default _export;
