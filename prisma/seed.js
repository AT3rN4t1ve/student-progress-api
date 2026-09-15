const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const students = [
    { name: "Somchai Jaidee", email: "somchai.j@example.com", major: "Computer Science" },
    { name: "Suda Meechai", email: "suda.m@example.com", major: "Information Technology" },
    { name: "Anan Wongsa", email: "anan.w@example.com", major: "Software Engineering" },
  ];

  for (const s of students) {
    const student = await prisma.student.upsert({
      where: { email: s.email },
      update: {},
      create: s,
    });

    await prisma.progress.upsert({
      where: { student_subject_unique: { studentId: student.id, subject: "Database Systems" } },
      update: {},
      create: { studentId: student.id, subject: "Database Systems", status: "COMPLETED" },
    });

    await prisma.progress.upsert({
      where: { student_subject_unique: { studentId: student.id, subject: "Web Development" } },
      update: {},
      create: { studentId: student.id, subject: "Web Development", status: "IN_PROGRESS" },
    });
  }

  console.log("Seed data created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
