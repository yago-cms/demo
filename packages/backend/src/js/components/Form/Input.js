import { forwardRef } from "react";
import classNames from "classnames";

export const Input = forwardRef(({ type = 'text', label, errors, ...rest }, ref) => {
    const { name } = rest;

    return (
        type == 'hidden'
            ? <input
                className={classNames('form-control', {
                    'is-invalid': _.get(errors, name)
                })}
                type={type}
                placeholder={label}
                id={name}
                ref={ref}
                {...rest}
            />
            : <div className="form-floating mb-3">
                <input
                    className={classNames('form-control', {
                        'is-invalid': _.get(errors, name)
                    })}
                    type={type}
                    placeholder={label}
                    id={name}
                    ref={ref}
                    {...rest}
                />

                <label htmlFor={name}>{label}</label>

                <div className="invalid-feedback">{_.get(errors, `${name}.message`)}</div>
            </div>
    );
});