import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { GET_FILES, RENAME_FILE } from "../../queries";
import { Drawer } from "../Drawer";
import { Input } from "../Form/Input";

export const ChangeNameDrawer = ({ file, isChangeNameActive, setIsChangeNameActive, setErrorMessage }) => {
    const schema = yup.object({
        name: yup.string().required(),
    });

    const {
        formState: { errors },
        handleSubmit,
        register,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [renameFile] = useMutation(RENAME_FILE, {
        refetchQueries: [
            GET_FILES
        ]
    });

    const handleChangeName = (data) => {
        const { name } = data;

        renameFile({
            variables: {
                input: {
                    path: file.path,
                    name,
                }
            }
        })
            .catch(() => {
                setErrorMessage('Could not rename file. File probably already exists.');
            });

        setIsChangeNameActive(false);
    };

    const Footer = () => {
        return <div className="btn-group">
            <button type="button" className="btn btn-primary" onClick={handleSubmit(handleChangeName)}>Save</button>
        </div>
    };

    useEffect(() => {
        reset();
        setErrorMessage(null);
    }, [isChangeNameActive])

    if (!file) return null;

    return (
        <Drawer
            heading="Change filename"
            active={isChangeNameActive}
            setActive={setIsChangeNameActive}
            footer={<Footer />}
        >
            <Input
                label="Name"
                errors={errors}
                defaultValue={file.name}
                {...register('name')}
            />
        </Drawer>
    );
};