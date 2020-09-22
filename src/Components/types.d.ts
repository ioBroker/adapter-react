import { Width } from '../types';
import Connection from '../Connection';
import Router from './Router';

export interface ObjectBrowserTableFilter {
    id?: string;
    name?: string;
    room?: string;
    func?: string;
    role?: string;
    expertMode?: boolean;
}

export type ObjectBrowserColumn = 'name' | 'type' | 'role' | 'room' | 'func' | 'val' | 'buttons';

export interface ObjectBrowserCustomFilter {
    type: string;
    common: { custom: string | boolean; };
}

export type ObjectBrowserType = 'state' | 'instance' | 'channel';

export interface ObjectBrowserProps {
    /** The title of the dialog. */
    title: string;
    /** The key to store state in the browser (default: 'App') */
    key?: string;
    /** The CSS classes. */
    classes: Record<string, any>;
    /** Default filters to be applied to the object table. */
    defaultFilters?: ObjectBrowserTableFilter;
    /** The selected ID or IDs. */
    selected?: string | string[];
    /** Callback when object is selected. */
    onSelect?: (selectedItems: string[], name: string, isDouble?: boolean) => void;
    /** The socket connection. */
    socket: Connection;
    /** Show the expert button? */
    showExpertButton?: boolean;
    /** Is expert mode enabled? (default: false) */
    expertMode?: boolean;
    /** Prefix (default: '.') */
    prefix?: string;
    /** Theme name. */
    themeName?: string;
    /** Translation function. */
    t: (key: string) => string;
    /** The selected language. */
    lang: ioBroker.Languages;
    /** Allow to select multiple objects? (default: false) */
    multiSelect?: boolean;
    /** Can't objects be edited? (default: false) */
    notEditable?: boolean;
    /** Show folders first? (default: false) */
    foldersFirst?: boolean;
    /** Disable the column selector? (default: false) */
    disableColumnSelector?: boolean;
    /** The custom dialog React component to use */
    objectCustomDialog?: any;
    /** Custom filter. Optional {common: {custom: true}} or {common: {custom: 'sql.0'}} */
    customFilter?: ObjectBrowserCustomFilter;
    /** Custom value React component to use */
    objectBrowserValue?: any;
    /** Custom object editor React component to use */
    objectBrowserEditObject?: any;
    /** Router */
    router?: Router;
    /** Object types to show */
    types?: ObjectBrowserType[];
    /** Columns to display */
    columns?: ObjectBrowserColumn[];
    /** The width of the dialog. */
    width?: Width;
}
