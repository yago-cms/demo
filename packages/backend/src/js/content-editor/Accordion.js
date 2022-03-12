import { useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { truncate } from "../components/ContentBlockEditor/ContentBlock";
import { Error } from "../components/Error";
import { FieldActions } from "../components/Field";
import { Checkbox } from "../components/Form/Checkbox";
import { Input } from "../components/Form/Input";
import { Select } from "../components/Form/Select";
import { Wysiwyg } from "../components/Form/Wysiwyg";
import { Loading } from "../components/Loading";
import { PageCard } from "../components/PageCard";
import { GET_CARD_TEMPLATES } from "../queries";
import { usePrompt } from "../tmp-prompt";
import { CardField } from "./Card";

const schema = yup.object({
    alwaysOpen: yup.bool(),
    firstOpen: yup.bool(),
    type: yup.string().required(),
    cardTemplate: yup.number(),
    cards: yup.array().of(
        yup.object().shape({
            label: yup.string().required(),
        }),
    ),
    texts: yup.array().of(
        yup.object().shape({
            label: yup.string().required(),
        }),
    ),
});

export const AccordionPreview = ({ content, showDetails }) => {
    return showDetails
        ? <div>
            <dl>
                <dt>Text</dt>
                <dd>{content.text}</dd>
            </dl>
        </div>
        : <div>
            {truncate(content.text)}
        </div>
};

const CardFields = ({ control, reset, getValues, watch, errors, register }) => {
    const [cardTemplates, setCardTemplates] = useState([]);
    const [templateCardFields, setTemplateCardFields] = useState([]);

    const getCardTemplatesResult = useQuery(GET_CARD_TEMPLATES);

    const { fields, append, swap, remove } = useFieldArray({
        control,
        name: 'cards'
    });
    const watchTemplate = watch('cardTemplate');

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
        if (watchTemplate > 0) {
            const cardTemplates = getCardTemplatesResult.data.cardTemplates;

            cardTemplates.forEach(cardTemplate => {
                if (cardTemplate.id == watchTemplate) {
                    setTemplateCardFields(JSON.parse(cardTemplate.config));
                }
            });
        } else {
            setTemplateCardFields([]);
            reset({
                ...getValues(),
                cards: [],
            });
        }
    }, [watchTemplate]);

    if (loading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <div className="mb-3">
            <Controller
                control={control}
                name="cardTemplate"
                render={({ field: { onChange, value } }) =>
                    <Select
                        value={value}
                        label="Template"
                        options={cardTemplates}
                        errors={errors}
                        onChange={onChange}
                    />
                }
            />

            {watchTemplate && <fieldset>
                <legend>Cards</legend>

                <div className="mb-3">
                    {fields.map((field, fieldIndex) => {
                        return <PageCard
                            key={field.id}
                            footer={
                                <FieldActions
                                    fields={fields}
                                    index={fieldIndex}
                                    swap={swap}
                                    remove={remove}
                                />
                            }
                        >
                            <Input
                                label="Label"
                                errors={errors}
                                {...register(`cards.${fieldIndex}.label`)}
                            />

                            {templateCardFields && templateCardFields.map((templateCardField, index) => {
                                const cardField = {
                                    ...templateCardField
                                };
                                cardField.id = `cards.${fieldIndex}.${cardField.id}`;

                                return <CardField
                                    key={index}
                                    field={cardField}
                                    register={register}
                                    errors={errors}
                                    control={control}
                                    watch={watch}
                                />
                            })}
                        </PageCard>
                    })}
                </div>

                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => append({})}
                >
                    Add card
                </button>
            </fieldset>}
        </div>
    );
};

const TextFields = ({ control, errors, register }) => {
    const { fields, append, swap, remove } = useFieldArray({
        control,
        name: 'texts'
    });

    return (
        <div className="mb-3">
            <fieldset>
                <legend>Text</legend>

                {fields.map((field, index) => {
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
                            label="Label"
                            errors={errors}
                            {...register(`texts.${index}.label`)}
                        />

                        <div className="mb-3" style={{ height: '20rem' }}>
                            <Controller
                                control={control}
                                name={`texts.${index}.text`}
                                render={({ field: { onChange, value } }) => (
                                    <Wysiwyg value={value} handleChange={onChange} />
                                )}
                            />
                        </div>
                    </PageCard>
                })}

                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => append({})}
                >
                    Add text
                </button>
            </fieldset>
        </div>
    );
};

export const AccordionBlockEditor = forwardRef(({ content, save }, ref) => {
    const {
        control,
        formState: { isDirty, errors },
        handleSubmit,
        register,
        reset,
        setValue,
        getValues,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
    });

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

    const watchType = watch('type');

    usePrompt('Are you sure you want to leave this page? You will lose any unsaved data.', isDirty);

    useEffect(() => {
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

        for (const field in json) {
            if (field in schema.fields) {
                setValue(field, json[field]);
            }
        }
    }, []);

    useEffect(() => {
        if (watchType == 'card') {
            reset({
                ...getValues(),
            });
        } else if (watchType == 'text') {
            reset({
                ...getValues(),
                cards: [],
            });
        }
    }, [watchType]);

    return (
        <>
            <Checkbox
                label="Always open"
                errors={errors}
                {...register('alwaysOpen')}
            />

            <Checkbox
                label="Open first item"
                errors={errors}
                {...register('firstOpen')}
            />

            <Select
                label="Type"
                options={[
                    {
                        value: '',
                        label: 'Choose type...',
                    },
                    {
                        value: 'card',
                        label: 'Card',
                    },
                    {
                        value: 'text',
                        label: 'Text',
                    },
                ]}
                errors={errors}
                {...register('type')}
            />

            {watchType == 'card' && <CardFields
                control={control}
                reset={reset}
                getValues={getValues}
                watch={watch}
                errors={errors}
                register={register}
            />}

            {watchType == 'text' &&
                <TextFields
                    control={control}
                    errors={errors}
                    register={register}
                />
            }
        </>
    );
});