import { Drawer } from "../Drawer";
import { PreviewFile } from "./File";

export const PreviewDrawer = ({ currentFile, isPreviewActive, setIsPreviewActive }) => {
    return (
        <Drawer
            heading="Preview file"
            active={isPreviewActive}
            setActive={setIsPreviewActive}
            size="fullscreen"
        >
            <PreviewFile file={currentFile} />
        </Drawer>
    );
};