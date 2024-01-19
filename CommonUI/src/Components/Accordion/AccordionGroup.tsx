import React, { FunctionComponent, ReactElement } from 'react';

export interface ComponentProps {
    children: Array<ReactElement> | ReactElement;
}

const AccordionGroup: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    return <div className="row accordian-group">{props.children}</div>;
};

export default AccordionGroup;
