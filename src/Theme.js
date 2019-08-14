const primaryColor = '#64b5f6';
const tileBorderRadius = 16;
const tileSize = 128;

export default {
    primaryColor,
    saveToolbar: {
        background: primaryColor,
        button: {
            borderRadius: 3,
            height: 32
        }
    },
    iconSize: 24,
    indicatorSize: 20,
    slider: {
        background: 'grey'
    },
    tile: {
        tile: {
            margin: 8,
            borderRadius: tileBorderRadius,
            padding: 16,
            transition: 'all 0.2s',
            width: tileSize,
            height: tileSize,
            position: 'relative',
            fontSize: 16,
            fontWeight: 'bold',
            boxSizing: 'border-box',
            userSelect: 'none',
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px',

            color: '#000000',
            background: '#FFFFFF',
        },
        tileCorner: {
            position: 'absolute',
            top: 0,
            right: 0,
            borderWidth: '0 16px 16px 0',
            borderStyle: 'solid',
            boxShadow: '0 1px 1px rgba(0,0,0,0.3), -1px 1px 1px rgba(0,0,0,0.2)',
            borderRadius: '0 0 0 10px',
            transition: 'border-width 0.1s ease-in-out',
            cursor: 'pointer',
            zIndex: 2,

            borderColor: 'rgba(173, 173, 173, 1) rgba(173, 173, 173, 1) rgb(212, 212, 212) rgb(193, 193, 193)',
            background: 'rgba(173, 173, 173, 1)',
        },
        tileCornerTouch: {
            borderWidth: '0 28px 28px 0',
        },
        tileOn: {
            opacity: 1,

            background: 'white'
        },
        tileOff: {
            opacity: 0.7,

            background: '#b7b6b6'
        },
        tileIconSvg: {
            size: 40, // 2.5rem
        },
        tileIcon: {
            width: 40, // 2.5rem
            height: 40,
            position: 'absolute',
            top: 14,
            left: 8,
            pointerEvents: 'none',

            color: '#2f3440'
        },
        tileName: {
            overflow: 'hidden',
            width: '100%',
            height: 37,
        },
        tileName2: {
            overflow: 'hidden',
            float: 'left'
        },
        tileNameSmall: {
            fontSize: 8,
        },
        tileText: {
            pointerEvents: 'none',
            bottom: 0,
            left: 0,
            width: 'calc(100% - 16px)',
            position: 'absolute',
            padding: '0 16px',
            height: 67
        },
        tileText2: {
            height: 32,
            bottom: 0,
            left: 0,
            width: 'calc(100% - 32px)',
            padding: '16px 16px 0 16px',
            pointerEvents: 'none',
            position: 'absolute',
        },
        tileNumber: {
            position: 'absolute',
            bottom: 30,
            right: 10,
            borderRadius: 20,
            opacity: 0.6,
            minWidth: 20,
            height: 19,
            paddingTop: 1,
            textAlign: 'center',

            color: 'white',
            background: 'rgb(45, 116, 249)'
        },
        tileState: {
            position: 'absolute',
            bottom: 10,
            left: 16,
            whiteSpace: 'nowrap',
            width: 'calc(100% - 32px)',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        tileState2: {
            float: 'right',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        tileStateOn: {
            fontSize: 14,

            color: '#515151'
        },
        tileStateOff: {
            fontSize: 14,

            color: '#515151'
        },
        tileIndicators: {
            position: 'absolute',
            top: 16,
            right: 16,
            whiteSpace: 'nowrap',
            //width: 'calc(100% - ' + tileIconWidth + 'px)'
        },
        tileIndicator: {
            width: 16,
            height: 16,
            float: 'right',
            display: 'inline-block'
        },
        tileIndicatorsIcons: {
            working:   '#808080',
            unreach:   'orange',
            lowbat:    'red',
            maintain:  'orange',
            error:     'red',
            direction: 'green',
            connected: 'red'
        },
        secondary: {
            icon: {
                display: 'inline-block',
                width: 12,
                height: 12
            },
            text: {
                display: 'inline-block',
                fontSize: 14,
                paddingLeft: 3
            },
            div: {
                position: 'absolute',
                top: 32,
                right: 16
            },
            button: {
                position: 'absolute',
                top: 16,
                right: 8
            }
        },
        editMode: {
            checkIcon: {
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50%',
                height: '100%',
                borderRadius: '0 ' + tileBorderRadius + ' ' + tileBorderRadius + ' 0',
                zIndex: 3,
                cursor: 'pointer',

                color: 'white',
                background: 'rgba(200,200,200,0.8)'
            },
            editIcon: {
                position: 'absolute',
                top: 0,
                right: '50%',
                width: '50%',
                height: '100%',
                borderRadius: tileBorderRadius + ' 0 0 ' + tileBorderRadius,
                zIndex: 3,
                cursor: 'pointer',

                color: 'white',
                background: 'rgba(200,200,200,0.8)'
            },
            removeIcon: {
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                borderRadius: tileBorderRadius,
                zIndex: 3,

                color: 'gray',
                background: 'rgba(80,80,80,0.8)'
            },
            buttonIcon: {
                paddingTop: tileSize / 2
            },
            buttonIconRemoved: {
                paddingTop: tileSize / 4
            },
            editEnabled: {
                backgroundColor: 'white',
                opacity: 1
            },
            editDisabled: {
                backgroundColor: 'white',
                opacity: 0.5
            },
        }
    },
    treeView: {
        depthOffset: 20
    },
    colors: {
        dark: {
            selected:           {
                color: '#000080',
                background: '#AAAAAA',
            },
            updateAvailable:    '#3fff3f',
            editActive:         '#FF0000',
            lampOn:             '#ffcc02',
            lampOff:            'inherit',
            instanceRunning:    '#52af19',
            instanceStopped:    '#7b3d29',
            browserBar:         '#3f51b5'
        },
        light: {
            selected:           {
                color: '#000080',
                background: '#DDDDDD',
            },
            updateAvailable:    '#3fff3f',
            editActive:         '#FF0000',
            lampOn:             '#ffcc02',
            lampOff:            'inherit',
            instanceRunning:    '#52af19',
            instanceStopped:    '#7b3d29',
            browserBar:         '#3f51b5'
        },
    }
}