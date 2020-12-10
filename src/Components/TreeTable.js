import React from 'react';

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import { HexColorPicker as ColorPicker } from 'react-colorful';
import 'react-colorful/dist/index.css';

import Fab from '@material-ui/core/Fab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';

import IconEdit from '@material-ui/icons/Edit';
import IconDelete from '@material-ui/icons/Delete';
import IconExpand from '@material-ui/icons/NavigateNext';
import IconCollapse from '@material-ui/icons/ExpandMore';
import IconCheck from '@material-ui/icons/Check';
import IconClose from '@material-ui/icons/Close';
import IconAdd from '@material-ui/icons/Add';
import IconList from '@material-ui/icons/ViewHeadline';
import IconColor from '@material-ui/icons/Colorize';

import DialogSelectID from '../Dialogs/SelectID';
import Utils from './Utils';

function getAttr(obj, attr, lookup) {
    if (typeof attr === 'string') {
        attr = attr.split('.');
    }

    if (!obj) {
        return null;
    }

    if (attr.length === 1) {
        if (lookup && lookup[obj[attr[0]]]) {
            return lookup[obj[attr[0]]];
        } else {
            return obj[attr[0]];
        }
    } else {
        const name = attr.shift();
        return getAttr(obj[name], attr);
    }
}

function setAttr(obj, attr, value) {
    if (typeof attr === 'string') {
        attr = attr.split('.');
    }

    if (attr.length === 1) {
        return obj[attr[0]] = value;
    } else {
        const name = attr.shift();
        if (obj[name] === null || obj[name] === undefined) {
            obj[name] = {};
        }
        return setAttr(obj[name], attr, value);
    }
}

const styles = theme => ({
    tableContainer: {
        width: '100%',
        height: '100%',
        overflow: 'auto'
    },
    table: {
        width: '100%',
        minWidth: 800,
        maxWidth: 1920,
    },
    cell: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 4,
        paddingRight: 4,
    },
    rowMainWithChildren: {

    },
    rowMainWithoutChildren: {

    },
    rowNoEdit: {
        opacity: 0.3
    },
    cellExpand: {
        width: 30,
    },
    cellButton: {
        width: 30,
    },
    cellHeader: {
        fontWeight: 'bold',
        background: theme.palette.type === 'dark' ? '#888' : '#888',
        color: theme.palette.type === 'dark' ? '#EEE' : '#111',
        height: 48,
        wordBreak: 'break-word',
        whiteSpace: 'pre',
    },
    width_name_nicknames: {
        maxWidth: 150,
    },
    width_ioType: {
        maxWidth: 100,
    },
    width_type: {
        maxWidth: 100,
    },
    width_displayTraits: {
        maxWidth: 100,
    },
    width_roomHint: {
        maxWidth: 100,
    },
    rowSecondary: {
        fontStyle: 'italic',
    },
    cellSecondary: {
        fontSize: 10,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    fieldEditWithButton: {
        width: `calc(100% - 33px)`,
        display: 'inline-block',
    },
    fieldEdit: {
        width: `100%`,
        display: 'inline-block',
        lineHeight: '50px',
        verticalAlign: 'middle',
    },
    fieldButton: {
        width: 30,
        display: 'inline-block',
    },
    colorDialog: {
        overflow: 'hidden',
        padding: 15,
    }
});

function descendingComparator(a, b, orderBy, lookup) {
    const _a = getAttr(a, orderBy, lookup) || '';
    const _b = getAttr(b, orderBy, lookup) || '';

    if (_b < _a) {
        return -1;
    } else
    if (_b > _a) {
        return 1;
    } else {
        return 0;
    }
}

function getComparator(order, orderBy, lookup) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy, lookup)
        : (a, b) => -descendingComparator(a, b, orderBy, lookup);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order) {
            return order;
        } else {
            return a[1] - b[1];
        }
    });

    return stabilizedThis.map(el => el[0]);
}

class TreeTable extends React.Component {
    constructor(props) {
        super(props);

        let opened = window.localStorage.getItem(this.props.name || 'iob-table') || '[]';
        try {
            opened = JSON.parse(opened) || [];
        } catch (e) {
            opened = [];
        }
        if (!Array.isArray(opened)) {
            opened = [];
        }

        this.state = {
            opened,
            editMode: false,
            deleteMode: false,
            editData: null,
            order: 'asc',
            orderBy: this.props.columns[0].field,
            useTable: false,
        }
    }

