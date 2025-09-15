export const mockWindowLocation = (hostname = "localhost") => {
  Object.defineProperty(window, "location", {
    writable: true,
    value: { hostname },
  });
};
