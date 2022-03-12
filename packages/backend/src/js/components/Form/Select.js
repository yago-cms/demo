import { forwardRef } from "react";
import classNames from "classnames";

export const Select = forwardRef(({ label, options, errors, ...rest }, ref) => {
    const { name } = rest;

    return (
        <div className="form-floating mb-3">
            <select
                className={classNames('form-select', {
                    'is-invalid': _.get(errors, name)
                })}
                id={name}
                ref={ref}
                {...rest}
            >
                {options.map((option, index) => <option value={option.value} key={index}>{option.label}</option>)}
            </select>

            <label htmlFor={name}>{label}</label>

            <div className="invalid-feedback">{_.get(errors, `${name}.message`)}</div>
        </div>
    );
});