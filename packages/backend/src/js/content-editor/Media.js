import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { FieldActions } from "../components/Field";
import { Input } from "../components/Form/Input";
import { SelectBreakpoint } from "../components/Form/SelectBreakpoint";
import { SelectMedia } from "../components/Form/SelectMedia";
import { PageCard } from "../components/PageCard";
import { usePrompt } from "../tmp-prompt";

const schema = yup.object({
    breakpoint: yup.string().required(),
    medias: yup.array().of(
        yup.object().shape({
            source: yup.string().required(),
            alt: yup.string(),
        })
    ),
});

export const MediaPreview = ({ content }) => {
    if (!content.medias) {
        return null;
    }

    return <div>
        <dl className="d-flex flex-wrap">
            {content.medias.map((media, key) => <div className="p-2 w-25" key={key}>
                <dt>{media.alt}</dt>
                <dd className="mb-0"><img className="d-block w-100" src={`/storage/upload/${media.source}`} /></dd>
            </div>)}
        </dl>
    </div>;
};

export const MediaBlockEditor = forwardRef(({ content, save }, ref) => {
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
        name: 'medias'
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
        <>
            <SelectBreakpoint
                label="Media breakpoint"
                errors={errors}
                {...register('breakpoint')}
            />

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
                        <SelectMedia
                            label="Media"
                            errors={errors}
                            control={control}
                            {...register(`medias.${index}.source`)}
                        />

                        <Input
                            label="Alternative text"
                            errors={errors}
                            {...register(`medias.${index}.alt`)}
                        />
                    </PageCard>
                })}
            </div>

            <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => append({})}
            >
                Add media
            </button>
        </>
    );
});