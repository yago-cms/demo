import { faFileAlt } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { forwardRef, useState } from "react";
import { Drawer } from "../Drawer";
import { PageTree } from "../PageTree";

export const SelectPage = forwardRef(({ type = 'text', label, errors, setValue, ...rest }, ref) => {
    const [drawerActive, setDrawerActive] = useState();

    const { name } = rest;

    const handleSelectPage = (id) => {
        setValue(name, id);
        setDrawerActive(false);
    };

    return (
        <>
            <div className="input-group mb-3">
                <span className="input-group-text">
                    <FontAwesomeIcon icon={faFileAlt} size="lg" />
                </span>

                <div className="form-floating flex-grow-1">
                    <input
                        className={classNames('form-control', {
                            'is-invalid': _.get(errors, name)
                        })}
                        type={type}
                        placeholder={label}
                        id={name}
                        ref={ref}
                        {...rest}
                        onClick={() => { setDrawerActive(true) }}
                    />
                    <label htmlFor={name}>{label}</label>

                    <div className="invalid-feedback">{_.get(errors, `${name}.message`)}</div>
                </div>
            </div>

            <Drawer
                active={drawerActive}
                setActive={setDrawerActive}
                heading="Select page"
            >
                <PageTree
                    onSelectPage={handleSelectPage}
                />
            </Drawer>
        </>
    );
});