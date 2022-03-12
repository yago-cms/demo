import { useQuery } from "@apollo/client";
import Tree, { mutateTree } from '@atlaskit/tree';
import { faAngleDown, faAngleRight } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { GET_PAGES } from "../queries";
import { Error } from "./Error";
import { Loading } from "./Loading";

export const pageToNode = (page) => (
    {
        id: page.id,
        children: [],
        hasChildren: false,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
            title: page.name,
            template: page.pageTemplate?.name,
            isRoot: page.is_root,
            isPublished: page.is_published,
            isShownInMenu: page.is_shown_in_menu,
        },
    }
);

export const sortTree = (tree, items, parentId = 0) => {
    let sortedTree = [];
    let sorting = 0;

    items.forEach(item => {
        const child = tree.items[item];

        sortedTree.push({
            id: child.id,
            parentId,
            sorting,
        });

        if (child.children.length > 0) {
            sortedTree = sortedTree.concat(sortTree(tree, child.children, child.id));
        }

        sorting++;
    });

    return sortedTree;
};

export const PageTree = ({ onSelectPage }) => {
    const [tree, setTree] = useState({
        items: {
        },
    });

    const getPagesResult = useQuery(GET_PAGES);

    const isLoading = getPagesResult.loading;
    const error = getPagesResult.error;

    useEffect(() => {
        if (getPagesResult.loading === true || !getPagesResult.data) {
            return;
        }

        const tree = {
            rootId: 'root',
            items: {
                'root': {
                    id: 'root',
                    children: [],
                    hasChildren: true,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: {
                        title: 'root',
                    },
                },
            },
        };
        const pages = _.keyBy(getPagesResult.data.pages, 'id');

        _.forEach(getPagesResult.data.pages, (page) => {
            const id = page.id;

            if (!tree.items[id]) {
                tree.items[id] = pageToNode(page);
            }

            const parentId = page.parent_page_id === '0' ? 'root' : page.parent_page_id;
            let parentItem = tree.items[parentId];

            if (!parentItem) {
                tree.items[parentId] = pageToNode(pages[parentId]);
                parentItem = tree.items[parentId];
            }

            parentItem.children = _.union(parentItem.children, [id]);
        });

        setTree(tree);
    }, [getPagesResult.loading, getPagesResult.data]);

    const renderItem = ({ item, onExpand, onCollapse, provided }) => {
        return <div
            className="page-tree__leaf"
            ref={provided.innerRef}
            style={provided.draggableProps.style}
        >
            <div className="page-tree__leaf__icon">
                {item.children && item.children.length > 0
                    ? item.isExpanded
                        ? <button className="btn btn-sm" type="button" onClick={() => onCollapse(item.id)}>
                            <FontAwesomeIcon icon={faAngleDown} fixedWidth />
                        </button>
                        : <button className="btn btn-sm" type="button" onClick={() => onExpand(item.id)}>
                            <FontAwesomeIcon icon={faAngleRight} fixedWidth />
                        </button>
                    : <button className="btn btn-sm" type="button">
                        <div style={{ width: '1.25em' }}>&bull;</div>
                    </button>
                }
            </div>

            <div
                className="page-tree__leaf__label"
                onClick={() => onSelectPage(item.id)}
            >
                <div>
                    {item.data.title}
                </div>
            </div>
        </div>
    };

    const handleExpand = (id) => {
        setTree(mutateTree(tree, id, { isExpanded: true }));
    };

    const handleCollapse = (id) => {
        setTree(mutateTree(tree, id, { isExpanded: false }));
    };

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return <div className="page-tree">
        <Tree
            tree={tree}
            renderItem={renderItem}
            onExpand={handleExpand}
            onCollapse={handleCollapse}
            isNestingEnabled
        />
    </div>
};