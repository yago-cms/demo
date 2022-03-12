import { faArrowLeft, faEdit, faFolder, faTrash } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDrag, useDrop } from 'react-dnd';
import classNames from "classnames";

export default function Directory({
    file,
    navigate,
    handleDrop,
    isSelectMode,
    handleChangeName,
    handleDelete
}) {
    const [{ isOver, isTarget }, drop] = useDrop({
        accept: ['file', 'directory'],
        drop: handleDrop,
        canDrop: (item) => item.file.name != file.name,
        collect: (monitor) => ({
            isTarget: monitor.canDrop(),
            isOver: monitor.isOver(),
        }),
    });

    const [{ opacity }, drag] = useDrag(() => ({
        type: 'directory',
        item: {
            type: 'directory',
            file
        },
        canDrag: () => !isSelectMode,
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.4 : 1.0,
        }),
    }), [file]);

    const isParentDirectory = file.extension == '..';

    return (
        <div
            className="file-manager__file"
            ref={(node) => drag(drop(node))}
            style={{ opacity }}
        >
            <div
                className={classNames('file-manager__file__body', {
                    'file-manager__file__body--is-directory': true,
                    'file-manager__file__body--is-target': isTarget,
                    'file-manager__file__body--is-over': isOver,
                })}
                onClick={() => navigate(file.path)}
            >
                <div className="file-manager__file__icon">
                    {isParentDirectory
                        ? <FontAwesomeIcon icon={faArrowLeft} fixedWidth />
                        : <FontAwesomeIcon icon={faFolder} fixedWidth />
                    }
                </div>

                <div className="file-manager__file__name">
                    {file.name}
                </div>
            </div>

            <div className="file-manager__file__footer">
                <button type="button" className="btn btn-secondary-outline" onClick={() => handleChangeName(file)}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>

                <button type="button" className="btn btn-secondary-outline" onClick={() => handleDelete(file)}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
};