import { faEdit, faEye, faFile, faFileAlt, faFileCsv, faFileExcel, faFilePdf, faFilePowerpoint, faFileWord, faTrash } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TYPE_FILE, TYPE_IMAGE } from '.';
import { useDrag } from 'react-dnd';
import classNames from "classnames";

const getExtensionIcon = (extension) => {
    switch (extension) {
        case 'pdf':
            return faFilePdf;
        case 'pot':
        case 'potm':
        case 'potx':
        case 'ppa':
        case 'ppam':
        case 'pps':
        case 'ppsm':
        case 'ppsx':
        case 'ppt':
        case 'pptm':
        case 'pptx':
        case 'odp':
            return faFilePowerpoint;
        case 'doc':
        case 'docm':
        case 'docx':
        case 'dot':
        case 'dotm':
        case 'dotx':
        case 'odt':
        case 'rtf':
            return faFileWord;
        case 'csv':
            return faFileCsv;
        case 'xla':
        case 'xlam':
        case 'xls':
        case 'xlsb':
        case 'xlsm':
        case 'xlsx':
        case 'xlt':
        case 'xltm':
        case 'xltx':
        case 'xlw':
            return faFileExcel;
        case 'txt':
            return faFileAlt;
        default:
            return faFile;
    }
};

const fileIsImage = (extension) => {
    switch (extension) {
        case 'svg':
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return true;
        default:
            return false;
    }
};

export const PreviewFile = ({ file }) => {
    if (!file) return null;

    return (
        <div className="text-center">
            <img className="img-fluid img-thumbnail" src={`/storage/upload/${file.path}`} />
        </div>
    )
};

export const File = ({
    file,
    isSelectMode,
    handleSelectFile,
    handleChangeName,
    handleDelete,
    handlePreview,
}) => {
    const src = `/storage/upload/${file.path}`;

    const [{ opacity }, drag] = useDrag(() => ({
        type: 'file',
        item: {
            type: 'file',
            file
        },
        canDrag: () => !isSelectMode,
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.4 : 1.0,
        }),
    }), [file]);

    return (
        <div
            className={classNames('file-manager__file', {
                'file-manager__file--is-file': file.type == TYPE_FILE,
                'file-manager__file--is-image': file.type == TYPE_IMAGE,
            })}
            ref={drag}
            style={{ opacity }}
            onClick={() => handleSelectFile(file)}
        >
            <div className="file-manager__file__body">
                {file.type == TYPE_FILE
                    ? <div className="file-manager__file__icon">
                        <FontAwesomeIcon icon={getExtensionIcon(file.extension)} fixedWidth />
                    </div>
                    : <div className="file-manager__file__image">
                        <img className="img-fluid" src={src} />
                    </div>
                }

                <div className="file-manager__file__name">
                    {file.name}
                </div>
            </div>

            <div className="file-manager__file__footer">
                {fileIsImage && <button type="button" className="btn btn-secondary-outline" onClick={() => handlePreview(file)}>
                    <FontAwesomeIcon icon={faEye} />
                </button>}

                <button type="button" className="btn btn-secondary-outline" onClick={() => handleChangeName(file)}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>

                <button type="button" className="btn btn-secondary-outline" onClick={() => handleDelete(file)}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
}