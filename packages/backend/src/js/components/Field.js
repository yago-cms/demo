import { faCaretDown, faCaretUp, faTimes } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const FieldActions = ({ fields, index, swap, remove }) => {
    const isFirst = index == 0;
    const isLast = index == fields.length - 1;

    return (
        <div className="btn-group">
            {!isFirst &&
                <button
                    className="btn btn-sm btn-outline-secondary"
                    type="button"
                    onClick={() => swap(index, index - 1)}
                >
                    <FontAwesomeIcon icon={faCaretUp} />
                </button>
            }
            {!isLast &&
                <button
                    className="btn btn-sm btn-outline-secondary"
                    type="button"
                    onClick={() => swap(index, index + 1)}
                >
                    <FontAwesomeIcon icon={faCaretDown} />
                </button>
            }

            <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={() => remove(index)}
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
        </div>
    );
};