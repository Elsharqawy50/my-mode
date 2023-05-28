export const editIDsInArray = (array) => {
  return array.map((collage, i) => {
    return { ...collage, id: i + 1 };
  });
};
