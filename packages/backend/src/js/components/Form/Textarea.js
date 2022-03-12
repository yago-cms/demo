import { forwardRef } from "react";
import classNames from "classnames";

export const Textarea = forwardRef(({ label, errors, ...rest }, ref) => {
    return (
        <div className="form-floating mb-3">
            <textarea
                className={classNames('form-control', {
                    'is-invalid': _.get(errors, name)
                })}
                placeholder={label}
                id={name}
                ref={ref}
                {...rest}
            ></textarea>

            <label htmlFor={name}>{label}</label>

            <div className="invalid-feedback">{_.get(errors, `${name}.message`)}</div>
        </div>
    );
});