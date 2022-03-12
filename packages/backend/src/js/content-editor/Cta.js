import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { truncate } from "../components/ContentBlockEditor/ContentBlock";
import { Input } from "../components/Form/Input";
import { Select } from "../components/Form/Select";
import { SelectPage } from "../components/Form/SelectPage";
import { usePrompt } from "../tmp-prompt";

const schema = yup.object({
    source: yup.string().required(),
    label: yup.string().required(),
    url: yup.string().when('source', {
        is: 'external',
        then: (schema) => schema.required(),
    }),
    page: yup.string().when('source', {
        is: 'page',
        then: (schema) => schema.required(),
    }),
});

export const CtaPreview = ({ content, showDetails }) => {
    return showDetails
        ? <div>
            <dl>
                <dt>Source</dt>
                <dd>{content.source}</dd>

                <dt>Label</dt>
                <dd>{content.label}</dd>

                <dt>URL</dt>
                <dd>{content.url}</dd>
            </dl>
        </div>
        : <div>
            {truncate(content.label)} - {truncate(content.url)}
        </div>
};

export const CtaBlockEditor = forwardRef(({ content, save }, ref) => {
    const {
        control,
        formState: { isDirty, errors },
        handleSubmit,
        register,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const sourceValue = useWatch({ name: 'source', control });

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
                label="Source"
                options={[
                    {
                        value: '',
                        label: 'Choose source...'
                    },
                    {
                        value: 'page',
                        label: 'Page',
                    },
                    {
                        value: 'external',
                        label: 'External URL',
                    },
                ]}
                errors={errors}
                {...register('source')}
            />

            <Input
                label="Label"
                errors={errors}
                {...register('label')}
            />

            {sourceValue == 'page' && <SelectPage
                label="Page"
                errors={errors}
                {...register('page')}
                setValue={setValue}
            />}

            {sourceValue == 'external' && <Input
                label="URL"
                errors={errors}
                {...register('url')}
            />}
        </div>
    );
});