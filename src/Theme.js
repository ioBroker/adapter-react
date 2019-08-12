const primaryColor = '#64b5f6';
const tileBorderRadius = 16;
const tileSize = 128;

export default {
    primaryColor,
    type: 'light',
    saveToolbar: {
        background: primaryColor,
        button: {
            borderRadius: 3,
            height: 32
        }
    },
    palette: {
        /*primary1Color:      blue700,
        primary2Color:      blue600,
        primary3Color:      grey600,
        accent1Color:       grey500,
        accent2Color:       grey400,
        accent3Color:       grey100,
        textColor:          fullWhite,
        secondaryTextColor: fade(fullWhite, 0.7),
        alternateTextColor: '#303030',
        canvasColor:        '#303030',
        borderColor:        fade(fullWhite, 0.3),
        disabledColor:      fade(fullWhite, 0.3),
        pickerHeaderColor:  fade(fullWhite, 0.12),
        clockCircleColor:   fade(fullWhite, 0.12),*/
        textColorBright:    'white',
        textColorDark:      'black',
        updateAvailable:    '#3fff3f',
        editActive:         'red',
        lampOn:             '#ffcc02',
        lampOff:            'inherit',
        instanceRunning:    '#52af19',
        instanceStopped:    '#7b3d29',
        browserBar:         '#3f51b5'
    },
    colors: {
        primary: '#3399CC',
        secondary: '#164477',
        selected: {
            background: '#164477',
            color: 'white'
        },
        error: {
            background: '#dc0300',
            color: '#FFFFFF'
        }
    },
    iconSize: '24px',
    indicatorSize: '20px',
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
            color: 'black',
            background: 'white',
            boxSizing: 'border-box',
            userSelect: 'none',
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px'
        },
        tileCorner: {
            position: 'absolute',
            top: 0,
            right: 0,
            borderWidth: '0 16px 16px 0',
            borderStyle: 'solid',
            borderColor: 'rgba(173, 173, 173, 1) rgba(173, 173, 173, 1) rgb(212, 212, 212) rgb(193, 193, 193)',
            background: 'rgba(173, 173, 173, 1)',
            boxShadow: '0 1px 1px rgba(0,0,0,0.3), -1px 1px 1px rgba(0,0,0,0.2)',
            borderRadius: '0 0 0 10px',
            transition: 'border-width 0.1s ease-in-out',
            cursor: 'pointer',
            zIndex: 2
        },
        tileCornerTouch: {
            borderWidth: '0 28px 28px 0',
        },
        tileOn: {
            background: 'white',
            opacity: 1
        },
        tileOff: {
            background: '#b7b6b6',
            opacity: 0.7
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
            color: '#2f3440',
            pointerEvents: 'none'
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
            background: 'rgb(45, 116, 249)',
            opacity: 0.6,
            minWidth: 20,
            height: 19,
            paddingTop: 1,
            color: 'white',
            textAlign: 'center'
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
            color: '#515151',
            fontSize: 14
        },
        tileStateOff: {
            color: '#515151',
            fontSize: 14
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
                background: 'rgba(200,200,200,0.8)',
                color: 'white',
                borderRadius: '0 ' + tileBorderRadius + ' ' + tileBorderRadius + ' 0',
                zIndex: 3,
                cursor: 'pointer'
            },
            editIcon: {
                position: 'absolute',
                top: 0,
                right: '50%',
                width: '50%',
                height: '100%',
                background: 'rgba(200,200,200,0.8)',
                color: 'white',
                borderRadius: tileBorderRadius + ' 0 0 ' + tileBorderRadius,
                zIndex: 3,
                cursor: 'pointer'
            },
            removeIcon: {
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(80,80,80,0.8)',
                color: 'gray',
                borderRadius: tileBorderRadius,
                zIndex: 3
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
    menu: {
        depthOffset: 20
    },
}