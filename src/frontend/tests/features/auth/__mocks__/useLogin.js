export default () => ({
  username: "",
  password: "",
  error: null,
  loading: false,
  handleUsernameChange: jest.fn(),
  handlePasswordChange: jest.fn(),
  handleSubmit: jest.fn(),
  handleCancel: jest.fn(),
});
