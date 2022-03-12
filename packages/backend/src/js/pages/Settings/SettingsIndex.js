import { useMutation, useQuery } from "@apollo/client";
import { faCog, faPhotoVideo } from "@fortawesome/pro-duotone-svg-icons";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { Page } from "../../components/Page";
import { PageSection } from "../../components/PageSection";
import { GET_CURRENT_VERSION, GET_LATEST_VERSION, UPDATE_TO_LATEST_VERSION } from "../../queries";

export const actions = [
    {
        path: '/settings',
        text: 'General',
        icon: faCog,
    },
    {
        path: '/settings/media',
        text: 'Media',
        icon: faPhotoVideo,
    },
];

const Update = () => {
    const getCurrentVersionResult = useQuery(GET_CURRENT_VERSION);
    const getLatestVersionResult = useQuery(GET_LATEST_VERSION);
    const [updateToLatestVersion, updateToLatestVersionResult] = useMutation(UPDATE_TO_LATEST_VERSION);

    const isLoading = getCurrentVersionResult.loading || getLatestVersionResult.loading;
    const error = getCurrentVersionResult.error || getLatestVersionResult.error;

    const handleUpdate = () => {
        updateToLatestVersion()
            .then((response) => {
                const { message } = response.data.updateToLatestVersion;
                console.log(message);
                getCurrentVersionResult.refetch();
            });
    };

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    const currentVersion = 'v' + getCurrentVersionResult.data.currentVersion.version;
    const latestVersion = getLatestVersionResult.data.latestVersion.version;

    return (
        <PageSection heading="Update">
            <div className="w-50">
                <p><strong>Note:</strong> The update action is not meant to be run on a production environment. It will probably break everything. The proper procedure for updating is to do it locally and then deploy the changes via git.</p>
            </div>

            {updateToLatestVersionResult.data &&
                <div className="alert alert-success">
                    Update completed successfully.
                </div>
            }

            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">Current version</h5>
                    <p className="card-text">The currently installed version is {currentVersion}</p>
                </div>
            </div>

            {currentVersion !== latestVersion
                ? <div className="card border-info">
                    <div className="card-body">
                        <h5 className="card-title">New release</h5>
                        <p className="card-text">There is a new release available.</p>
                        {updateToLatestVersionResult.error &&
                            <p className="card-text text-danger">Could not update. Check the devleoper console for error details.</p>
                        }
                        <button
                            className="btn btn-outline-primary"
                            type="button"
                            onClick={handleUpdate}
                            disabled={updateToLatestVersionResult.loading}
                        >
                            {updateToLatestVersionResult.loading && <Loading size="small" isInline />} Update to {latestVersion}
                        </button>
                    </div>
                </div>
                : <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Latest version</h5>
                        <p className="card-text">You have the latest version of {latestVersion} installed.</p>
                    </div>
                </div>
            }
        </PageSection >
    );
};

export const SettingsIndex = () => {
    return (
        <Page heading="Settings" actions={actions}>
            <Update />
        </Page>
    );
};