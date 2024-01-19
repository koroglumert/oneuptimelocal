import React, {
    FunctionComponent,
    LazyExoticComponent,
    Suspense,
    lazy,
} from 'react';
import { ComponentProps } from './MarkdownViewer';

const MarkdownViewer: LazyExoticComponent<FunctionComponent<ComponentProps>> =
    lazy(() => {
        return import('./MarkdownViewer');
    });

const LazyMarkdownViewer: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): JSX.Element => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MarkdownViewer {...props} />
        </Suspense>
    );
};

export default LazyMarkdownViewer;
