import React, { FunctionComponent, ReactElement } from 'react';
import ProjectCallSMSConfig from 'Model/Models/ProjectCallSMSConfig';

export interface ComponentProps {
    callSmsConfig: ProjectCallSMSConfig;
}

const ProjectCallSMSConfigElement: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    return <span>{props.callSmsConfig.name}</span>;
};

export default ProjectCallSMSConfigElement;
