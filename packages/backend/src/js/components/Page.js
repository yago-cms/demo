import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const Action = ({ action }) => {
    return (
        <Link className="btn btn-outline-secondary" to={action.path}>
            {action.icon && <FontAwesomeIcon icon={action.icon} />} {action.text && action.text}
        </Link>
    );
};

export const Page = ({ heading, subHeading, actions, footer, children }) => {
    return (
        <div className="page">
            <div className="page__header">
                <div className="btn-toolbar w-100">
                    {actions && <div className="btn-group me-3">
                        {actions.map((action, i) => <Action action={action} key={i} />)}
                    </div>}

                    {/* <div className="input-group me-3 ms-auto">
                        <div className="input-group-text">
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                        <input type="text" className="form-control" placeholder="Search..." />
                    </div> */}

                    {/* <div className="btn-group ms-auto">
                        <button className="btn btn-outline-secondary" type="button">Svenska</button>
                        <button className="btn btn-outline-secondary" type="button">English</button>
                    </div> */}
                </div>
            </div>

            <div className="page__body">
                {heading && <h1 className="page__heading">{heading}</h1>}
                {subHeading && <h2 className="page__sub-heading">{subHeading}</h2>}

                {children}
            </div>

            {footer && <div className="page__footer">
                {footer}
            </div>}
        </div>
    )
}