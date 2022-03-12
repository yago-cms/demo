import { Editor } from '@tinymce/tinymce-react';

export const Wysiwyg = ({ value, handleChange }) => {
    const handleEditorChange = (value) => handleChange(value);

    return (
        <Editor
            tinymceScriptSrc="/backend/js/tinymce/tinymce.min.js"
            value={value}
            init={{}}
            onEditorChange={handleEditorChange}
        />
    );
};
