import classNames from "classnames";
import PropTypes from "prop-types";

const Spinner = ({ size }) => {
    return (
        <div
            className={classNames('spinner-border text-primary', {
                'spinner-border-sm': size === 'small'
            })}
            role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    );
};

export const Loading = ({ isInline, size }) => {

    return (
        <>
            {!isInline
                ? <div className="d-flex justify-content-center m-3">
                    <Spinner size={size} />
                </div>
                : <Spinner size={size} />
            }
        </>
    );
};

Loading.propTypes = {
    isInline: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'default']),
};

Loading.defaultProps = {
    isInline: false,
    size: 'default',
};