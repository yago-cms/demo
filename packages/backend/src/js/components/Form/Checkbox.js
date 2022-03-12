import { forwardRef } from "react";
import classNames from "classnames";

export const Checkbox = forwardRef(({ label, errors, ...rest }, ref) => {
    const { name } = rest;

    return (
        <div className="form-check mb-3">
            <input
                className={classNames('form-check-input', {
                    'is-invalid': _.get(errors, name)
                })}
                type="checkbox"
                placeholder={label}
                id={name}
                ref={ref}
                {...rest}
            />

            <label className="form-check-label" htmlFor={name}>{label}</label>

            <div className="invalid-feedback">{_.get(errors, `${name}.message`)}</div>
        </div>
    );
});