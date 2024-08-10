export default {
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',  // Ensure it covers both JS and JSX files
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
