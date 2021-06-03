import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {useDropzone} from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

import IconSelector from './IconSelector';
import Icon from './Icon';
import I18n from '../i18n';

/**
 * @typedef {object} IconPickerProps
 * @property {string} [value] The value.
 * @property {string} [label] The label.
 * @property {boolean} [disabled] Set to true to disable the icon picker.
 * @property {(icon: string) => void} onChange The icon change callback.
 * @property {import('../Connection').default} socket The socket connection.
 * @property {string} [imagePrefix] The image prefix (default: './files/')
 * @property {React.CSSProperties} [style] Additional styling for this component.
 * @property {string} [className] The CSS class name.
 *
 * @extends {React.Component<IconPickerProps>}
 */
let IconPicker = function (props) {
    let IconCustom = props.icon;

    const useStyles = makeStyles(theme => ({
        formContainer : {
            display: 'flex',
            justifyContent:'center',
            alignItems:'center'
        },
        formControl : {
            display: 'flex',
            padding: 24,
            flexGrow: 1000
        },
        divContainer: {
            width: 32 + 24,
            height: 32,
            whiteSpace: 'nowrap',
            lineHeight: '32px',
            marginRight: 8
        },
        dragField: {
            textAlign: 'center',
            display: 'inline-block',
            height: 90,
            width: 240,
            border: '2px dashed #777',
            borderRadius: 10,
            marginTop: 12,
            padding: 4
        },
        formIcon : {
            margin: 10,
            opacity: 0.6
        },
    }));

    const classes = useStyles();

    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();

        reader.addEventListener('load', () =>
            props.onChange(reader.result), false);

        if (acceptedFiles[0]) {
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return <div className={classes.formContainer}>
        {IconCustom ? <IconCustom className={ classes.formIcon }/> : null}
        <FormControl className={classes.formControl} style={{padding: 3}}>
            <InputLabel shrink>
                { props.t(props.label)}
            </InputLabel>
            <div className={ classes.formContainer }>
                {props.value ?
                    <div className={ classes.divContainer }>
                        <Icon alt="" className={props.previewClassName} src={props.value}/>
                        <IconButton
                            style={{verticalAlign: 'top'}}
                            size="small"
                            onClick={() => props.onChange('')}
                        >
                            <ClearIcon/>
                        </IconButton>
                    </div>
                    :
                    <IconSelector
                        icons={props.icons}
                        onlyRooms={props.onlyRooms}
                        onlyDevices={props.onlyDevices}
                        onSelect={base64 => props.onChange(base64)}
                        t={I18n.t}
                        lang={I18n.getLanguage()}
                    />
                }

                <div {...getRootProps()}
                     className={classes.dragField}
                     style={isDragActive ? {backgroundColor: 'rgba(0, 255, 0, 0.1)'} : {cursor: 'pointer'}}>
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <p>{I18n.t('ra_Drop the files here...')}</p> :
                            <p>{I18n.t(`ra_Drag 'n' drop some files here, or click to select files`)}</p>
                    }
                </div>
            </div>
        </FormControl>
    </div>;
};

IconPicker.propTypes = {
    previewClassName: PropTypes.string,
    icon: PropTypes.object,
    classes: PropTypes.object,
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,

    icons: PropTypes.array,
    onlyRooms: PropTypes.bool,
    onlyDevices: PropTypes.bool,
};

/** @type {typeof IconPicker} */
export default IconPicker;