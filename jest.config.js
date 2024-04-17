module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}', // Adjust this pattern to match your file structure
        '!src/**/*.d.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: -10,
        },
    },
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
};