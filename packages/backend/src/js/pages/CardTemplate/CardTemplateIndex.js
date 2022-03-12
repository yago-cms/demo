import { useQuery } from "@apollo/client";
import { faArrowLeft, faEdit, faPlus } from "@fortawesome/pro-duotone-svg-icons";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { Page } from "../../components/Page";
import { Table } from "../../components/Table";
import { GET_CARD_TEMPLATES } from "../../queries";

export const CardTemplateIndex = () => {
    const getCardTemplatesResult = useQuery(GET_CARD_TEMPLATES);
    const navigate = useNavigate();

    const loading = getCardTemplatesResult.loading;
    const error = getCardTemplatesResult.error;

    const actions = [
        { icon: faArrowLeft, path: '/pages' },
        { icon: faPlus, text: 'Add card template', path: '/pages/cards/create' },
    ];

    if (loading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <Page heading="Card templates" actions={actions}>
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
                                onClick: (event, data) => { navigate(`/pages/cards/${data.id}`); },
                            }
                        ]
                    },
                ]}
                data={getCardTemplatesResult.data.cardTemplates}
                options={{
                    sorting: true,
                }}
            />
        </Page>
    );
};