import { Draggable } from "react-beautiful-dnd";
import { faAngleDown, faAngleLeft } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import classNames from "classnames";
import ContentType from "./ContentType";
import PropTypes from "prop-types";

export default function ContentTypeList({ typeGroups }) {
    const [groupActive, setGroupActive] = useState([]);

    useEffect(() => {
        typeGroups.map((group, index) => {
            if (group.expanded) {
                const newGroupActive = [...groupActive];
                newGroupActive[index] = true;
                setGroupActive(newGroupActive);
            }
        });
    }, []);

    let typeIndex = 0;

    return <div className="content-type-group-list">
        {typeGroups.map((group, groupIndex) => (
            <div className={classNames('content-type-group', {
                'content-type-group--expanded': groupActive[groupIndex]
            })} key={groupIndex}>
                <div className="content-type-group__header" onClick={() => {
                    const newGroupActive = [...groupActive];
                    newGroupActive[groupIndex] = !(groupActive[groupIndex] ?? false);
                    setGroupActive(newGroupActive);
                }}>
                    <h5>{group.name}</h5>

                    {groupActive[groupIndex] ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleLeft} />}
                </div>

                <div className="content-type-group__body">
                    {group.types.map((type) => <Draggable
                        key={type.id}
                        draggableId={type.id}
                        index={++typeIndex}
                    >
                        {(provided, snapshot) =>
                            <ContentType type={type} provided={provided} />
                        }
                    </Draggable>
                    )}
                </div>
            </div>
        ))}

    </div>
}

ContentTypeList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
};