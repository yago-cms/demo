import { FileManager } from "../../components/FileManager";
import { Page } from "../../components/Page";

export const FileIndex = () => {
    return (
        <Page heading="Files">
            <FileManager />
        </Page>
    );
};