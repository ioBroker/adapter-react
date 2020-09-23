import React, {Component} from 'react';

import withStyles from '@material-ui/core/styles/withStyles';

import PropTypes from 'prop-types';
import Utils from './Utils';

import Grid from '@material-ui/core/Grid';

const styles = {
    root: {
        height: '100%',
        overflow: 'hidden'
    },
    overflowAuto: {
        overflow: 'auto'
    }
};

class TabContent extends Component {

    render() {

        const { classes } = this.props;

        return <Grid
            key={this.props.key}
            item
            className={ Utils.clsx(classes.root, {[classes.overflowAuto]: this.props.overflow === 'auto'}) }
        >
            { this.props.children }
        </Grid>;
    }
}

TabContent.propTypes = {
    key: PropTypes.string,
    overflow: PropTypes.string
};

export default withStyles(styles)(TabContent);