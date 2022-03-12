import { faBookOpen, faCode, faColumns, faGlobe, faHeading, faImages, faLayerGroup, faList, faPhotoVideo, faRectangleLandscape, faText } from "@fortawesome/pro-duotone-svg-icons";
import { AccordionBlockEditor, AccordionPreview } from "./Accordion";
import { CardBlockEditor, CardPreview, CardTitle } from "./Card";
import { CarouselBlockEditor, CarouselPreview } from "./Carousel";
import { CtaBlockEditor, CtaPreview } from "./Cta";
import { FieldBlockEditor, FieldPreview } from "./Field";
import { HeadingBlockEditor, HeadingPreview } from "./Heading";
import { HtmlBlockEditor, HtmlPreview } from "./Html";
import { LeadBlockEditor, LeadPreview } from "./Lead";
import { ListBlockEditor, ListPreview } from "./List";
import { MediaBlockEditor, MediaPreview } from "./Media";

export const contentTypeGroups = [
    {
        name: 'Regular',
        expanded: true,
        types: [
            {
                id: 'text',
                name: 'Text',
                icon: faText,
            },
            {
                id: 'heading',
                name: 'Heading',
                icon: faHeading,
                blockEditor: HeadingBlockEditor,
                blockPreview: HeadingPreview,
            },
            {
                id: 'lead',
                name: 'Lead',
                icon: faBookOpen,
                blockEditor: LeadBlockEditor,
                blockPreview: LeadPreview,
            },
            {
                id: 'cta',
                name: 'Call to action',
                icon: faRectangleLandscape,
                blockEditor: CtaBlockEditor,
                blockPreview: CtaPreview,
            },
            {
                id: 'media',
                name: 'Media',
                icon: faPhotoVideo,
                blockEditor: MediaBlockEditor,
                blockPreview: MediaPreview,
                hidePreviewDetails: true,
            },
            {
                id: 'listing',
                name: 'List',
                icon: faList,
                blockEditor: ListBlockEditor,
                blockPreview: ListPreview,
            },
            {
                id: 'html',
                name: 'HTML',
                icon: faCode,
                blockEditor: HtmlBlockEditor,
                blockPreview: HtmlPreview,
                hidePreviewDetails: true,
            },
        ],
    },
    {
        name: 'Layout',
        types: [
            {
                id: 'card',
                name: 'Card',
                icon: faColumns,
                description: 'Card block based on custom template.',
                blockEditor: CardBlockEditor,
                blockPreview: CardPreview,
                blockTitle: CardTitle,
            },
            {
                id: 'accordion',
                name: 'Accordion',
                icon: faLayerGroup,
                description: 'Accordion.',
                blockEditor: AccordionBlockEditor,
                blockPreview: AccordionPreview,
                hidePreviewDetails: true,
            },
            {
                id: 'carousel',
                name: 'Carousel',
                icon: faImages,
                description: 'Media slide show.',
                blockEditor: CarouselBlockEditor,
                blockPreview: CarouselPreview,
                hidePreviewDetails: true,
            },
            {
                id: 'field',
                name: 'Field',
                icon: faGlobe,
                description: 'Globally re-usable field.',
                blockEditor: FieldBlockEditor,
                blockPreview: FieldPreview,
                hidePreviewDetails: true,
            },
        ],
    },
];