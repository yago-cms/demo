export const PageCard = ({ header, footer, children }) => {
    return (
        <div className="page-card">
            {header && <div className="page-card__header">
                {header}
            </div>}

            <div className="page-card__body">
                {children}
            </div>

            {footer && <div className="page-card__footer">
                {footer}
            </div>}
        </div>
    );
};