    renderCellEdit(item, col) {
        let val = getAttr(item, col.field);
        if (Array.isArray(val)) {
            val = val[0];
        }

        if (col.lookup) {
            return this.renderCellEditSelect(item, col, val);
        } if (col.editComponent) {
            return this.renderCellEditCustom(item, col, val);
        } else {
            if (col.type === 'boolean' || (!col.type && typeof val === 'boolean')) {
                return this.renderCellEditBoolean(item, col, val);
            } else if (col.type === 'color') {
                return this.renderCellEditColor(item, col, val);
            } else if (col.type === 'oid') {
                return this.renderCellEditObjectID(item, col, val);
            } else {
                return this.renderCellEditString(item, col, val);
            }
        }
    }

    renderCellEditSelect(item, col, val) {
        return <Select
            onChange={e => {
                const editData = this.state.editData ? {...this.state.editData} : {};
                if (e.target.value === val) {
                    delete editData[col.field];
                } else {
                    editData[col.field] = e.target.value;
                }
                this.setState({editData});
            }}
            value={(this.state.editData && this.state.editData[col.field]) || val}
        >
            {Object.keys(col.lookup).map(v => <MenuItem value={v}>{col.lookup[v]}</MenuItem>)}
        </Select>;
    }

    renderCellEditString(item, col, val) {
        return <TextField
            className={this.props.classes.fieldEdit}
            fullWidth
            value={this.state.editData && this.state.editData[col.field] !== undefined ? this.state.editData[col.field] : val}
            onChange={e => {
                const editData = this.state.editData ? {...this.state.editData} : {};
                if (e.target.value === val) {
                    delete editData[col.field];
                } else {
                    editData[col.field] = e.target.value;
                }
                this.setState({editData});
            }}
        />;
    }

    renderCellEditCustom(item, col, val) {
        const EditComponent = col.editComponent;

        return <EditComponent
            value={val}
            rowData={item}
            onChange={newVal => {
                const editData = this.state.editData ? {...this.state.editData} : {};
                if (newVal === val) {
                    delete editData[col.field];
                } else {
                    editData[col.field] = newVal;
                }
                this.setState({editData});
            }}
        />;
    }

    renderCellEditBoolean(item, col, val) {
        return <Checkbox
            checked={this.state.editData && this.state.editData[col.field] !== undefined ? !!this.state.editData[col.field] : !!val}
            onChange={e => {
                const editData = this.state.editData ? {...this.state.editData} : {};
                if (e.target.checked === !!val) {
                    delete editData[col.field];
                } else {
                    editData[col.field] = e.target.checked;
                }
                this.setState({editData});
            }}
            inputProps={{ 'aria-label': 'checkbox' }}
        />;
    }

    renderSelectColorDialog() {
        return <Dialog
            classes={{root: this.props.classes.colorDialog, paper: this.props.classes.colorDialog}}
            onClose={() => {
                this.selectCallback = null;
                this.setState({showSelectColor: false});
            }}
            open={this.state.showSelectColor}>
            <ColorPicker
                color={this.state.selectIdValue}
                onChange={color => {
                    this.setState({selectIdValue: color}, () =>
                        this.selectCallback && this.selectCallback(color));
                }}
            />
        </Dialog>;
    }

    renderCellEditColor(item, col, val) {
        const _val = this.state.editData && this.state.editData[col.field] !== undefined ? this.state.editData[col.field] : val;
        return <div className={this.props.classes.fieldEdit}>
            <TextField
                fullWidth
                className={this.props.classes.fieldEditWithButton}
                value={_val}
                inputProps={{style: {backgroundColor: _val, color: Utils.isUseBright(_val, null) ? '#FFF' : '#000'}}}
                onChange={e => {
                    const editData = this.state.editData ? {...this.state.editData} : {};
                    if (e.target.value === val) {
                        delete editData[col.field];
                    } else {
                        editData[col.field] = e.target.value;
                    }
                    this.setState({editData});
                }}
            />

            <IconButton
                className={this.props.classes.fieldButton}
                contained
                onClick={() => {
                    this.selectCallback = newColor => {
                        const editData = this.state.editData ? {...this.state.editData} : {};
                        if (newColor === val) {
                            delete editData[col.field];
                        } else {
                            editData[col.field] = newColor;
                        }
                        this.setState({editData});
                    };

                    this.setState({showSelectColor: true, selectIdValue: val});
                }}
            ><IconColor/></IconButton>
        </div>;
    }

