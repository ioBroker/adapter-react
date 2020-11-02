// please do not delete React, as without it other projects could not be compiled: ReferenceError: React is not defined
import React from 'react';
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

/**
 * @typedef {object} TabHeaderProps
 * @property {string} [key] The key to identify this component.
 *
 * @extends {React.Component<TabHeaderProps>}
 */
class TabHeader extends React.Component {

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