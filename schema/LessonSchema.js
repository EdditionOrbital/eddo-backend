import mongoose from "mongoose"
const schemaTypes = mongoose.Schema.Types

const LessonSchema = mongoose.Schema({
    code: { type: schemaTypes.String, required: true },
    moduleId: { type: schemaTypes.String, required: true },
    startTime: { type: schemaTypes.String, required: true },
    endTime: { type: schemaTypes.String, required: true },
    venue: { type: schemaTypes.String, required: false },
    day: { type: schemaTypes.String, required: true },
    weeks: { type: [schemaTypes.Number], required: true },
    lessonType: { type: schemaTypes.String, required: true },
})

const Lesson = mongoose.model('Lesson', LessonSchema)

export default Lesson