    renderSelectIdDialog() {
        if (this.state.showSelectId) {
            return <DialogSelectID
                key="tableSelect"
                imagePrefix="../.."
                dialogName={this.props.adapterName}
                themeType={this.props.themeType}
                socket={this.props.socket}
                statesOnly={true}
                selected={this.state.selectIdValue}
                onClose={() => this.setState({showSelectId: false})}
                onOk={(selected, name) => {
                    this.setState({showSelectId: false, selectIdValue: null});
                    this.selectCallback && this.selectCallback(selected);
                    this.selectCallback = null;
                }}
            />;
        } else {
            return null;
        }
    }

    renderCellEditObjectID(item, col, val) {
        return <div className={this.props.classes.fieldEdit}>
            <TextField
                fullWidth
                className={this.props.classes.fieldEditWithButton}
                value={this.state.editData && this.state.editData[col.field] !== undefined ? this.state.editData[col.field] : val}
                onChange={e => {
                    const editData = this.state.editData ? {...this.state.editData} : {};
                    if (e.target.value === val) {
                        delete editData[col.field];
                    } else {
                        editData[col.field] = e.target.value;
                    }
                    this.setState({editData});
                }}
            />

            <IconButton
                className={this.props.classes.fieldButton}
                contained
                onClick={() => {
                    this.selectCallback = selected => {
                        const editData = this.state.editData ? {...this.state.editData} : {};
                        if (selected === val) {
                            delete editData[col.field];
                        } else {
                            editData[col.field] = selected;
                        }
                        this.setState({editData});
                    };

                    this.setState({showSelectId: true, selectIdValue: val});
                }}
            ><IconList/></IconButton>
        </div>;
    }

    renderCell(item, col, level, i) {
        if (this.state.editMode === i && col.editable !== 'never' && col.editable !== false) {
            return <TableCell
                key={col.field}
                className={clsx(this.props.classes.cell, level && this.props.classes.cellSecondary)}
                style={col.cellStyle}
                component="th"
            >
                {this.renderCellEdit(item, col)}
            </TableCell>;
        } else {
            return <TableCell
                key={col.field}
                className={clsx(this.props.classes.cell, level && this.props.classes.cellSecondary)}
                style={col.cellStyle}
                component="th" >{getAttr(item, col.field, col.lookup)}</TableCell>;
        }
    }

