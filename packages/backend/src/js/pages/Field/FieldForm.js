import { useMutation, useQuery } from "@apollo/client";
import { faArrowLeft } from "@fortawesome/pro-duotone-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import { ContentBlockEditor } from "../../components/ContentBlockEditor";
import { Error } from "../../components/Error";
import { Input } from "../../components/Form/Input";
import { Loading } from "../../components/Loading";
import { Page } from "../../components/Page";
import { GET_FIELD, GET_FIELDS, UPSERT_FIELD } from "../../queries";
import { usePrompt } from "../../tmp-prompt";

const schema = yup.object({
  name: yup.string().required(),
  key: yup.string().required(),
});

const getBlocks = (sections) =>
  sections.map((section, sectionIndex) =>
    section.columns.map((column, columnIndex) =>
      column.blocks.map(block => ({ ...block, sectionIndex, columnIndex }))
    ).flat()
  ).flat();

export const FieldForm = () => {
  const [isSectionsDirty, setIsSectionsDirty] = useState(false);
  const [isForcedClean, setIsForcedClean] = useState(false);
  const [sections, setSections] = useState([{
    id: 1,
    name: 'Fields',
    columns: [
      {
        id: 1,
        blocks: [],
      }
    ],
  }]);

  const { id } = useParams();
  const isNew = id === undefined;
  const navigate = useNavigate();

  const {
    control,
    formState: { isDirty, errors },
    handleSubmit,
    register,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const nameValue = useWatch({
    control,
    name: 'name',
  });

  const getFieldResult = useQuery(GET_FIELD, {
    variables: {
      id
    },
    skip: isNew,
  });
  const [upsertField, upsertFieldResult] = useMutation(UPSERT_FIELD, {
    onCompleted: (data) => {
      navigate(`/fields/${data.upsertField.id}`);
    },
    update: (cache, { data: { upsertField } }) => {
      const data = cache.readQuery({
        query: GET_FIELDS
      });

      if (data !== null) {
        const fields = _.cloneDeep(data.fields);

        if (isNew) {
          fields.push(upsertField);
        } else {
          fields.forEach(field => {
            if (field.id === upsertField.id) {
              field = upsertField;
            }
          });
        }

        cache.writeQuery({
          query: GET_FIELDS,
          data: {
            fields
          },
        });
      }
    },
  });

  usePrompt('Are you sure you want to leave this page? You will lose any unsaved data.', (isDirty || isSectionsDirty) && !isForcedClean);

  const handleChange = (sections) => {
    setSections(sections);
    setIsSectionsDirty(true);
  };

  const handleSave = (data) => {
    setIsSectionsDirty(false);
    setIsForcedClean(true);

    const blocks = getBlocks(sections);

    const getBlockInput = (block, i) => ({
      id: !block.isNew ? block.id : null,
      field_id: field.id,
      type: block.type,
      content: block.content ?? '',
      sorting: i,
    });

    const getFieldInput = (field) => ({
      id: field.id ?? null,
      name: field.name,
      key: field.key,
      fieldBlocks: {
        upsert: field.fieldBlocks.map(getBlockInput),
        delete: [],
      }
    });

    const field = {
      id: !isNew ? id : null,
      name: data.name,
      key: data.key,
      fieldBlocks: blocks
    };

    const upsertFieldInput = getFieldInput(field);

    // Deleted blocks
    if (!isNew) {
      const oldBlocks = getFieldResult.data.field.fieldBlocks;
      const newBlocks = getBlocks(sections);
      const deletedBlocks = [];

      oldBlocks.forEach(oldBlock => {
        let deleted = true;

        newBlocks.forEach(newBlock => {
          if (oldBlock.id == newBlock.id) {
            deleted = false;
          }
        });

        if (deleted) {
          deletedBlocks.push(oldBlock);
        }
      });

      deletedBlocks.forEach(deletedBlock => {
        upsertFieldInput.fieldBlocks.delete.push(deletedBlock.id);
      });
    }

    upsertField({
      variables: {
        input: upsertFieldInput
      }
    });
  };

  const Footer = () => (
    <>
      <div className="d-flex">
        <div className="ms-auto">
          <button className="btn btn-outline-primary" type="button" onClick={handleSubmit(handleSave)}>Save</button>
        </div>
      </div>
    </>
  );

  const actions = [
    { icon: faArrowLeft, path: '/fields' },
  ];

  const heading = isNew ? 'Add field' : 'Edit field';

  const loading = getFieldResult.loading || upsertFieldResult.loading;
  const error = getFieldResult.error || upsertFieldResult.error;

  useEffect(() => {
    if (getFieldResult.loading === false && getFieldResult.data) {
      const field = getFieldResult.data.field;

      const sections = [{
        id: 1,
        name: 'Fields',
        columns: [
          {
            id: 1,
            blocks: [],
          }
        ],
      }];

      field.fieldBlocks.forEach(fieldBlock => {
        sections[0].columns[0].blocks.push({
          id: fieldBlock.id,
          type: fieldBlock.type,
          content: fieldBlock.content,
          sorting: fieldBlock.sorting,
        });
      });

      setSections(sections);
      setValue('name', field.name);
      setValue('key', field.key);
    }
  }, [getFieldResult.loading, getFieldResult.data]);

  useEffect(() => {
    if (nameValue != '') {
      setValue('key', _.kebabCase(nameValue));
    }
  }, [nameValue]);

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Page heading={heading} actions={actions} footer={<Footer />}>
        <Input
          label="Name"
          errors={errors}
          {...register('name')}
        />

        <Input
          label="Key"
          disabled
          errors={errors}
          {...register('key')}
        />

        <ContentBlockEditor sections={sections} handleChange={handleChange} />
      </Page>
    </form>
  );
};