import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

// PDF TABLE
export const pdfs = pgTable("pdfs", {
  id: text("_id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: text("file_size").notNull(),
  // pages: integer("pages").notNull(),
  topics: text("topics").array().notNull(),
  thumbnail: text("thumbnail"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// PURCHASE TABLE
export const purchases = pgTable("purchases", {
  id: text("id").primaryKey(),
  pdfId: text("pdf_id")
    .notNull()
    .references(() => pdfs.id, { onDelete: "cascade" }),
  clerkUserId: text("clerk_user_id").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  buyerName: text("buyer_name").notNull(),
  amount: real("amount").notNull(),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  paymentStatus: paymentStatusEnum("payment_status")
    .default("pending")
    .notNull(),
  downloadCount: integer("download_count").default(0).notNull(),
  maxDownload: integer("max_download").default(3).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// MESSAGE TABLE
export const contactMessages = pgTable("contact_messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// TYPES FOR TYPESCRIPT
export type PDF = typeof pdfs.$inferSelect;
export type NewPDF = typeof pdfs.$inferInsert;

export type Purchase = typeof purchases.$inferSelect;
export type NewPurchase = typeof purchases.$inferInsert;

export type Message = typeof contactMessages.$inferSelect;
export type NewMessage = typeof contactMessages.$inferInsert;
