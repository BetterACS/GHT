import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Create a schema for the Monster table.
// This is the structure of the table.
const MonsterSchema = new Schema({
  monster_id: Number,
  monster_name: String,
  element: String,
  rarity: Number,
  tame_rate: Number,
  image_url: String,
  foods: {
    type: Object,
    default: {},
  },
});

const MonsterModel = mongoose.model("Monster", MonsterSchema);
export default MonsterModel;