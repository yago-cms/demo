import { useQuery } from "@apollo/client";
import { faArrowLeft, faEdit, faPlus } from "@fortawesome/pro-duotone-svg-icons";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { Page } from "../../components/Page";
import { Table } from "../../components/Table";
import { GET_PAGE_TEMPLATES } from "../../queries";

export const PageTemplateIndex = () => {
    const { loading: isLoading, error, data } = useQuery(GET_PAGE_TEMPLATES);
    const navigate = useNavigate();

    const actions = [
        { icon: faArrowLeft, path: '/pages' },
        { icon: faPlus, text: 'Add page template', path: '/pages/templates/create' },
    ];

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <Page heading="Page templates" actions={actions}>
            <Table
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
                                onClick: (event, data) => { navigate(`/pages/templates/${data.id}`); },
                            }
                        ]
                    },
                ]}
                data={data.pageTemplates}
                options={{
                    sorting: true,
                }}
            />
        </Page>
    );
};