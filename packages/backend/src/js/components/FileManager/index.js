import { useMutation, useQuery } from "@apollo/client";
import { faFileUpload, faPlus } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DELETE_FILE, GET_FILES, MOVE_FILE, UPLOAD_FILES } from "../../queries";
import { Error } from "../Error";
import { Loading } from "../Loading";
import { ChangeNameDrawer } from "./ChangeName";
import { CreateFolderDrawer } from "./CreateFolder";
import { FileList } from "./FileList";
import { PreviewDrawer } from "./Preview";
import { UploadDrawer } from "./Upload";

export const TYPE_DIRECTORY = 'DIRECTORY';
export const TYPE_FILE = 'FILE';
export const TYPE_IMAGE = 'IMAGE';

export const FileManager = ({ isSelectMode, filter, onSelectFile }) => {
    const [isUploadActive, setIsUploadActive] = useState(false);
    const [isCreateFolderActive, setIsCreateFolderActive] = useState(false);
    const [isChangeNameActive, setIsChangeNameActive] = useState(false);
    const [isPreviewActive, setIsPreviewActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [path, setPath] = useState('/');

    const params = useParams();
    let navigate = useNavigate();

    if (isSelectMode) {
        navigate = (path) => {
            setPath(path);
        };
    }

    const getFilesResult = useQuery(GET_FILES, {
        fetchPolicy: 'no-cache',
        variables: {
            path,
        },
    });
    const [moveFile] = useMutation(MOVE_FILE, {
        refetchQueries: [
            GET_FILES
        ]
    });
    const [uploadFiles] = useMutation(UPLOAD_FILES);
    const [deleteFile] = useMutation(DELETE_FILE, {
        refetchQueries: [
            GET_FILES
        ]
    });

    const handleSelectFile = useCallback((file) => {
        if (onSelectFile) {
            onSelectFile(file.path);
        }
    }, []);

    const handleChangeName = (file) => {
        setIsChangeNameActive(true);
        setCurrentFile(file);
    };

    const handleDelete = (file) => {
        deleteFile({
            variables: {
                input: {
                    path: file.path,
                }
            }
        })
            .catch(() => {
                setErrorMessage('Could not delete file.');
            });
    };

    const handlePreview = (file) => {
        setIsPreviewActive(true);
        setCurrentFile(file);
    };

    const isLoading = getFilesResult.loading;
    const error = getFilesResult.error;

    useEffect(() => {
        if (params['*']) {
            setPath(params['*']);
        } else {
            setPath('/');
        }
    }, [params]);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <div className="file-manager">
            {errorMessage && <div className="alert alert-danger">
                {errorMessage}
            </div>}

            <div className="row">
                <div className="col">
                    {getFilesResult.data.files.path}
                </div>

                <div className="col text-end">
                    <div className="btn-group">
                        <button className="btn btn-outline-secondary" type="button" onClick={() => setIsCreateFolderActive(true)}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>

                        <button className="btn btn-outline-secondary" type="button" onClick={() => setIsUploadActive(true)}>
                            <FontAwesomeIcon icon={faFileUpload} />
                        </button>
                    </div>
                </div>
            </div>

            <FileList
                files={getFilesResult.data.files.files}
                path={getFilesResult.data.files.path}
                navigate={navigate}
                moveFile={moveFile}
                isSelectMode={isSelectMode}
                handleSelectFile={handleSelectFile}
                handleChangeName={handleChangeName}
                handleDelete={handleDelete}
                handlePreview={handlePreview}
                setErrorMessage={setErrorMessage}
            />

            <UploadDrawer {...{ path, getFilesResult, uploadFiles, isUploadActive, setIsUploadActive }} />

            <ChangeNameDrawer {...{ file: currentFile, isChangeNameActive, setIsChangeNameActive, setErrorMessage }} />

            <PreviewDrawer {...{ currentFile, isPreviewActive, setIsPreviewActive }} />

            <CreateFolderDrawer {...{ path, isCreateFolderActive, setIsCreateFolderActive, setErrorMessage }} />
        </div>
    );
}