import Database from "better-sqlite3";
import { PrismaClient } from "@prisma/client";

const SQLITE_PATH =
  process.env["SQLITE_PATH"] || "../knowledge-base/instance/knowledge.db";

async function migrate() {
  const prisma = new PrismaClient();
  const sqlite = new Database(SQLITE_PATH, { readonly: true });

  console.log("Connected to SQLite at", SQLITE_PATH);
  console.log("Connected to Prisma");

  const categories = sqlite
    .prepare("SELECT * FROM categories ORDER BY id")
    .all() as any[];
  console.log(`Found ${categories.length} categories`);

  const categoryIdMap = new Map<number, number>();

  for (const cat of categories) {
    const slug = cat.name
      .replace(/[^\w一-鿿]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: { slug, description: cat.description },
      create: { name: cat.name, slug, description: cat.description },
    });
    categoryIdMap.set(cat.id, created.id);
  }
  console.log("Categories migrated");

  const entries = sqlite
    .prepare("SELECT * FROM entries ORDER BY id")
    .all() as any[];
  console.log(`Found ${entries.length} entries`);

  for (const entry of entries) {
    const newCatId = categoryIdMap.get(entry.category_id) || 6;
    await prisma.entry.create({
      data: {
        title: entry.title,
        content: entry.content,
        categoryId: newCatId,
        createdAt: new Date(entry.created_at),
        updatedAt: new Date(entry.updated_at),
      },
    });
  }
  console.log("Entries migrated");

  const tagRows = sqlite
    .prepare("SELECT * FROM tags ORDER BY id")
    .all() as any[];
  const tagIdMap = new Map<number, number>();

  for (const tag of tagRows) {
    const created = await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: { name: tag.name },
    });
    tagIdMap.set(tag.id, created.id);
  }
  console.log(`Migrated ${tagRows.length} tags`);

  const entryTags = sqlite
    .prepare("SELECT * FROM entry_tags")
    .all() as any[];
  for (const et of entryTags) {
    const newTagId = tagIdMap.get(et.tag_id);
    if (newTagId) {
      try {
        await prisma.entryTag.create({
          data: { entryId: et.entry_id, tagId: newTagId },
        });
      } catch {
        // skip duplicates
      }
    }
  }
  console.log(`Migrated ${entryTags.length} entry-tag associations`);

  const videos = sqlite
    .prepare("SELECT * FROM videos ORDER BY id")
    .all() as any[];
  for (const v of videos) {
    const newCatId = v.category_id ? categoryIdMap.get(v.category_id) : null;
    const section = v.section === "shenlun" ? "shenlun" : "xingce";
    await prisma.video.create({
      data: {
        title: v.title,
        url: v.url,
        instructor: v.instructor,
        description: v.description,
        section: section as any,
        categoryId: newCatId,
        sortOrder: v.sort_order,
        createdAt: new Date(v.created_at),
      },
    });
  }
  console.log(`Migrated ${videos.length} videos`);

  const papers = sqlite
    .prepare("SELECT * FROM papers ORDER BY id")
    .all() as any[];
  for (const p of papers) {
    await prisma.paper.create({
      data: {
        title: p.title,
        paperYear: p.paper_year,
        paperType: p.paper_type,
        content: p.content,
        source: p.source,
        examType: "xingce",
        createdAt: new Date(p.created_at),
      },
    });
  }
  console.log(`Migrated ${papers.length} papers`);

  try {
    await prisma.userPreference.create({
      data: { userId: "default", theme: "system", fontSize: "medium" },
    });
  } catch {
    // already exists
  }

  sqlite.close();
  await prisma.$disconnect();
  console.log("\nMigration complete!");
}

migrate().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
