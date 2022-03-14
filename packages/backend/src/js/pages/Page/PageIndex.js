import { useMutation, useQuery } from "@apollo/client";
import Tree, { moveItemOnTree, mutateTree } from "@atlaskit/tree";
import { faAngleDown, faAngleRight, faCog, faColumns, faFileAlt, faPlus, faTrashAlt } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { Page } from "../../components/Page";
import { pageToNode, sortTree } from "../../components/PageTree";
import { DELETE_PAGES, GET_PAGES, SORT_PAGES } from "../../queries";
import { usePrompt } from "../../tmp-prompt";

export const PageIndex = () => {
  const [tree, setTree] = useState({
    items: {
    },
  });
  const [isDirty, setIsDirty] = useState(false);

  const navigate = useNavigate();

  const getPagesResult = useQuery(GET_PAGES);
  const [sortPages] = useMutation(SORT_PAGES, {
    refetchQueries: [
      GET_PAGES
    ]
  });
  const [deletePages] = useMutation(DELETE_PAGES, {});

  usePrompt('Are you sure you want to leave this page? You will lose any unsaved data.', isDirty);

  useEffect(() => {
    if (getPagesResult.loading == false && getPagesResult.data) {
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
    }
  }, [getPagesResult.loading, getPagesResult.data]);

  const renderItem = ({ item, onExpand, onCollapse, provided }) => {
    return <div
      className="page-tree__leaf"
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div className="page-tree__leaf__handle"
        {...provided.dragHandleProps}
      >
      </div>
      <div className="page-tree__leaf__icon">
        {item.children && item.children.length > 0
          ? item.isExpanded
            ? <button className="btn btn-sm" onClick={() => onCollapse(item.id)}>
              <FontAwesomeIcon icon={faAngleDown} fixedWidth />
            </button>
            : <button className="btn btn-sm" onClick={() => onExpand(item.id)}>
              <FontAwesomeIcon icon={faAngleRight} fixedWidth />
            </button>
          : <button className="btn btn-sm">
            <div style={{ width: '1.25em' }}>&bull;</div>
          </button>
        }
      </div>

      <div
        className="page-tree__leaf__label row"
        onClick={() => handleShow(item.id)}
      >
        <div className="col">
          {item.data.title}
        </div>

        <div className="col-2">
          {item.data.isRoot && <><span className="badge bg-dark">Root</span> </>}
          {!item.data.isPublished && <><span className="badge bg-secondary">Draft</span> </>}
          {!item.data.isShownInMenu && <><span className="badge bg-secondary bg-opacity-75">Hidden</span> </>}
        </div>

        <div className="col-1">
          {item.data.template}
        </div>
      </div>

      <div className="page-tree__leaf__actions">
        <div className="btn-group">
          <button className="btn btn-outline-success" onClick={() => handleAdd(item.id)}>
            <FontAwesomeIcon icon={faPlus} />
          </button>

          {item.children.length == 0 &&
            <button className="btn btn-outline-danger" onClick={() => handleRemove(item.id)}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          }
        </div>
      </div>
    </div>
  };

  const handleShow = (id) => {
    navigate(`/pages/${id}`);
  };

  const handleAdd = (parentId) => {
    navigate(`/pages/create/${parentId}`);
  };

  const handleRemove = (id) => {
    _.forEach(tree.items, item => {
      if (item.children.includes(id)) {
        _.pull(item.children, id);

        return false;
      }
    });

    delete tree.items[id];

    setTree(_.cloneDeep(tree));

    setIsDirty(true);
  };

  const handleSave = () => {
    // Deleted pages
    const oldPages = getPagesResult.data.pages;
    const newPages = tree.items;
    const deletedPages = [];

    oldPages.forEach(oldPage => {
      let deleted = true;

      _.forEach(newPages, newPage => {
        if (oldPage.id == newPage.id) {
          deleted = false;
        }
      });

      if (deleted) {
        deletedPages.push(oldPage.id);
      }
    });

    const deletePagesInput = deletedPages;

    deletePages({
      variables: {
        input: deletePagesInput
      }
    })
      .then(() => {
        // Sort pages
        let sortPageInput = sortTree(tree, tree.items[tree.rootId].children);

        sortPageInput = sortPageInput.map(sortedPage => ({
          id: sortedPage.id,
          parent_page_id: sortedPage.parentId,
          sorting: sortedPage.sorting,
        }));

        sortPages({
          variables: {
            input: sortPageInput
          }
        });
      });

    setIsDirty(false);
  };

  const handleExpand = (id) => {
    setTree(mutateTree(tree, id, { isExpanded: true }));
  };

  const handleCollapse = (id) => {
    setTree(mutateTree(tree, id, { isExpanded: false }));
  };

  const handleDragEnd = (source, destination) => {
    if (!destination) {
      return;
    }

    const newTree = moveItemOnTree(tree, source, destination);
    setTree(newTree);

    setIsDirty(true);
  };

  const Footer = () => (
    <button className="btn btn-primary" onClick={handleSave} disabled={!isDirty}>Save</button>
  );

  const actions = [
    {
      path: '/pages/templates',
      text: 'Page templates',
      icon: faFileAlt,
    },
    {
      path: '/pages/cards',
      text: 'Card templates',
      icon: faColumns,
    },
  ];

  const isLoading = getPagesResult.loading;
  const error = getPagesResult.error;

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return <Page heading="Pages" footer={<Footer />} actions={actions}>
    <Link className="btn btn-outline-success" to="/pages/create/0">
      <FontAwesomeIcon icon={faPlus} /> Add root page
    </Link>

    <div className="page-tree">
      <Tree
        tree={tree}
        renderItem={renderItem}
        onExpand={handleExpand}
        onCollapse={handleCollapse}
        onDragEnd={handleDragEnd}
        isDragEnabled
        isNestingEnabled
      />
    </div>
  </Page>
};