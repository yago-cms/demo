import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = ({ name }) => {
    return (
        <th>
            {name}
        </th>
    );
}

const Row = ({ item, columns }) => {
    return (
        <tr className="data-grid__row">
            {columns.map((column, i) => <Item item={item} column={column} key={i} />)}
        </tr>
    );
}

const Item = ({ item, column }) => {
    const { actions } = column;
    let value = '';

    if (column.field && column.field in item) {
        value = item[column.field];
    }

    return (
        <td>
            {actions ? <Actions item={item} actions={actions} /> : value}
        </td>
    );
}

const Actions = ({ item, actions }) => {
    return (
        <div className="btn-group">
            {actions.map((action, i) => <button
                type="button"
                className="btn btn-outline-secondary"
                key={i}
                onClick={(event) => action.onClick(event, item)}
            >
                {action.icon && <FontAwesomeIcon icon={action.icon} />} {action.text && action.text}
            </button>)}
        </div >
    );
};

export const Table = ({ heading, columns, data, options }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    {columns.map((column, i) => <Header name={column.name} key={i} />)}
                </tr>
            </thead>

            <tbody>
                {data.map((item, i) => <Row item={item} columns={columns} key={i} />)}
            </tbody>
        </table>
    );
}