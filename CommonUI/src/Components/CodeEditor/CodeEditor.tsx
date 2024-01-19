import CodeType from 'Common/Types/Code/CodeType';

import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState,
} from 'react';

import Editor from '@monaco-editor/react';

export interface ComponentProps {
    initialValue?: undefined | string;
    onClick?: undefined | (() => void);
    placeholder?: undefined | string;
    className?: undefined | string;
    onChange?: undefined | ((value: string) => void);
    readOnly?: boolean | undefined;
    type: CodeType;
    onFocus?: (() => void) | undefined;
    onBlur?: (() => void) | undefined;
    dataTestId?: string;
    tabIndex?: number | undefined;
    error?: string | undefined;
    value?: string | undefined;
    showLineNumbers?: boolean | undefined;
}

const CodeEditor: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    let className: string = '';

    const [placeholder, setPlaceholder] = useState<string>('');
    const [helpText, setHelpText] = useState<string>('');

    useEffect(() => {
        setValue(props.value || '');
    }, [props.value]);

    useEffect(() => {
        if (props.placeholder) {
            if (props.type === CodeType.Markdown) {
                setHelpText(`${props.placeholder}. This is in Markdown`);
            }

            if (props.type === CodeType.HTML) {
                setHelpText(`${props.placeholder}. This is in HTML`);
            }

            if (props.type === CodeType.JavaScript) {
                setPlaceholder(
                    `// ${props.placeholder}. This is in JavaScript.`
                );
            }

            if (props.type === CodeType.JSON) {
                setHelpText(`${props.placeholder}`);
            }

            if (props.type === CodeType.CSS) {
                setPlaceholder(`/* ${props.placeholder}. This is in CSS. */`);
            }
        }
    }, [props.placeholder, props.type]);

    if (!props.className) {
        className =
            'block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm';
    } else {
        className = props.className;
    }

    if (props.error) {
        className =
            'block w-full rounded-md border bg-white py-2 pl-3 pr-3 text-sm placeholder-gray-500 focus:border-red-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 sm:text-sm border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500';
    }

    const [value, setValue] = useState<string>('');

    useEffect(() => {
        setValue(props.initialValue || '');
    }, [props.initialValue]);

    return (
        <div
            data-testid={props.dataTestId}
            onClick={() => {
                props.onClick && props.onClick();
                props.onFocus && props.onFocus();
            }}
        >
            {helpText && (
                <p className="bg-gray-50 text-gray-500 p-3 mt-2 mb-2 rounded text-base text-sm">
                    {' '}
                    {helpText}{' '}
                </p>
            )}

            <Editor
                defaultLanguage={props.type}
                height="30vh"
                value={value}
                onChange={(code: string | undefined) => {
                    if (code === undefined) {
                        code = '';
                    }

                    setValue(code);
                    props.onBlur && props.onBlur();
                    props.onChange && props.onChange(code);
                }}
                defaultValue={props.initialValue || placeholder || ''}
                className={className}
                options={{
                    acceptSuggestionOnCommitCharacter: true,
                    acceptSuggestionOnEnter: 'on',
                    accessibilitySupport: 'auto',
                    fontSize: 14,
                    automaticLayout: true,
                    codeLens: false,
                    colorDecorators: true,
                    contextmenu: false,
                    cursorBlinking: 'blink',
                    tabIndex: props.tabIndex || 0,
                    minimap: { enabled: false },
                    cursorStyle: 'line',
                    disableLayerHinting: false,
                    disableMonospaceOptimizations: false,
                    dragAndDrop: false,
                    fixedOverflowWidgets: false,
                    folding: true,
                    foldingStrategy: 'auto',
                    fontLigatures: false,
                    formatOnPaste: false,
                    formatOnType: false,

                    hideCursorInOverviewRuler: false,
                    links: true,
                    mouseWheelZoom: false,
                    multiCursorMergeOverlapping: true,
                    multiCursorModifier: 'alt',
                    overviewRulerBorder: true,
                    overviewRulerLanes: 2,
                    quickSuggestions: true,
                    quickSuggestionsDelay: 100,
                    readOnly: props.readOnly || false,
                    renderControlCharacters: false,
                    scrollbar: {
                        horizontal: 'hidden',
                    },
                    renderLineHighlight: 'all',
                    renderWhitespace: 'none',
                    revealHorizontalRightPadding: 30,
                    roundedSelection: true,
                    rulers: [],
                    scrollBeyondLastColumn: 5,
                    scrollBeyondLastLine: true,
                    selectOnLineNumbers: true,
                    lineNumbers: props.showLineNumbers ? 'on' : 'off',
                    selectionClipboard: true,
                    selectionHighlight: true,
                    showFoldingControls: 'mouseover',
                    smoothScrolling: false,
                    suggestOnTriggerCharacters: true,
                    wordBasedSuggestions: 'off',
                    wordWrap: props.type === CodeType.Markdown ? 'on' : 'off',
                }}
            />
            {props.error && (
                <p className="mt-1 text-sm text-red-400">{props.error}</p>
            )}
        </div>
    );
};

export default CodeEditor;
