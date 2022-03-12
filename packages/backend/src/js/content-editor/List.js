import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { FieldActions } from "../components/Field";
import { Input } from "../components/Form/Input";
import { Select } from "../components/Form/Select";
import { PageCard } from "../components/PageCard";
import { usePrompt } from "../tmp-prompt";

const schema = yup.object({
    type: yup.string().required(),
    items: yup.array().of(
        yup.object().shape({
            item: yup.string().required(),
        }),
    ),
});

export const ListPreview = ({ content, showDetails }) => {
    return showDetails
        ? <div>
            <dl>
                <dt>Type</dt>
                <dd>{content.type}</dd>

                <dt>Items</dt>
                <dd>{content.items.map(item => item.item).join(' - ')}</dd>
            </dl>
        </div>
        : null
};

export const ListBlockEditor = forwardRef(({ content, save }, ref) => {
    const {
        control,
        formState: { isDirty, errors },
        handleSubmit,
        register,
        setValue,
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

    const { fields, append, remove, swap } = useFieldArray({
        control,
        name: 'items',
    });

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
    }, [])

    return (
        <div>
            <Select
                label="Type"
                options={[
                    {
                        value: 'ul',
                        label: 'Unordered',
                    },
                    {
                        value: 'ol',
                        label: 'Ordered',
                    }
                ]}
                errors={errors}
                {...register('type')}
            />

            <fieldset>
                <legend>Items</legend>

                <div className="mb-3">
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
                                label="Item"
                                errors={errors}
                                {...register(`items.${index}.item`)}
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
});