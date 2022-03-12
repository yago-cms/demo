import { useMutation, useQuery } from "@apollo/client";
import { faArrowLeft, faTimes } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import { Error } from "../../components/Error";
import { FieldActions } from "../../components/Field";
import { Input } from "../../components/Form/Input";
import { Loading } from "../../components/Loading";
import { Page } from "../../components/Page";
import { PageCard } from "../../components/PageCard";
import { GET_PAGE_TEMPLATE, GET_PAGE_TEMPLATES, UPSERT_PAGE_TEMPLATE } from "../../queries";

const schema = yup.object({
    name: yup.string().required(),
    sections: yup.array().of(
        yup.object().shape({
            name: yup.string().required(),
            key: yup.string().required(),
            columns: yup.array().of(
                yup.object().shape({

                }),
            ),
        })
    )
});

const Columns = ({ index, errors, control, register }) => {
    const { fields, remove, append } = useFieldArray({
        control,
        name: `sections.${index}.columns`,
        keyName: 'key',
    });

    return <fieldset className="p-3">
        <legend>Columns</legend>

        {fields.map((field, subIndex) =>
            <div className="row mb-3" key={subIndex}>
                <div className="col-3">
                    Column #{subIndex + 1}

                    <Input
                        type="hidden"
                        errors={errors}
                        {...register(`sections.${index}.columns.${subIndex}.id`)}
                    />
                </div>

                <div className="col">
                    <div className="btn-group">
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            type="button"
                            onClick={() => remove(subIndex)}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
            </div>
        )}

        <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => append({})}
        >
            Add column
        </button>
    </fieldset>
};

export const PageTemplateForm = () => {
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
    const { fields, append, remove, swap } = useFieldArray({
        control,
        name: 'sections',
        keyName: '_key',
    });
    const navigate = useNavigate();
    const getPageTemplateResult = useQuery(GET_PAGE_TEMPLATE, {
        variables: {
            id
        },
        skip: isNew,
    });
    const [upsertPageTemplate, upsertPageTemplateResult] = useMutation(UPSERT_PAGE_TEMPLATE, {
        onCompleted: (data) => {
            navigate(`/pages/templates/${data.upsertPageTemplate.id}`);
        },
        update: (cache, { data: { upsertPageTemplate } }) => {
            const data = cache.readQuery({
                query: GET_PAGE_TEMPLATES
            });

            if (data !== null) {
                const pageTemplates = _.cloneDeep(data.pageTemplates);

                if (isNew) {
                    pageTemplates.push(upsertPageTemplate);
                } else {
                    pageTemplates.forEach(pageTemplate => {
                        if (pageTemplate.id === upsertPageTemplate.id) {
                            pageTemplate = upsertPageTemplate;
                        }
                    });
                }

                cache.writeQuery({
                    query: GET_PAGE_TEMPLATES,
                    data: {
                        pageTemplates
                    },
                });
            }
        },
    });

    const handleSave = (data) => {
        const pageTemplateSections = {
            upsert: [],
            delete: [],
        };

        data.sections.forEach((section, sectionIndex) => {
            const pageTemplateSectionColumns = {
                upsert: [],
                delete: [],
            };

            section.columns.forEach(columns => {
                pageTemplateSectionColumns.upsert.push({
                    id: columns.id || null,
                });
            });

            pageTemplateSections.upsert.push({
                id: section.id || null,
                name: section.name,
                key: section.key,
                sorting: sectionIndex,
                pageTemplateSectionColumns,
            });
        });

        const pageTemplate = {
            id: !isNew ? id : null,
            name: data.name,
            pageTemplateSections,
        };

        if (!isNew) {
            // deleted sections
            const oldSections = getPageTemplateResult.data.pageTemplate.pageTemplateSections;
            const newSections = data.sections;

            oldSections.forEach(oldSection => {
                let deleted = true;

                newSections.forEach(newSection => {
                    if (oldSection.id == newSection.id) {
                        deleted = false;
                    }
                });

                if (deleted) {
                    pageTemplate.pageTemplateSections.delete.push(oldSection.id);
                }
            });

            // deleted columns
            oldSections.forEach(oldSection => {
                const oldColumns = oldSection.pageTemplateSectionColumns;
                let newColumns = [];

                data.sections.some(section => {
                    if (section.id == oldSection.id) {
                        newColumns = section.columns;
                        return true;
                    }

                    return false;
                });

                oldColumns.forEach(oldColumn => {
                    let deleted = true;

                    newColumns.forEach(newColumn => {
                        if (oldColumn.id == newColumn.id) {
                            deleted = false;
                        }
                    });

                    if (deleted) {
                        pageTemplate.pageTemplateSections.upsert = pageTemplate.pageTemplateSections.upsert.map(section => {
                            if (section.id == oldSection.id) {
                                section.pageTemplateSectionColumns.delete.push(oldColumn.id);
                            }

                            return section;
                        });
                    }
                });
            });
        }

        upsertPageTemplate({
            variables: {
                input: pageTemplate,
            }
        });
    };

    const Footer = () => (
        <button className="btn btn-primary">Save</button>
    );

    const actions = [
        { icon: faArrowLeft, path: '/pages/templates' },
    ];

    const heading = isNew ? 'Add page template' : 'Edit page template';

    const isLoading = getPageTemplateResult.loading || upsertPageTemplateResult.loading;
    const error = getPageTemplateResult.error || upsertPageTemplateResult.error;

    useEffect(() => {
        if (getPageTemplateResult.loading === false && getPageTemplateResult.data) {
            const pageTemplate = getPageTemplateResult.data.pageTemplate;

            const sections = [];

            pageTemplate.pageTemplateSections.forEach(pageTemplateSection => {
                const columns = [];

                pageTemplateSection.pageTemplateSectionColumns.forEach(pageTemplateSectionColumn => {
                    columns.push({
                        id: pageTemplateSectionColumn.id,
                    });
                })

                sections.push({
                    id: pageTemplateSection.id,
                    name: pageTemplateSection.name,
                    key: pageTemplateSection.key,
                    columns: columns,
                });
            })

            setValue('name', pageTemplate.name);
            setValue('sections', sections);
        }
    }, [getPageTemplateResult.loading, getPageTemplateResult.data]);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <form onSubmit={handleSubmit(handleSave)}>
            <Page heading={heading} actions={actions} footer={<Footer />}>
                <Input
                    label="Name"
                    errors={errors}
                    {...register('name')}
                />

                <fieldset>
                    <legend>Sections</legend>

                    <div className="mb-3">
                        {fields.map((field, index) => {
                            return (
                                <PageCard
                                    key={index}
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
                                        type="hidden"
                                        errors={errors}
                                        {...register(`sections.${index}.id`)}
                                    />

                                    <Input
                                        label="Name"
                                        errors={errors}
                                        {...register(`sections.${index}.name`, {
                                            onChange: (e) => {
                                                setValue(`sections.${index}.key`, _.kebabCase(e.target.value));
                                            }
                                        })}
                                    />

                                    <Input
                                        label="Key"
                                        disabled
                                        errors={errors}
                                        {...register(`sections.${index}.key`)}
                                    />

                                    <div className="row">
                                        <Columns {...{ index, errors, control, register }} />
                                    </div>
                                </PageCard>
                            );
                        })}
                    </div>

                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => append({})}
                    >
                        Add section
                    </button>
                </fieldset>
            </Page>
        </form>
    );
};