import React from 'react';
import PropTypes from 'prop-types';

const IconChannel = props => {
    return <svg onClick={e => props.onClick && props.onClick(e)} viewBox="0 0 320 320" width={props.width || 20} height={props.height || props.width || 20} xmlns="http://www.w3.org/2000/svg" className={ props.className }>
        <g fill="currentColor">
            <rect rx="32" id="svg_1" height="272" width="267" y="25" x="25" strokeWidth="15" stroke="currentColor" fill="none"/>
            <ellipse stroke="currentColor" ry="26" rx="26" id="svg_2" cy="248" cx="160" fill="none" strokeWidth="15"/>
            <line strokeLinecap="null" strokeLinejoin="null" id="svg_3" y2="201.94531" x2="159.5" y1="46.94531" x1="159.5" fillOpacity="null" strokeOpacity="null" strokeWidth="15" stroke="currentColor" fill="none"/>
            <rect id="svg_4" height="27" width="50" y="79.7979" x="133.5" fillOpacity="null" strokeOpacity="null" strokeWidth="15" stroke="currentColor" fill="#fff"/>
        </g>
    </svg>;
}

IconChannel.propTypes = {
    onClick: PropTypes.func,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string
};

export default IconChannel;