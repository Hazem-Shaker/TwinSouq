export const unwindQuery = (fieldName: string, yes: boolean) => {
  return yes
    ? [
        {
          $unwind: {
            path: `$${fieldName}`,
            preserveNullAndEmptyArrays: true,
          },
        },
      ]
    : [];
};
