import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import PropTypes from "prop-types";

export default function ContentType({ type, provided }) {
    return <div className="content-type"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
    >
        <div className="content-type__icon">
            <FontAwesomeIcon icon={type.icon} />
        </div>

        <div className="content-type__body">
            <h5 className={classNames({ 'mb-0': !type.description })}>{type.name}</h5>
            {type.description && <p>{type.description}</p>}
        </div>
    </div>
}

ContentType.propTypes = {
    type: PropTypes.object.isRequired,
};