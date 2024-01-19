import {
    CheckOn,
    CriteriaFilter,
    FilterCondition,
    FilterType,
} from 'Common/Types/Monitor/CriteriaFilter';
import React, { FunctionComponent, ReactElement } from 'react';

export interface ComponentProps {
    criteriaFilter: CriteriaFilter | undefined;
    filterCondition?: FilterCondition | undefined;
}

const CriteriaFilterElement: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    let text: string = 'Check if this resource ';

    if (props.criteriaFilter?.checkOn === CheckOn.JavaScriptExpression) {
        text = 'Check if ';

        text +=
            'JavaScript expression ' +
            props.criteriaFilter?.value +
            ' - evaluates to true.';
    } else if (props.criteriaFilter?.checkOn === CheckOn.IsOnline) {
        if (props.criteriaFilter?.filterType === FilterType.True) {
            text += ' is online ';
        } else {
            text += ' is offline ';
        }
    } else {
        text += props.criteriaFilter?.checkOn.toString().toLowerCase() + ' ';

        if (props.criteriaFilter?.filterType) {
            if (
                props.criteriaFilter?.filterType
                    .toLowerCase()
                    .includes('contains')
            ) {
                text +=
                    props.criteriaFilter?.filterType.toString().toLowerCase() +
                    ' ';
            } else {
                text +=
                    'is ' +
                    props.criteriaFilter?.filterType.toString().toLowerCase() +
                    ' ';
            }
        }

        if (props.criteriaFilter?.value !== undefined) {
            text += props.criteriaFilter?.value.toString() + ' ';
        }
    }

    if (props.filterCondition === FilterCondition.All) {
        text += 'and,';
    }

    if (props.filterCondition === FilterCondition.Any) {
        text += 'or,';
    }

    return (
        <div className="flex w-full -ml-3">
            <div className="flex">
                <div className="ml-1 flex-auto py-0.5 text-sm leading-5 text-gray-500">
                    <span className="font-medium text-gray-900">{text}</span>{' '}
                </div>
            </div>
        </div>
    );
};

export default CriteriaFilterElement;
