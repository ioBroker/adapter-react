import {createMuiTheme} from '@material-ui/core/styles';
import Theme from './Theme';

export default type => {
    if (type === 'dark') {
        return createMuiTheme({
            palette: {
                type: type,
                primary: {
                    light: '#5F6975',
                    main: '#2978d0',
                    dark: '#053C72',
                    contrastText: '#CСС',
                },
                secondary: {
                    light: '#7EB2CC',
                    main: '#3399CC',
                    dark: '#068ACC',
                    contrastText: '#ee0000',
                },
                colors: {
                    updateAvailable:    '#3fff3f',
                    editActive:         '#FF0000',
                    lampOn:             '#ffcc02',
                    lampOff:            'inherit',
                    instanceRunning:    '#52af19',
                    instanceStopped:    '#7b3d29',
                    browserBar:         '#3f51b5'
                },
            }
        });
    } else {
        return createMuiTheme({
            palette: {
                type: type,
                primary: {
                    light: '#5F6975',
                    main: '#164477',
                    dark: '#053C72',
                    contrastText: '#FFF',
                },
                secondary: {
                    light: '#7EB2CC',
                    main: '#3399CC',
                    dark: '#068ACC',
                    contrastText: '#ee0000',
                },
                colors: {
                    updateAvailable:    '#3fff3f',
                    editActive:         '#FF0000',
                    lampOn:             '#ffcc02',
                    lampOff:            'inherit',
                    instanceRunning:    '#52af19',
                    instanceStopped:    '#7b3d29',
                    browserBar:         '#3f51b5'
                },
            }
        });

    }
}