    renderLine(item, level) {
        level = level || 0;
        const i = this.props.data.indexOf(item);
        if (!item) {
            return null;
        }
        if (!level && item.parentId) {
            return null;
        } else if (level && !item.parentId) {
            return null; // should never happens
        } else {
            // try to find children
            const children = this.props.data.filter(it => it.parentId === item.id);
            const opened = this.state.opened.includes(item.id);

            return [
                <TableRow
                    key={item.id}
                    className={clsx(
                        this.props.classes.row,
                        level  && this.props.classes.rowSecondary,
                        !level && children.length && this.props.classes.rowMainWithChildren,
                        !level && !children.length && this.props.classes.rowMainWithoutChildren,
                        this.state.editMode !== false && this.state.editMode !== i && this.props.classes.rowNoEdit,
                        this.state.deleteMode !== false && this.state.deleteMode !== i && this.props.classes.rowNoEdit,
                    )}
                >
                    <TableCell className={clsx(this.props.classes.cell, this.props.classes.cellExpand, level && this.props.classes.cellSecondary)}>
                        {children.length ? <IconButton onClick={() => {
                            const opened = [...this.state.opened];
                            const pos = opened.indexOf(item.id);
                            if (pos === -1) {
                                opened.push(item.id);
                                opened.sort();
                            } else {
                                opened.splice(pos, 1);
                            }

                            window.localStorage.setItem(this.props.name || 'iob-table', JSON.stringify(opened));

                            this.setState({opened});
                        }}>
                            {opened ? <IconCollapse/> : <IconExpand/>}
                        </IconButton>  : null}
                    </TableCell>
                    <TableCell scope="row"
                               className={clsx(this.props.classes.cell, level && this.props.classes.cellSecondary)}
                               style={this.props.columns[0].cellStyle}>
                        {getAttr(item, this.props.columns[0].field, this.props.columns[0].lookup)}
                    </TableCell>

                    {this.props.columns.map((col, ii) =>
                        !ii && !col.hidden ? null : this.renderCell(item, col, level, i))}

                    {this.props.onUpdate ? <TableCell className={clsx(this.props.classes.cell, this.props.classes.cellButton)}>
                        {this.state.editMode === i || this.state.deleteMode === i ?
                            <IconButton
                                disabled={this.state.editMode !== false && (!this.state.editData || !Object.keys(this.state.editData).length)}
                                onClick={() => {
                                    if (this.state.editMode !== false) {
                                        const newData = JSON.parse(JSON.stringify(item));
                                        Object.keys(this.state.editData).forEach(attr => setAttr(newData, attr, this.state.editData[attr]));
                                        this.setState({editMode: false}, () => this.props.onUpdate(newData, item))
                                    } else {
                                        this.setState({deleteMode: false}, () => this.props.onDelete(item))
                                    }
                                }}>
                                <IconCheck/>
                            </IconButton>
                            :
                            <IconButton
                                disabled={this.state.editMode !== false}
                                onClick={() => this.setState({editMode: i, editData: null})}>
                                <IconEdit/>
                            </IconButton>}
                    </TableCell> : null}
                    {this.props.onDelete ? <TableCell className={clsx(this.props.classes.cell, this.props.classes.cellButton)}>
                        {this.state.editMode === i || this.state.deleteMode === i ?
                            <IconButton onClick={() => this.setState({editMode: false, deleteMode: false})}>
                                <IconClose/>
                            </IconButton>
                            :
                            <IconButton
                                disabled={this.state.deleteMode !== false}
                                onClick={() => this.setState({deleteMode: i})}>
                                <IconDelete/>
                            </IconButton>
                        }
                    </TableCell> : null}
                </TableRow>,
                !level && this.state.opened.includes(item.id) ? children.map(item => this.renderLine(item, level + 1)) : null,
            ];
        }
    }

    handleRequestSort(property) {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({order: isAsc ? 'desc' : 'asc', orderBy: property});
    }

