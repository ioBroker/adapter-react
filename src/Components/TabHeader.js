import {Component} from 'react';
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

/**
 * @typedef {object} TabHeaderProps
 * @property {string} [key] The key to identify this component.
 * 
 * @extends {Component<TabHeaderProps>}
 */
class TabHeader extends Component {

    render() {
        return <Grid
            key={this.props.key}
            item
            container
            alignItems="center"
        >
            { this.props.children }
        </Grid>;
    }
}

TabHeader.propTypes = {
    key: PropTypes.string,
};

export default TabHeader;