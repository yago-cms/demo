import { useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { Error } from "../components/Error";
import { FieldActions } from "../components/Field";
import { Input } from "../components/Form/Input";
import { Select } from "../components/Form/Select";
import { SelectMedia } from "../components/Form/SelectMedia";
import { Wysiwyg } from "../components/Form/Wysiwyg";
import { Loading } from "../components/Loading";
import { PageCard } from "../components/PageCard";
import { GET_CARD_TEMPLATES } from "../queries";
import { usePrompt } from "../tmp-prompt";

const schema = yup.object({
    template: yup.number().required().positive(),
});

export const CardTitle = ({ content }) => {
    const { loading: isLoading, error, data } = useQuery(GET_CARD_TEMPLATES);

    if (isLoading) return null;
    if (error) return <Error message={error.message} />

    let templateName = 'N/A';

    data.cardTemplates.forEach(cardTemplate => {
        if (cardTemplate.id == content.template) {
            templateName = cardTemplate.name;
        }
    });

    return (
        <div>
            Card <span className="fw-normal">- {templateName}</span>
        </div>
    );
};

export const CardPreview = ({ content, showDetails }) => {
    delete content.template;

    return (
        showDetails
            ? <div>
                <dl>
                    {Object.entries(content).map(([name, value], key) => <div key={key}>
                        <dt>{_.startCase(_.replace(name, '-', ' '))}</dt>
                        <dd>{value}</dd>
                    </div>)}
                </dl>
            </div>
            : null
    )
};

export const CardField = ({ field, control, watch, register, errors }) => {
    const renderField = (field) => {
        switch (field.type) {
            case 'text':
                return <Input
                    label={field.label}
                    errors={errors}
                    {...register(field.id)}
                />
            case 'media':
                return <SelectMedia
                    label={field.label}
                    errors={errors}
                    control={control}
                    isBreakpointsEnabled
                    {...register(field.id)}
                />
            case 'cta':
                return <Input
                    label={field.label}
                    errors={errors}
                    {...register(field.id)}
                />
            case 'wysiwyg':
                return (
                    <div className="mb-3" style={{ height: '20rem' }}>
                        <Controller
                            control={control}
                            name={field.id}
                            render={({ field: { onChange, value } }) => (
                                <Wysiwyg value={value} handleChange={onChange} />
                            )}
                        />
                    </div>
                )
            case 'list':
                const { fields, append, swap, remove } = useFieldArray({
                    control,
                    name: field.id
                });
                const watchFieldArray = watch(field.id);
                const controlledFields = fields.map((field, index) => {
                    return {
                        ...field,
                        ...watchFieldArray[index]
                    };
                });
                const fieldId = field.id;

                return (
                    <div className="mb-3">
                        <fieldset>
                            <legend>{field.label}</legend>

                            <div className="mb-3">
                                {controlledFields.map((field, index) => {
                                    return <PageCard
                                        key={field.id}
                                        footer={
                                            <FieldActions
                                                fields={fields}
                                                index={index}
                                                swap={swap}
                                                remove={remove}
                                            />
                                        }
                                    >
                                        <Input
                                            label="Item"
                                            errors={errors}
                                            {...register(`${fieldId}.${index}.item`)}
                                        />
                                    </PageCard>
                                })}
                            </div>

                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => append({})}
                            >
                                Add item
                            </button>
                        </fieldset>
                    </div>
                );
        }
    };
    return (
        <div>
            {renderField(field)}
        </div>
    );
};

export const CardBlockEditor = forwardRef(({ content, save }, ref) => {
    const [cardTemplates, setCardTemplates] = useState([]);
    const {
        control,
        formState: { isDirty, errors },
        handleSubmit,
        register,
        setValue,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
    });
    const watchTemplate = watch('template');
    const [fields, setFields] = useState([]);
    const getCardTemplatesResult = useQuery(GET_CARD_TEMPLATES);

    const handleSave = (data) => {
        save(JSON.stringify(data));
    };

    const handleError = () => {
        throw new Error();
    };

    useImperativeHandle(ref, () => ({
        save() {
            return handleSubmit(handleSave, handleError)();
        }
    }));

    usePrompt('Are you sure you want to leave this page? You will lose any unsaved data.', isDirty);

    const loading = getCardTemplatesResult.loading;
    const error = getCardTemplatesResult.error;

    useEffect(() => {
        if (getCardTemplatesResult.loading === false && getCardTemplatesResult.data) {
            let cardTemplates = getCardTemplatesResult.data.cardTemplates;
            cardTemplates = cardTemplates.map(cardTemplate => ({
                value: cardTemplate.id,
                label: cardTemplate.name,
            }));
            cardTemplates.unshift({ value: 0, label: 'Choose template...' });
            setCardTemplates(cardTemplates);
        }
    }, [getCardTemplatesResult.loading, getCardTemplatesResult.data]);

    useEffect(() => {
        if (getCardTemplatesResult.loading === false && getCardTemplatesResult.data) {
            if (!content) {
                return;
            }

            let json = {};

            try {
                json = JSON.parse(content);
            } catch {
                console.log('Invalid JSON');
                return;
            }

            setValue('template', json.template);

            const cardTemplates = getCardTemplatesResult.data.cardTemplates;
            cardTemplates.forEach(cardTemplate => {
                if (cardTemplate.id == json.template) {
                    const fields = JSON.parse(cardTemplate.config);

                    fields.forEach(field => {
                        setValue(field.id, json[field.id]);
                    });
                }
            });
        }
    }, [getCardTemplatesResult.loading, getCardTemplatesResult.data, cardTemplates]);

    useEffect(() => {
        if (watchTemplate > 0) {
            const cardTemplates = getCardTemplatesResult.data.cardTemplates;

            cardTemplates.forEach(cardTemplate => {
                if (cardTemplate.id == watchTemplate) {
                    setFields(JSON.parse(cardTemplate.config));
                }
            });
        }
    }, [watchTemplate]);

    if (loading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <>
            <Select
                label="Template"
                options={cardTemplates}
                errors={errors}
                {...register('template')}
            />

            {fields && fields.map((field, index) => <CardField
                key={index}
                field={field}
                register={register}
                errors={errors}
                control={control}
                watch={watch}
            />)}
        </>
    );
});