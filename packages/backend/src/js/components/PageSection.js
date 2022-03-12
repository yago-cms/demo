export const PageSection = ({ heading, footer, children }) => {
    return (
        <div className="page-section">
            {heading && <div className="page-section__header">
                <h2 className="page-section__heading">{heading}</h2>
            </div>}

            <div className="page-section__body">
                {children}
            </div>

            {footer && <div className="page-section__footer">
                {footer}
            </div>}
        </div>
    )
}