-- CreateTable
CREATE TABLE "lessons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" TEXT NOT NULL,
    "day_order" INTEGER NOT NULL,
    "lesson_number" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "class_name" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "teacher" TEXT NOT NULL,
    "subject_normalized" TEXT NOT NULL,
    "class_name_normalized" TEXT NOT NULL,
    "teacher_normalized" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "lessons_day_idx" ON "lessons"("day");

-- CreateIndex
CREATE INDEX "lessons_day_order_idx" ON "lessons"("day_order");

-- CreateIndex
CREATE INDEX "lessons_class_name_idx" ON "lessons"("class_name");

-- CreateIndex
CREATE INDEX "lessons_teacher_idx" ON "lessons"("teacher");

-- CreateIndex
CREATE INDEX "lessons_subject_idx" ON "lessons"("subject");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_class_name_day_lesson_number_key" ON "lessons"("class_name", "day", "lesson_number");
