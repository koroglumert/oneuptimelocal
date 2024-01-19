import URL from '../API/URL';
import Phone from '../Phone';

export interface Say {
    sayMessage: string;
}

export interface OnCallInputRequest {
    [x: string]: Say; // input.
    default: Say; // what if there is no input or invalid input.
}

export interface GatherInput {
    introMessage: string;
    numDigits: number;
    timeoutInSeconds: number;
    noInputMessage: string;
    onInputCallRequest: OnCallInputRequest;
    responseUrl: URL;
}

export enum CallAction {}

export interface CallRequestMessage {
    data: Array<Say | CallAction | GatherInput>;
}

export default interface CallRequest extends CallRequestMessage {
    to: Phone;
}

export const isHighRiskPhoneNumber: Function = (
    phoneNumber: Phone
): boolean => {
    // Pakistan
    if (phoneNumber.toString().startsWith('+92')) {
        return true;
    }

    return false;
};
