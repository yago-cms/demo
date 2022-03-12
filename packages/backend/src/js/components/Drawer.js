import { faTimes } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

export const Drawer = ({ active, setActive, autoDetatch, push, heading, position, size, footer, children }) => {
    const handleKeyDown = useCallback(event => {
        if (event.keyCode === 27) {
            setActive(false);
        }
    });

    useEffect(() => {
        if (active) {
            document.addEventListener('keydown', handleKeyDown, false);
            document.body.classList.add('body--has-drawer');

            if (push) {
                document.body.classList.add(`body--drawer-${position}`);
                document.body.classList.add(`body--drawer-${size}`);
            }

            return () => {
                document.removeEventListener('keydown', handleKeyDown, false);
                document.body.classList.remove('body--has-drawer');

                if (push) {
                    document.body.classList.remove(`body--drawer-${position}`);
                    document.body.classList.remove(`body--drawer-${size}`);
                }
            }
        }
    }, [active]);

    return <>
        <div
            className={classNames('drawer', {
                'drawer--closed': !active,
                'drawer--open': active,
                'drawer--push': push,
                [`drawer--${position}`]: true,
                [`drawer--${size}`]: true,
            })}
        >
            <div className="drawer__header">
                {heading !== '' && <h5>{heading}</h5>}

                <div className="drawer__close" onClick={() => setActive(false)}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
            </div>

            <div className="drawer__body">
                {(active || !autoDetatch) && children}
            </div>

            {footer && <div className="drawer__footer">
                {footer}
            </div>}
        </div>

        <div className={classNames('drawer-backdrop', {
            'drawer-backdrop--closed': !active,
            'drawer-backdrop--open': active,
            'drawer-backdrop--push': push,
        })} onClick={() => setActive(false)}></div>
    </>
};

Drawer.propTypes = {
    heading: PropTypes.string,
    position: PropTypes.oneOf(['top', 'end', 'bottom', 'start']),
    size: PropTypes.oneOf(['small', 'medium', 'large', 'fullscreen']),
    push: PropTypes.bool,
    autoDetatch: PropTypes.bool,
};

Drawer.defaultProps = {
    position: 'end',
    size: 'small',
    autoDetatch: true,
    push: false,
};