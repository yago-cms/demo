import { useMutation, useQuery } from "@apollo/client";
import { faArrowLeft } from "@fortawesome/pro-duotone-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import { Error } from "../../components/Error";
import { FieldActions } from "../../components/Field";
import { Input } from "../../components/Form/Input";
import { Select } from "../../components/Form/Select";
import { Loading } from "../../components/Loading";
import { Page } from "../../components/Page";
import { PageCard } from "../../components/PageCard";
import { GET_CARD_TEMPLATE, GET_CARD_TEMPLATES, UPSERT_CARD_TEMPLATE } from "../../queries";

// TODO: no duplicate names
const schema = yup.object({
    name: yup.string().required(),
    key: yup.string().required(),
    fields: yup.array().of(
        yup.object().shape({
            id: yup.string().required(),
            type: yup.string().required(),
            label: yup.string().required(),
        }),
    ),
});

const fieldTypes = [
    {
        value: '',
        label: 'Choose type...',
    },
    {
        value: 'text',
        label: 'Text',
    },
    {
        value: 'media',
        label: 'Media',
    },
    {
        value: 'cta',
        label: 'Call to action',
        fields: [
            {
                value: 'text',
                label: 'Button text',
            },
        ],
    },
    {
        value: 'wysiwyg',
        label: 'WYSIWYG',
    },
    {
        value: 'list',
        label: 'List',
    },
];

const hasSubFields = (field) =>
    fieldTypes.some(fieldType =>
        fieldType.value == field.type && fieldType.fields !== undefined
    );

const SubFields = ({ field, index, errors, control, register }) => {
    if (!hasSubFields(field)) {
        return null;
    }

    const fieldType = fieldTypes.find(fieldType =>
        fieldType.value == field.type && fieldType.fields !== undefined);

    const { fields, remove, append } = useFieldArray({
        control,
        name: `fields.${index}.fields`
    });

    return <>
        {fieldType.fields.map((field, subIndex) => <div className="row" key={subIndex}>
            <div className="col-4">
                <Input
                    label={field.label}
                    errors={errors}
                    {...register(`fields.${index}.fields.${subIndex}.${field.value}`)}
                />
            </div>
        </div>)}
    </>
};

export const CardTemplateForm = () => {
    const { id } = useParams();
    const isNew = id === undefined;
    const {
        control,
        formState: { errors },
        handleSubmit,
        register,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });
    const { fields, append, remove, swap, update, move } = useFieldArray({
        control,
        name: 'fields',
        keyName: 'key',
    });
    const nameValue = useWatch({
        control,
        name: 'name',
    });
    const navigate = useNavigate();
    const getCardTemplateResult = useQuery(GET_CARD_TEMPLATE, {
        variables: {
            id
        },
        skip: isNew,
    });
    const [upsertCardTemplate, upsertCardTemplateResult] = useMutation(UPSERT_CARD_TEMPLATE, {
        onCompleted: (data) => {
            navigate(`/pages/cards/${data.upsertCardTemplate.id}`);
        },
        update: (cache, { data: { upsertCardTemplate } }) => {
            const data = cache.readQuery({
                query: GET_CARD_TEMPLATES
            });

            if (data !== null) {
                const cardTemplates = _.cloneDeep(data.cardTemplates);

                if (isNew) {
                    cardTemplates.push(upsertCardTemplate);
                } else {
                    cardTemplates.forEach(cardTemplate => {
                        if (cardTemplate.id === upsertCardTemplate.id) {
                            cardTemplate = upsertCardTemplate;
                        }
                    });
                }

                cache.writeQuery({
                    query: GET_CARD_TEMPLATES,
                    data: {
                        cardTemplates
                    },
                });
            }
        },
    });

    const handleSave = (data) => {
        let { fields } = data;

        const cardTemplate = {
            id: !isNew ? id : null,
            name: data.name,
            key: data.key,
            config: JSON.stringify(fields),
        };

        upsertCardTemplate({
            variables: {
                input: cardTemplate
            }
        });
    };

    const Footer = () => (
        <div className="text-end">
            <button className="btn btn-outline-primary">Save</button>
        </div>
    );

    const actions = [
        { icon: faArrowLeft, path: '/pages/cards' },
    ];

    const heading = isNew ? 'Add card template' : 'Edit card template';

    const loading = getCardTemplateResult.loading || upsertCardTemplateResult.loading;
    const error = getCardTemplateResult.error || upsertCardTemplateResult.error;

    useEffect(() => {
        if (getCardTemplateResult.loading === false && getCardTemplateResult.data) {
            const cardTemplate = getCardTemplateResult.data.cardTemplate;

            setValue('name', cardTemplate.name);
            setValue('key', cardTemplate.key);
            setValue('fields', JSON.parse(cardTemplate.config));
        }
    }, [getCardTemplateResult.loading, getCardTemplateResult.data]);

    useEffect(() => {
        if (nameValue != '') {
            setValue('key', _.kebabCase(nameValue));
        }
    }, [nameValue]);

    if (loading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <form onSubmit={handleSubmit(handleSave)}>
            <Page heading={heading} actions={actions} footer={<Footer />}>
                <Input
                    label="Name"
                    errors={errors}
                    {...register('name')}
                />

                <Input
                    label="Key"
                    disabled
                    errors={errors}
                    {...register('key')}
                />

                <fieldset>
                    <legend>Fields</legend>

                    {fields.map((field, index) => {
                        return (
                            <PageCard
                                key={field.key}
                                footer={
                                    <FieldActions
                                        fields={fields}
                                        index={index}
                                        swap={swap}
                                        remove={remove}
                                    />
                                }
                            >
                                <Select
                                    label="Type"
                                    options={fieldTypes}
                                    errors={errors}
                                    {...register(`fields.${index}.type`, {
                                        onChange: (e) => {
                                            update(index, { ...field, type: e.target.value });
                                        }
                                    })}
                                />

                                <div className="row">
                                    <div className="col-4">
                                        <Input
                                            label="Label"
                                            errors={errors}
                                            {...register(`fields.${index}.label`, {
                                                onChange: (e) => {
                                                    setValue(`fields.${index}.id`, _.kebabCase(e.target.value));
                                                }
                                            })}
                                        />
                                    </div>

                                    <div className="col-2">
                                        <Input
                                            label="Key"
                                            disabled
                                            errors={errors}
                                            {...register(`fields.${index}.id`)}
                                        />
                                    </div>
                                </div>

                                <SubFields
                                    field={field}
                                    {...{ index, errors, control, register }}
                                />
                            </PageCard>
                        );
                    })}

                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => append({})}
                    >
                        Add field
                    </button>
                </fieldset>
            </Page>
        </form>
    );
};