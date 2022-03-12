import { useQuery } from "@apollo/client";
import { faEdit, faPlus } from "@fortawesome/pro-duotone-svg-icons";
import { useNavigate } from "react-router";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { Page } from "../../components/Page";
import { Table } from "../../components/Table";
import { GET_FIELDS } from "../../queries";

export const FieldIndex = () => {
  const getFieldsResult = useQuery(GET_FIELDS);
  const navigate = useNavigate();

  const loading = getFieldsResult.loading;
  const error = getFieldsResult.error;

  const actions = [
    { icon: faPlus, text: 'Add field', path: '/fields/create' },
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <Page heading="Fields" actions={actions}>
      <Table
        heading="Fields"
        columns={[
          { name: 'Name', field: 'name' },
          { name: 'Created', field: 'created_at' },
          { name: 'Updated', field: 'updated_at' },
          {
            name: 'Actions',
            actions: [
              {
                icon: faEdit,
                text: 'Edit',
                onClick: (event, data) => { navigate(`/fields/${data.id}`); },
              }
            ]
          },
        ]}
        data={getFieldsResult.data.fields}
        options={{
          sorting: true,
        }}
      />
    </Page>
  );
};