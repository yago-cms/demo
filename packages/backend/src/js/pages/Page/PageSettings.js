import { faArrowLeft } from "@fortawesome/pro-duotone-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Page } from "../../components/Page";

const schema = yup.object({
    name: yup.string().required(),
    template: yup.number().required().positive(),
    isActive: yup.boolean(),
    isRoot: yup.boolean(),
});

export const PageSettings = () => {
    const {
        control,
        formState: { isDirty, errors },
        handleSubmit,
        register,
        setValue,
        getValues,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const handleSave = () => { };

    const Footer = () => (
        <button className="btn btn-primary">Save</button>
    );

    const actions = [
        { icon: faArrowLeft, path: '/pages' },
    ];

    return (
        <form onSubmit={handleSubmit(handleSave)}>
            <Page heading="Page settings" actions={actions}>
                Empty.
            </Page>
        </form>
    );
};