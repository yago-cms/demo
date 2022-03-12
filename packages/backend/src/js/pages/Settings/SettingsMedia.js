import { useMutation, useQuery } from "@apollo/client";
import { faCaretDown, faCaretUp, faTimes } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { Input } from "../../components/Form/Input";
import { Select } from "../../components/Form/Select";
import { Loading } from "../../components/Loading";
import { Page } from "../../components/Page";
import { PageCard } from "../../components/PageCard";
import { GET_SETTINGS, UPSERT_SETTINGS } from "../../queries";
import { actions } from "./SettingsIndex";

const MediaBreakpoints = ({ index: parentIndex, control, errors, register }) => {
    const { fields, append, remove, swap } = useFieldArray({
        control,
        name: `breakpointGroups.${parentIndex}.breakpoints`,
        keyName: 'key',
    });

    return (
        <div>
            {fields.map((field, index) => {
                const isFirst = index == 0;
                const isLast = index == fields.length - 1;

                return (
                    <div className="row" key={field.key}>
                        <div className="col">
                            <Input
                                label="Min width"
                                errors={errors}
                                disabled={isFirst}
                                {...register(`breakpointGroups.${parentIndex}.breakpoints.${index}.minWidth`)}
                            />
                        </div>

                        <div className="col">
                            <Input
                                label="Target width"
                                errors={errors}
                                {...register(`breakpointGroups.${parentIndex}.breakpoints.${index}.targetWidth`)}
                            />
                        </div>

                        <div className="col">
                            <Input
                                label="Target height"
                                errors={errors}
                                {...register(`breakpointGroups.${parentIndex}.breakpoints.${index}.targetHeight`)}
                            />
                        </div>


                        <div className="col">
                            <div className="btn-group">
                                {!isFirst && <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => remove(index)}
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>}

                                {(!isFirst && index != 1) &&
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => swap(index, index - 1)}
                                    >
                                        <FontAwesomeIcon icon={faCaretUp} />
                                    </button>
                                }
                                {(!isFirst && !isLast) &&
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => swap(index, index + 1)}
                                    >
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                );
            })}

            <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => append({})}
            >
                Add breakpoint
            </button>
        </div>
    );
};

const MediaBreakpointGroups = ({ control, errors, register, setValue }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `breakpointGroups`,
    });

    return (
        <fieldset>
            <legend>Breakpoints</legend>

            <div className="w-50">
                <p>
                    Here you can specify media breakpoints for <code>&lt;picture&gt;</code> tags.<br />
                    The breakpoint groups you add here will be available to select for any media type you use.
                </p>

                <p>
                    You will need one breakpoint with <code>min width</code> set to <code>0</code>, of which the <code>target width</code> will be used for the base <code>&lt;img&gt;</code> tag.<br />
                </p>
            </div>

            {fields.map((field, index) => {
                const isFirst = index == 0;

                return (
                    <PageCard
                        key={field.id}
                        footer={
                            !isFirst && <button
                                className="btn btn-sm btn-outline-secondary"
                                type="button"
                                onClick={() => remove(index)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        }>
                        <Input
                            label="Name"
                            errors={errors}
                            {...register(`breakpointGroups.${index}.name`, {
                                onChange: (e) => {
                                    setValue(`breakpointGroups.${index}.key`, _.kebabCase(e.target.value));
                                }
                            })}
                        />

                        <Input
                            label="Key"
                            disabled
                            errors={errors}
                            {...register(`breakpointGroups.${index}.key`)}
                        />

                        <MediaBreakpoints {...{ index, control, errors, register }} />
                    </PageCard>
                );
            })}

            <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => append({
                    breakpoints: [{
                        minWidth: 0
                    }]
                })}
            >
                Add breakpoint group
            </button>
        </fieldset >
    );
};

export const SettingsMedia = () => {
    const schema = yup.object({
        cdn: yup.object().shape({
            type: yup.string().required(),
            source: yup.string().when('type', {
                is: 'imgix',
                then: (schema) => schema.required(),
            }),
        }),
        breakpointGroups: yup.array().of(
            yup.object().shape({
                name: yup.string().required(),
                key: yup.string().required(),
                breakpoints: yup.array().of(
                    yup.object().shape({
                        minWidth: yup.number().min(0).integer().required(),
                        targetWidth: yup.number().positive().integer().required(),
                        targetHeight: yup.number().positive().integer().required(),
                    }),
                ),
            }),
        ),
    });

    const {
        control,
        formState: { errors },
        handleSubmit,
        register,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const cdnTypeValue = useWatch({
        control,
        name: 'cdn.type',
    });


    const getSettingsResult = useQuery(GET_SETTINGS, {
        variables: {
            id: 'media'
        }
    });

    const [upsertSettings, upsertSettingsResult] = useMutation(UPSERT_SETTINGS);

    const handleSave = (data) => {
        upsertSettings({
            variables: {
                id: 'media',
                value: JSON.stringify(data),
            }
        });

    };

    const Footer = () => (
        <div className="d-flex">
            <div className="ms-auto">
                <button className="btn btn-outline-primary" onClick={handleSubmit(handleSave)}>
                    Save
                </button>
            </div>
        </div>
    );

    const isLoading = getSettingsResult.loading || upsertSettingsResult.loading;
    const error = getSettingsResult.error || upsertSettingsResult.error;

    useEffect(() => {
        if (getSettingsResult.loading === false && getSettingsResult.data) {
            const data = JSON.parse(getSettingsResult.data.settings.value);

            setValue('cdn', data.cdn);
            setValue('breakpointGroups', data.breakpointGroups);
        }
    }, [getSettingsResult.loading, getSettingsResult.data]);


    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <Page heading="Media" actions={actions} footer={<Footer />}>
            <fieldset>
                <legend>CDN</legend>

                <Select
                    label="CDN"
                    options={[
                        {
                            value: '',
                            'label': 'Choose CDN...',
                        },
                        {
                            value: 'default',
                            'label': 'No CDN (use built-in image cache)',
                        },
                        {
                            value: 'imgix',
                            'label': 'imgix',
                        }
                    ]}
                    errors={errors}
                    {...register('cdn.type')}
                />

                {cdnTypeValue == 'imgix' && <>
                    <Input
                        label="imgix source"
                        errors={errors}
                        {...register('cdn.source')}

                    />
                </>}
            </fieldset>

            <MediaBreakpointGroups {...{ control, errors, register, setValue }} />
        </Page>
    );
};