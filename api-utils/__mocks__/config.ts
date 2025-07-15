const config = {
  get: jest.fn((key: string) => {
    if (key === "app.name") return "api-utils";
    if (key === "app.logLevel") return "info";
    return undefined;
  })
};

export default config;
