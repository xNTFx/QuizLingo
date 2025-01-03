import '@testing-library/jest-dom';

Object.defineProperty(window, 'electronAPI', {
  writable: true,
  value: {
    send: jest.fn(),
    receive: jest.fn(),
    invoke: jest.fn(),
  },
});
