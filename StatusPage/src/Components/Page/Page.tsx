import React, { FunctionComponent, ReactElement } from 'react';
import Page, {
    ComponentProps as PageComponentProps,
} from 'CommonUI/src/Components/Page/Page';

const StatusPagePage: FunctionComponent<PageComponentProps> = (
    props: PageComponentProps
): ReactElement => {
    return (
        <Page
            {...props}
            className="w-full mt-5 mb-20 h-fullmb-auto h-full p-0"
        />
    );
};

export default StatusPagePage;
