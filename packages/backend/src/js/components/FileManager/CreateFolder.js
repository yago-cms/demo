import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { CREATE_FOLDER, GET_FILES } from "../../queries";
import { Drawer } from "../Drawer";
import { Input } from "../Form/Input";

export const CreateFolderDrawer = ({ path, setErrorMessage, isCreateFolderActive, setIsCreateFolderActive }) => {
    const schema = yup.object({
        name: yup.string().matches(/^[a-z0-9\-_]+$/).required(),
    });

    const {
        formState: { errors },
        handleSubmit,
        register,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [createFolder] = useMutation(CREATE_FOLDER, {
        refetchQueries: [
            GET_FILES
        ]
    });

    const handleCreateFolder = (data) => {
        const { name } = data;

        createFolder({
            variables: {
                input: {
                    path,
                    name,
                }
            }
        })
            .catch(() => {
                setErrorMessage('Could not create fodler. Folder probably already exists.');
            });

        setIsCreateFolderActive(false);
    };

    const Footer = () => {
        return <div className="btn-group">
            <button type="button" className="btn btn-primary" onClick={handleSubmit(handleCreateFolder)}>Save</button>
        </div>
    };

    useEffect(() => {
        reset();
        setErrorMessage(null);
    }, [isCreateFolderActive])

    return (
        <Drawer
            heading="Create folder"
            active={isCreateFolderActive}
            setActive={setIsCreateFolderActive}
            footer={<Footer />}
        >
            <Input
                label="Name"
                errors={errors}
                {...register('name')}
            />
        </Drawer>
    );
};