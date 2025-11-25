import * as monaco from 'monaco-editor-core';

export const vqlLanguageID = 'vql';

interface MonacoEnvironment {
    getWorkerUrl: () => string;
}

export function setupVqlLanguage() {
    (window as any).MonacoEnvironment = {
        getWorkerUrl: function () {
            return './editor.worker.js';
        },
    } as MonacoEnvironment;

    monaco.languages.register({ id: vqlLanguageID });

    monaco.languages.onLanguage(vqlLanguageID, () => {
        monaco.languages.setMonarchTokensProvider(vqlLanguageID, vqlLanguage);
        monaco.languages.setLanguageConfiguration(vqlLanguageID, richLanguageConfiguration);
    });
}

const richLanguageConfiguration: monaco.languages.LanguageConfiguration = {
    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
    ],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
    ],
};

const vqlLanguage: monaco.languages.IMonarchLanguage = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: '',
    brackets: [{ open: '(', close: ')', token: 'delimiter.parenthesis' }],
    keywords: [
        'SELECT',
        'FROM',
        'WHERE',
        'FIND',
        'ORDER BY',
        'ORDER BY RANK',
        'MAXROWS',
        'SKIP',
        'PAGESIZE',
        'PAGEOFFSET',
        'AS',
    ],
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    ignoreCase: true,
    // The main tokenizer for our languages
    tokenizer: {
        root: [
            // identifiers and keywords
            [
                /[a-zA-Z_$][\w$]*/,
                {
                    cases: {
                        '\\b(CASEINSENSITIVE|DELETEDSTATE|OBSOLETESTATE|STEADYSTATE|SUPERSEDEDSTATE|LONGTEXT|RICHTEXT|STATETYPE|TODISPLAYFORMAT|TONAME)\\b':
                            'entity.vql.function',
                        '\\b(ALLVERSIONS|FAVORITES|LATESTVERSION|RECENT|SCOPEsCONTENT|SCOPEsALL)\\b':
                            'entity.vql.option',
                        '\\b(SELECT|FROM|WHERE|FIND|ORDERsBY|ORDERsBYsRANK|MAXROWS|SKIP|PAGESIZE|PAGEOFFSET|AS)\\b':
                            'keyword',
                        '@default': 'identifier',
                    },
                },
            ],
            // whitespace
            { include: '@whitespace' },
            // strings
            [/'.*?'/, 'string'],
            [/".*?"/, 'string'],
        ],
        whitespace: [[/[ \t\r\n]+/, '']],
        string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop'],
        ],
    },
};

export const VqlLightModeTheme: monaco.editor.IStandaloneThemeData = {
    base: 'vs',
    inherit: true,
    rules: [
        {
            token: 'keyword',
            foreground: '0000FF',
        },
        {
            token: 'entity.vql.function',
            foreground: 'FF00FF',
        },
        {
            token: 'entity.vql.option',
            foreground: '009999',
        },
        {
            token: 'string',
            foreground: '6aa84f',
        },
    ],
    colors: {},
};

export const VqlDarkModeTheme: monaco.editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        {
            token: 'keyword',
            foreground: '449FD7',
        },
        {
            token: 'entity.vql.function',
            foreground: 'FF00FF',
        },
        {
            token: 'entity.vql.option',
            foreground: '009999',
        },
        {
            token: 'string',
            foreground: '6aa84f',
        },
    ],
    colors: {
        'editor.background': '#303841',
        'editor.lineHighlightBackground': '#0000FF20',
    },
};
