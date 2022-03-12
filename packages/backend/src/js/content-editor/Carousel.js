import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { FieldActions } from "../components/Field";
import { Checkbox } from "../components/Form/Checkbox";
import { Input } from "../components/Form/Input";
import { Select } from "../components/Form/Select";
import { SelectBreakpoint } from "../components/Form/SelectBreakpoint";
import { SelectMedia } from "../components/Form/SelectMedia";
import { PageCard } from "../components/PageCard";
import { usePrompt } from "../tmp-prompt";

const schema = yup.object({
    captions: yup.boolean(),
    controls: yup.boolean(),
    indicators: yup.boolean(),
    autoplay: yup.boolean(),
    autoplayMode: yup.string(),
    interval: yup.number(),
    breakpoint: yup.string().required(),
    slides: yup.array().of(
        yup.object().shape({
            media: yup.string().required(),
            alt: yup.string(),
            caption: yup.string(),
            subCaption: yup.string(),
        }),
    ),
});

export const CarouselPreview = ({ content }) => {
    if (!content.slides) {
        return null;
    }

    return <div>
        <dl className="d-flex flex-wrap">
            {content.slides.map((slide, key) => <div className="p-2 w-25" key={key}>
                <dt>{slide.alt}</dt>
                <dd className="mb-0"><img className="d-block w-100" src={`/storage/upload/${slide.media}`} /></dd>
            </div>)}
        </dl>
    </div>;
};

const Slides = ({ control, errors, register, setValue }) => {
    const { fields, append, remove, swap, update } = useFieldArray({
        control,
        name: 'slides',
        keyName: 'key',
    });

    const captionsValue = useWatch({
        control,
        name: 'captions',
    });

    return <fieldset>
        <legend>Slides</legend>

        <div className="mb-3">
            {fields.map((field, index) => {
                return <PageCard
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
                    <SelectMedia
                        label="Media"
                        setValue={setValue}
                        errors={errors}
                        control={control}
                        {...register(`slides.${index}.media`)}
                    />

                    <Input
                        label="Alternative text"
                        errors={errors}
                        {...register(`slides.${index}.alt`)}
                    />

                    {captionsValue === true && <>
                        <Input
                            label="Caption"
                            errors={errors}
                            {...register(`slides.${index}.caption`)}
                        />

                        <Input
                            label="Sub caption"
                            errors={errors}
                            {...register(`slides.${index}.subCaption`)}
                        />
                    </>}
                </PageCard>
            })}
        </div>

        <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => append({})}
        >
            Add slide
        </button>
    </fieldset>
};

export const CarouselBlockEditor = forwardRef(({ content, save }, ref) => {
    const {
        control,
        formState: { isDirty, errors },
        handleSubmit,
        register,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const autoplayValue = useWatch({
        control,
        name: 'autoplay',
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

    return <div>
        <fieldset>
            <legend>Settings</legend>

            <Checkbox
                label="Use captions"
                errors={errors}
                {...register('captions')}
            />

            <Checkbox
                label="Show controls"
                errors={errors}
                {...register('controls')}
            />

            <Checkbox
                label="Show indicators"
                errors={errors}
                {...register('indicators')}
            />

            <Checkbox
                label="Autoplay"
                errors={errors}
                {...register('autoplay')}
            />

            {autoplayValue === true && <>
                <Select
                    label="Autoplay mode"
                    errors={errors}
                    options={[
                        {
                            label: 'Ride (play after interaction)',
                            value: 'false',
                        },
                        {
                            label: 'Carousel (play immediately)',
                            value: 'carousel',
                        },
                    ]}
                    {...register('autoplayMode')}
                />

                <Input
                    label="Interval"
                    errors={errors}
                    type="number"
                    {...register('interval')}
                    defaultValue="5000"
                />
            </>
            }

            <SelectBreakpoint
                label="Media breakpoint"
                errors={errors}
                {...register('breakpoint')}
            />
        </fieldset>

        <Slides {...{ control, errors, register, setValue }} />
    </div>
});