-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL DEFAULT '',
    "embedUrl" TEXT,
    "localPath" TEXT,
    "cloudType" TEXT NOT NULL DEFAULT '',
    "cloudUrl" TEXT NOT NULL DEFAULT '',
    "cloudPassword" TEXT NOT NULL DEFAULT '',
    "instructor" TEXT NOT NULL DEFAULT '',
    "section" TEXT NOT NULL DEFAULT 'xingce',
    "categoryId" INTEGER,
    "durationSec" INTEGER,
    "thumbnailUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Video_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("categoryId", "createdAt", "description", "durationSec", "embedUrl", "id", "instructor", "localPath", "section", "sortOrder", "thumbnailUrl", "title", "updatedAt", "url") SELECT "categoryId", "createdAt", "description", "durationSec", "embedUrl", "id", "instructor", "localPath", "section", "sortOrder", "thumbnailUrl", "title", "updatedAt", "url" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
