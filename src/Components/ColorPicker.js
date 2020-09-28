/**
 * Copyright 2018-2020 bluefox <dogafox@gmail.com>
 *
 * Licensed under the Creative Commons Attribution-NonCommercial License, Version 4.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://creativecommons.org/licenses/by-nc/4.0/legalcode.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import React from 'react';
import {ChromePicker} from 'react-color';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import IconDelete from '@material-ui/icons/Delete';

const styles = theme => ({
    color: {
        width: 36,
        height: 14,
        borderRadius: 2,
    },
    delButton: {
        //width: 32,
        //height: 32,
        marginTop: 16,
    },
    swatch: {
        marginTop: 16,
        padding: 5,
        background: '#fff',
        borderRadius: 1,
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
        verticalAlign: 'middle'
    },
    popover: {
        position: 'absolute',
        zIndex: 2,
    },
    cover: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    textDense: {
        marginTop: 0,
        marginBottom: 0,
    }
});

class ColorPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false,
            color: this.props.color,
        };
    }

    static getDerivedStateFromProps(props, state) {
        const pColor = ColorPicker.getColor(props.color);
        const sColor = ColorPicker.getColor(state.color);
        if (pColor !== sColor) {
            return {color: props.color}
        } else {
            return null;
        }
    }

    handleClick = () => {
        this.setState({displayColorPicker: !this.state.displayColorPicker});
    };

    handleClose = () => {
        this.setState({displayColorPicker: false});
    };

    static getColor(color, isHex) {
        if (color && typeof color === 'object') {
            if (color.rgb) {
                if (isHex) {
                    return '#' + color.rgb.r.toString(16).padStart(2, '0') + color.rgb.g.toString(16).padStart(2, '0') + color.rgb.b.toString(16).padStart(2, '0');
                } else {
                    return 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
                }
            } else {
                if (isHex) {
                    return '#' + color.r.toString(16).padStart(2, '0') + color.g.toString(16).padStart(2, '0') + color.b.toString(16).padStart(2, '0');
                } else {
                    return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
                }
            }
        } else {
            return isHex ? ColorPicker.rgb2hex(color || '') : color || '';
        }
    }

    static rgb2hex(rgb){
        const m = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

        return m && m.length === 4 ? '#' +
            parseInt(m[1],10).toString(16).padStart(2, '0') +
            parseInt(m[2],10).toString(16).padStart(2, '0') +
            parseInt(m[3],10).toString(16).padStart(2, '0') : rgb;
    }

    handleChange = color => {
        this.setState({color});
        this.props.onChange && this.props.onChange(ColorPicker.getColor(color));
    };

    render() {
        const color = ColorPicker.getColor(this.state.color);
        let style = {};
        if (this.state.displayColorPicker && this.props.openAbove) {
            style = {
                top: -241,
            }
        }
        return <div
            key={this.props.key}
            style={Object.assign({}, this.props.style || {}, {position: 'relative'})}
            className={ this.props.className || ''}
        >
            <TextField
                disabled={this.props.disabled}
                id="name"
                style={{width: 'calc(100% - 80px)'}}
                label={this.props.name || 'color'}
                value={color}
                margin="dense"
                classes={{root: this.props.classes.textDense}}
                onChange={e => this.handleChange(e.target.value)}
            />
            <IconButton
                disabled={this.props.disabled}
                onClick={() => this.handleChange('')}
                size="small"
                className={this.props.classes.delButton}
                style={color ? {} : {opacity: 0, cursor: 'default'}}
            ><IconDelete/></IconButton>
            <div className={this.props.classes.swatch} onClick={() => this.handleClick()}>
                <div className={this.props.classes.color}
                     style={{background: color}} />
            </div>
            { this.state.displayColorPicker && !this.props.disabled ? <div className={this.props.classes.popover} style={style}>
                <div className={this.props.classes.cover} onClick={() => this.handleClose()}/>
                <ChromePicker color={ this.state.color } onChangeComplete={color => this.handleChange(color)} />
            </div> : null }
        </div>
    }
}

ColorPicker.propTypes = {
    key: PropTypes.string,
    disabled: PropTypes.bool,
    color: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    openAbove: PropTypes.bool,
};

export default withStyles(styles)(ColorPicker);
