export default interface Meal {
  id: string,
  name: string,
  instructions: string,
  tags: Array<string>,
  thumbUrl: string,
  youtubeUrl: string,
  ingredients: Array<Ingredients>
};
