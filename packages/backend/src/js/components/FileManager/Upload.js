import classNames from "classnames";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { Drawer } from "../Drawer";

export const UploadDrawer = ({ path, getFilesResult, uploadFiles, isUploadActive, setIsUploadActive }) => {
    const [files, setFiles] = useState([]);

    const handleUpload = () => {
        uploadFiles({
            variables: {
                files,
                path,
            }
        }).then(() => {
            setIsUploadActive(false);

            getFilesResult.refetch({
                path,
            }
            );

            setFiles([]);
        });
    };

    const UploadFooter = () => {
        return <div className="btn-group">
            <button type="button" className="btn btn-primary" onClick={handleUpload}>Upload</button>
        </div>
    };

    return (
        <Drawer
            heading="Upload files"
            active={isUploadActive}
            setActive={setIsUploadActive}
            size="fullscreen"
            footer={<UploadFooter />}
        >
            <Upload files={files} setFiles={setFiles} />
        </Drawer>
    );
};

const UploadFileList = ({ files }) => {
    const list = (files) => {
        const label = (file) => `${file.name}`;
        return <ul className="list-unstyled">
            {files.map((file) => <li key={file.name}>{label(file)}</li>)}
        </ul>;
    };

    if (files.length === 0) {
        return null;
    }

    const fileList = useMemo(() => list(files), [files]);
    return <div className="file-upload__files">{fileList}</div>;
};

const Upload = ({ files, setFiles }) => {
    const fileInput = useRef(null);

    const handleFileDrop = useCallback((item) => {
        if (item) {
            setFiles(item.files);
        }
    }, [files]);

    const handleFileChange = useCallback((event) => {
        setFiles(Array.from(event.target.files));
    }, [files]);

    const handleFileClick = useCallback(() => {
        fileInput.current.click();
    }, [files]);

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: [NativeTypes.FILE],
        drop(item) {
            if (handleFileDrop) {
                handleFileDrop(item);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [handleFileDrop]);
    const isActive = canDrop && isOver;

    return <div
        className={classNames('file-upload', {
            'file-upload--active': isActive,
        })}
        ref={drop}
        onClick={handleFileClick}
    >
        <div>
            <input className="d-none" type="file" ref={fileInput} multiple onChange={handleFileChange} />

            <div className="file-upload__text">
                {isActive ? 'Release to drop' : 'Drag files here och click to upload'}
            </div>

            <UploadFileList files={files} />
        </div>
    </div>
};