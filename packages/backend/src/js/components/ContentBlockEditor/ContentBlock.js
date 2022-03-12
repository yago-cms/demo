import { faEdit, faSlidersVSquare, faTrash } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Editor } from '@tinymce/tinymce-react';
import classNames from "classnames";
import { Children, cloneElement, isValidElement, useMemo, useRef, useState } from "react";
import sanitizeHtml from 'sanitize-html';
import { contentTypeGroups } from ".";
import { Drawer } from "../Drawer";

export const truncateOptions = {
    length: 40
};

export const truncate = (string) => _.truncate(string, truncateOptions);

const getBlockContentType = type => {
    let blockType = null;

    contentTypeGroups.some(contentTypeGroup => {
        return contentTypeGroup.types.some(contentType => {
            if (type == contentType.id) {
                blockType = contentType;

                return true;
            }
        });
    });

    return blockType;
};

const Preview = ({ content, hideDetails, children }) => {
    const [showDetails, setShowDetails] = useState(false);

    const childrenWithProps = Children.map(children, child => {
        if (isValidElement(child)) {
            return cloneElement(child, { content, showDetails });
        }
        return child;
    });

    return <div>
        {!hideDetails &&
            <div className="float-end">
                <button
                    className={classNames('btn btn-sm btn-outline-secondary', {
                        active: showDetails
                    })}
                    type="button"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    <FontAwesomeIcon icon={faSlidersVSquare} />
                </button>
            </div>
        }

        {childrenWithProps}
    </div>
};

export default function ContentBlock({
    block,
    blockIndex,
    sectionIndex,
    columnIndex,
    provided,
    handleRemove,
    handleUpdate,
}) {
    const [drawerActive, setDrawerActive] = useState(false);
    const [value, setValue] = useState('');

    const editorRef = useRef(null);
    const childRef = useRef();
    let blockType = getBlockContentType(block.type);
    let { icon, blockEditor, blockPreview, blockTitle } = blockType;

    const isBlockEditor = !!blockEditor;
    const isBlockPreview = !!blockPreview;
    const isBlockTitle = !!blockTitle;

    const content = sanitizeHtml(block.content);

    const save = (otherValue = null) => {
        block.content = otherValue ? otherValue : value;

        handleUpdate();
    };

    const handleChange = (value) => {
        setValue(value);
    };

    const handleEdit = () => {
        setDrawerActive(true);
    };

    const handleSave = () => {
        if (isBlockEditor) {
            childRef.current.save()
                .catch(() => { });
        } else {
            save();
        }
    };

    const handleSaveClose = () => {
        if (isBlockEditor) {
            childRef.current.save()
                .then(() => {
                    setDrawerActive(false);
                })
                .catch(() => { });
        } else {
            save();
            setDrawerActive(false);
        }
    };

    const DrawerFooter = () => (
        <div className="btn-group">
            <button type="button" className="btn btn-outline-primary" onClick={handleSave}>Save</button>
            <button type="button" className="btn btn-outline-primary" onClick={handleSaveClose}>Save and close</button>
        </div>
    );

    const editor = useMemo(() => (
        <Editor
            tinymceScriptSrc="/backend/js/tinymce/tinymce.min.js"
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={content}
            init={{}}
            onEditorChange={handleChange}
        />
    ), [content]);

    const withHooks = (BlockEditor) => {
        return () => <BlockEditor
            ref={childRef}
            content={block.content}
            save={save}
        />
    };

    const BlockEditor = withHooks(blockEditor);

    const ContentPreview = () => {
        if (isBlockPreview) {
            const withContents = (BlockPreview) => {
                const content = block.content ? JSON.parse(block.content) : {};

                return () => <Preview
                    hideDetails={blockType.hidePreviewDetails}
                    content={content}
                >
                    <BlockPreview />
                </Preview>
            };

            const BlockPreview = withContents(blockPreview);

            return <BlockPreview />
        }

        return sanitizeHtml(block.content, {
            allowedTags: [],
            allowedAttributes: {},
        });
    };

    const ContentTitle = () => {
        if (isBlockTitle) {
            const withContents = (BlockTitle) => {
                const content = block.content ? JSON.parse(block.content) : {};

                return () => <BlockTitle
                    content={content}
                />
            };

            const BlockTitle = withContents(blockTitle);

            return <div className="content-editor__block__name">
                <BlockTitle />
            </div>
        }

        return <div className="content-editor__block__name">
            {blockType.name}
        </div>;
    };

    return <>
        <div
            className="content-editor__block"
            ref={provided.innerRef}
            {...provided.draggableProps}
        >
            <div
                className="content-editor__block__header"
                {...provided.dragHandleProps}
            >
                {icon && <div className="content-editor__block__icon">
                    <FontAwesomeIcon icon={icon} />
                </div>}

                <ContentTitle />

                <div className="content-editor__block__actions btn-group">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleEdit()}
                    ><FontAwesomeIcon icon={faEdit} /></button>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemove(blockIndex, sectionIndex, columnIndex)}
                    ><FontAwesomeIcon icon={faTrash} /></button>
                </div>
            </div>

            <div className="content-editor__block__body">
                <ContentPreview />
            </div>
        </div>

        <Drawer
            active={drawerActive}
            setActive={setDrawerActive}
            size="fullscreen"
            heading={`Edit ${block.type} block`}
            footer={<DrawerFooter />}
        >
            {isBlockEditor
                ? <div style={{ margin: '0.25rem' }}>
                    <BlockEditor />
                </div>
                : <div className="h-100">
                    {editor}
                </div>
            }
        </Drawer>
    </>
}