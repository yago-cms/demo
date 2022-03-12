import { faPlus } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Drawer } from "../Drawer";
import ContentBlock from "./ContentBlock";
import ContentTypeList from "./ContentTypeList";

const getContentTypes = (contentTypeGroups) =>
    contentTypeGroups.map(contentTypeGroup => contentTypeGroup.types).flat();

// Merge default and vendor configs
export let contentTypeGroups = require('../../content-editor').contentTypeGroups;
// export let contentTypeIcons = require('../../content-editor').contentTypeIcons;
let contentEditorFiles = require.context('../../../vendor/', true, /content-editor\/index\.js$/i);

contentEditorFiles.keys().forEach(file => {
    contentTypeGroups = contentTypeGroups.concat(contentEditorFiles(file).contentTypeGroups);
    // contentTypeIcons = {
    //     ...contentTypeIcons,
    //     ...contentEditorFiles(file).contentTypeIcons
    // };
});

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const [sourceSectionIndex, sourceColumnIndex] = droppableSource.droppableId.split('-');
    const [destinationSectionIndex, destinationColumnIndex] = droppableDestination.droppableId.split('-');

    const result = {};
    _.set(result, `[${sourceSectionIndex}][${sourceColumnIndex}]`, sourceClone);
    _.set(result, `[${destinationSectionIndex}][${destinationColumnIndex}]`, destClone);

    return result;
};

const insert = (list, index, block) => {
    const result = Array.from(list);

    result.splice(index, 0, block);

    return result;
};

export const ContentBlockEditor = ({ sections, handleChange }) => {
    const [drawerActive, setDrawerActive] = useState(false);

    const handleDragEnd = ({ draggableId, source, destination }) => {
        if (!destination) {
            return;
        }

        const sourceIndex = source.droppableId;
        const destinationIndex = destination.droppableId;

        const [sourceSectionIndex, sourceColumnIndex] = sourceIndex.split('-');
        const [destinationSectionIndex, destinationColumnIndex] = destinationIndex.split('-');

        if (source.droppableId == 'new') {
            // add new block
            let block = null;

            getContentTypes(contentTypeGroups).some(contentType => {
                if (contentType.id == draggableId) {
                    block = {
                        id: `block-${new Date().getTime()}`,
                        isNew: true,
                        type: contentType.id,
                        pageTemplateSectionId: sections[destinationSectionIndex].id,
                        pageTemplateSectionColumnId: sections[destinationSectionIndex].columns[destinationColumnIndex].id,
                    };

                    return true;
                }
            });

            if (!block) {
                return;
            }

            const blocks = insert(sections[destinationSectionIndex].columns[destinationColumnIndex].blocks, destination.index, block);
            const newSections = [...sections];

            newSections[destinationSectionIndex].columns[destinationColumnIndex].blocks = blocks;
            handleChange(newSections);
        } else if (sourceIndex == destinationIndex) {
            // move within the same column
            const blocks = reorder(sections[sourceSectionIndex].columns[sourceColumnIndex].blocks, source.index, destination.index);
            const newSections = [...sections];

            newSections[sourceSectionIndex].columns[sourceColumnIndex].blocks = blocks;
            handleChange(newSections);
        } else {
            // move to another column
            const result = move(
                sections[sourceSectionIndex].columns[sourceColumnIndex].blocks,
                sections[destinationSectionIndex].columns[destinationColumnIndex].blocks,
                source,
                destination
            );

            const newSections = [...sections];

            newSections[sourceSectionIndex].columns[sourceColumnIndex].blocks = result[sourceSectionIndex][sourceColumnIndex];
            newSections[destinationSectionIndex].columns[destinationColumnIndex].blocks = result[destinationSectionIndex][destinationColumnIndex];

            newSections[destinationSectionIndex].columns[destinationColumnIndex].blocks[destination.index].pageTemplateSectionId = newSections[destinationSectionIndex].id;
            newSections[destinationSectionIndex].columns[destinationColumnIndex].blocks[destination.index].pageTemplateSectionColumnId = newSections[destinationSectionIndex].columns[destinationColumnIndex].id;
            handleChange(newSections);
        }
    }

    const handleRemove = (blockIndex, sectionIndex, columnIndex) => {
        const blocks = sections[sectionIndex].columns[columnIndex].blocks;
        blocks.splice(blockIndex, 1);

        const newSections = [...sections];

        newSections[sectionIndex].columns[columnIndex].blocks = blocks;
        handleChange(newSections);
    };

    return <div>
        <div className="sticky-top p-3 mb-3 bg-white border">
            <button type="button" className="btn btn-sm btn-primary" onClick={() => setDrawerActive(true)}><FontAwesomeIcon icon={faPlus} /> Add content</button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
            <Drawer
                active={drawerActive}
                setActive={setDrawerActive}
                autoDetatch={false}
                push={true}
                heading="Add content"
            >
                <p>Drag the content type you want and drop it where you want.</p>

                <Droppable
                    key={0}
                    droppableId={`new`}
                    isDropDisabled={true}
                >
                    {(provided) =>
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <ContentTypeList typeGroups={contentTypeGroups} />

                            {provided.placeholder}
                        </div>
                    }
                </Droppable>
            </Drawer>

            {sections.map((section, sectionIndex) =>
                <div className="content-editor__section" key={sectionIndex}>
                    <h5>{section.name}</h5>

                    <div className="content-editor__column-list">
                        {section.columns.map((column, columnIndex) =>
                            <Droppable
                                key={`${sectionIndex}-${columnIndex}`}
                                droppableId={`${sectionIndex}-${columnIndex}`}
                            >
                                {(provided) =>
                                    <div className="content-editor__column col">
                                        <div
                                            className="content-editor__column__droppable"
                                            style={{ height: '100%', minHeight: '1px' }}
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            {column.blocks.map((block, blockIndex) =>
                                                <Draggable
                                                    key={block.id}
                                                    draggableId={block.id}
                                                    index={blockIndex}
                                                >
                                                    {(provided) =>
                                                        <ContentBlock
                                                            block={block}
                                                            blockIndex={blockIndex}
                                                            sectionIndex={sectionIndex}
                                                            columnIndex={columnIndex}
                                                            provided={provided}
                                                            handleRemove={handleRemove}
                                                            handleUpdate={() => { handleChange(sections) }}
                                                        />
                                                    }
                                                </Draggable>
                                            )}

                                            {provided.placeholder}
                                        </div>
                                    </div>
                                }
                            </Droppable>
                        )}
                    </div>
                </div>
            )}
        </DragDropContext>
    </div>
};