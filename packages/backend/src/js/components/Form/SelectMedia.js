import { useQuery } from "@apollo/client";
import { faPhotoVideo } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { forwardRef, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { GET_SETTINGS } from "../../queries";
import { Drawer } from "../Drawer";
import { Error } from "../Error";
import { FileManager } from "../FileManager";
import { Loading } from "../Loading";

/**
 * TODO: fix input validation: https://github.com/twbs/bootstrap/pull/34527
 */

export const SelectMedia = forwardRef(({ label, handleDelete, isBreakpointsEnabled, register, errors, setValue, control, ...rest }, ref) => {
    const [breakpointGroups, setBreakpointGroups] = useState(null);

    const { name } = rest;

    const getSettingsResult = useQuery(GET_SETTINGS, {
        variables: {
            id: 'media',
        }
    });

    const isLoading = getSettingsResult.loading;
    const error = getSettingsResult.error;

    useEffect(() => {
        if (getSettingsResult.loading === false && getSettingsResult.data) {
            const { breakpointGroups } = JSON.parse(getSettingsResult.data.settings.value);

            setBreakpointGroups(breakpointGroups);
        }
    }, [getSettingsResult.loading, getSettingsResult.data]);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    let defaultValue = '';

    if (isBreakpointsEnabled) {
        defaultValue = {
            source: '',
            breakpointGroup: 'default',
        };
    }

    return (
        <>
            <Controller
                control={control}
                name={name}
                defaultValue={defaultValue}
                render={({ field: { onChange, value } }) => {
                    const [drawerActive, setDrawerActive] = useState();
                    const handleSelectMedia = (path) => {
                        setDrawerActive(false);

                        if (isBreakpointsEnabled) {
                            onChange({
                                source: path,
                                breakpointGroup: value.breakpointGroup,
                            });
                        } else {
                            onChange(path);
                        }
                    };

                    return (
                        <>
                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faPhotoVideo} size="lg" />
                                </span>

                                <div className="form-floating flex-grow-1">
                                    <input
                                        className={classNames('form-control', {
                                            'is-invalid': _.get(errors, name)
                                        })}
                                        type="text"
                                        value={isBreakpointsEnabled ? value.source : value}
                                        id="source"
                                        placeholder={label}
                                        onClick={() => { setDrawerActive(true) }}
                                        onChange={() => { }}
                                    />
                                    <label htmlFor={name}>{label}</label>

                                    <div className="invalid-feedback">{_.get(errors, `${name}.message`)}</div>
                                </div>

                                {isBreakpointsEnabled && <div className="form-floating flex-grow-1">
                                    <select
                                        className="form-select"
                                        id="breakpoint"
                                        value={value.breakpointGroup}
                                        onChange={(e) => {
                                            onChange({
                                                source: value.source,
                                                breakpointGroup: e.target.value,
                                            });
                                        }}
                                    >
                                        {breakpointGroups && breakpointGroups.map((breakpointGroup, index) => <option value={breakpointGroup.key} key={index}>{breakpointGroup.name}</option>
                                        )}
                                    </select>

                                    <label htmlFor="breakpoint">Breakpoint</label>
                                </div>}
                            </div>

                            <Drawer
                                active={drawerActive}
                                setActive={setDrawerActive}
                                size="fullscreen"
                                heading="Select media"
                            >
                                <FileManager
                                    isSelectMode
                                    filter="media"
                                    onSelectFile={handleSelectMedia}
                                />
                            </Drawer>
                        </>
                    );
                }}
            />
        </>
    );
});