    renderHead() {
        return <TableHead>
            <TableRow key="headerRow">
                <TableCell
                    component="th"
                    className={clsx(this.props.classes.cell, this.props.classes.cellHeader, this.props.classes.cellExpand)}
                />
                <TableCell
                    component="th"
                    className={clsx(this.props.classes.cell, this.props.classes.cellHeader, this.props.classes['width_' + this.props.columns[0].field.replace(/\./g, '_')])}
                    style={this.props.columns[0].headerStyle || this.props.columns[0].cellStyle}
                    sortDirection={this.state.orderBy === this.props.columns[0].field ? this.state.order : false}
                >
                    <TableSortLabel
                        active={this.state.orderBy === this.props.columns[0].field}
                        direction={this.state.orderBy === this.props.columns[0].field ? this.state.order : 'asc'}
                        onClick={() => this.handleRequestSort(this.props.columns[0].field)}
                    >
                        {this.props.columns[0].title || this.props.columns[0].field}
                        {this.state.orderBy === this.props.columns[0].field ?
                            <span className={this.props.classes.visuallyHidden}>
                                {this.state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span> : null}
                    </TableSortLabel>
                </TableCell>
                {this.props.columns.map((col, i) =>
                    !i && !col.hidden ? null : <TableCell
                        key={col.field}
                        className={clsx(this.props.classes.cell, this.props.classes.cellHeader, this.props.classes['width_' + col.field.replace(/\./g, '_')])}
                        style={col.headerStyle || col.cellStyle}
                        component="th"
                    >
                        <TableSortLabel
                            active={this.state.orderBy === col.field}
                            direction={this.state.orderBy === col.field ? this.state.order : 'asc'}
                            onClick={() => this.handleRequestSort(col.field)}
                        >
                            {col.title || col.field}
                            {this.state.orderBy === col.field ?
                                <span className={this.props.classes.visuallyHidden}>
                                    {this.state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span> : null}
                        </TableSortLabel>
                    </TableCell>)}
                {this.props.onUpdate ? <TableCell component="th" className={clsx(this.props.classes.cell, this.props.classes.cellHeader, this.props.classes.cellButton)}>
                    <Fab
                        color="primary"
                        size="small"
                        disabled={this.state.editMode !== false}
                        onClick={() => this.props.onUpdate(true)}>
                        <IconAdd/>
                    </Fab>
                </TableCell> : null}
                {this.props.onDelete ? <TableCell component="th" className={clsx(this.props.classes.cell, this.props.classes.cellHeader, this.props.classes.cellButton)}/> : null}
            </TableRow>
        </TableHead>;
    }

    render() {
        const lookup = this.props.columns.find(col => col.field === this.state.orderBy).lookup;
        const table = stableSort(this.props.data, getComparator(this.state.order, this.state.orderBy, lookup));

        return <div className={clsx(this.props.classes.tableContainer, this.props.className)}>
            <Table className={this.props.classes.table} aria-label="simple table" size="small" stickyHeader={true}>
                {this.renderHead()}
                <TableBody>
                    {table.map(item => this.renderLine(item))}
                </TableBody>
            </Table>
            {this.renderSelectIdDialog()}
            {this.renderSelectColorDialog()}
        </div>;
    }
}
/*
const columns = [
    {
        title: 'Name of field', // required, else it will be "field"
        field: 'fieldIdInData', // required
        editable: false,        // or true [default - true]
        cellStyle: {            // CSS style - // optional
            maxWidth: '12rem',
            overflow: 'hidden',
            wordBreak: 'break-word'
        },
        lookup: {               // optional => edit will be automatically "SELECT"
            'value1': 'text1',
            'value2': 'text2',
        }
    },
    {
        title: 'Type',          // required, else it will be "field"
        field: 'myType',        // required
        editable: true,         // or true [default - true]
        lookup: {               // optional => edit will be automatically "SELECT"
            'number': 'Number',
            'string': 'String',
            'boolean': 'Boolean',
        },
        type: 'number/string/color/oid/icon/boolean', // oid=ObjectID,icon=base64-icon
        editComponent: props =>
            <div>Prefix&#123; <br/>
                <textarea
                    rows={4}
                    style={{width: '100%', resize: 'vertical'}}
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                />
                Suffix
            </div>,
    },
];
*/
/* const data = [
    {
        id: 'UniqueID1' // required
        fieldIdInData: 'Name1',
        myType: 'number',
    },
    {
        id: 'UniqueID2' // required
        fieldIdInData: 'Name12',
        myType: 'string',
    },
];
 */

/*
// STYLES
const styles = theme => ({
    tableDiv: {
        width: '100%',
        overflow: 'hidden',
        height: 'calc(100% - 48px)',
    },
});
// renderTable
renderTable() {
    return <div className={this.props.classes.tableDiv}>
        <TreeTable
            columns={this.columns}
            data={lines}
            onUpdate={(newData, oldData) => console.log('Update: ' + JSON.stringify(newData))}
            onDelete={oldData => console.log('Delete: ' + JSON.stringify(oldData))}
        />
    </div>;
}
 */

TreeTable.propTypes = {
    data: PropTypes.array.isRequired,
    className: PropTypes.string,
    loading: PropTypes.bool,
    name: PropTypes.string, // name of table to save settings in localStorage
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            cellStyle: PropTypes.object,
            editComponent: PropTypes.element,
            field: PropTypes.string,
            headerStyle: PropTypes.object,
            hidden: PropTypes.bool,
            lookup: PropTypes.object,
            editable: PropTypes.bool,
            title: PropTypes.string,
            type: PropTypes.oneOf([
                'string',
                'boolean',
                'numeric',
                'icon', // todo: not yet implemented
                'oid',
                'color',
            ]),
        })
    ).isRequired,
    noSort: PropTypes.bool, // todo
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    themeType: PropTypes.string,
    socket: PropTypes.object // only if oid type is used
};

export default withStyles(styles)(TreeTable);

