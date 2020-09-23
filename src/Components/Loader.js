/**
 * Copyright 2018-2020 bluefox <dogafox@gmail.com>
 *
 * MIT License
 *
 **/
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import './loader.css'

const styles = theme => ({

});

class Loader extends React.Component {
    constructor(props) {
        super(props);
        this.size = this.props.size || 234;
    }

    render() {
        const theme = this.props.themeType || this.props.theme || 'light';
        return <div key={this.props.key} className={'logo-back logo-background-' + theme}>
            <div className="logo-div" style={{width: this.size, height: this.size}}>
                <div className={'logo-top logo-background-' + theme} style={{left: '37%'}}/>
                <div className={'logo-top logo-background-' + theme} style={{left: '57%'}}/>
                <div
                    className={'logo-border logo-background-' + theme + ' logo-animate-wait'}
                    style={{borderWidth: this.size * 0.132}}
                />
                <div className={'logo-i logo-animate-color-inside-' + theme}/>
                <div className={'logo-i-top logo-animate-color-inside-' + theme} style={{top: '18%'}}/>
                <div className={'logo-i-top logo-animate-color-inside-' + theme} style={{bottom: '18%'}}/>
            </div>
            <div className={'logo-animate-grow logo-animate-grow-' + theme}
                 style={{width: this.size + 11, height: this.size + 11}}
            />
        </div>;
    }
}

Loader.propTypes = {
    key: PropTypes.string,
    size: PropTypes.number,
    themeType: PropTypes.string
};

export default withStyles(styles)(Loader);

