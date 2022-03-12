import { faCogs, faFile, faImages, faSquare, faTachometer } from "@fortawesome/pro-duotone-svg-icons";


export default [
    {
        name: 'Dashboard',
        icon: faTachometer,
        route: '/'
    },
    {
        name: 'Pages',
        icon: faFile,
        route: '/pages'
    },
    {
        name: 'Fields',
        icon: faSquare,
        route: '/fields'
    },
    {
        name: 'Files',
        icon: faImages,
        route: '/files'
    },
    {
        name: 'Settings',
        icon: faCogs,
        route: '/settings'
    },
];