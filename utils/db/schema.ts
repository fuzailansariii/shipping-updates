import { relations } from "drizzle-orm";
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

export const productTypeEnum = pgEnum("product_type", ["book", "pdf"]);

export const paymentMethodEnum = pgEnum("payment_method", ["razorpay", "cod"]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "failed",
]);

// ============================================
// ----------- ADDRESSES TABLE
// ============================================

export const addresses = pgTable("addresses", {
  id: text("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  fullName: text("fullname").notNull(),
  phone: text("phone").notNull(),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  landmark: text("landmark"),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ============================================
// ----------- PRODUCTS TABLE
// ============================================
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  type: productTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  // pages: integer("pages"),
  topics: text("topics").array().notNull(),
  images: text("images").array().notNull().default([]),
  thumbnail: text("thumbnail").notNull(),
  // weight: real("weight"),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  isbn: text("isbn"),
  publisher: text("publisher"),
  author: text("author"),
  edition: text("edition"),
  language: text("language").notNull().default("English"),

  // Pdf Specified field(null for books)
  fileUrl: text("file_url"),
  fileSize: integer("file_size"),
  // pages: integer("pages").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ============================================
// ----------- ORDERS TABLE
// ============================================
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  clerkUserId: text("clerk_user_id").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  buyerName: text("buyer_name").notNull(),
  buyerPhone: text("buyer_phone").notNull(),

  shippingAddress: text("shipping_address").notNull(),
  // can be same as shipping address
  billingAddress: text("billing_address"),

  // Order financials
  subTotal: real("subtotal").notNull(),
  shippingCharges: real("shipping_charges").notNull().default(0),
  tax: real("tax").notNull().default(0),
  discount: real("discount").notNull().default(0),
  totalAmount: real("total_amount").notNull(),

  // Payment Information
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  paymentStatus: paymentStatusEnum("payment_status")
    .default("pending")
    .notNull(),

  // Order fulfillment (for physical books)
  orderStatus: orderStatusEnum("order_status").default("pending").notNull(),
  awbNumber: text("awb_number"), // Air Waybill number: courier tracking number
  courierPartner: text("courier_partner"), // Bluedart, delhivery
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),

  // Additional information
  notes: text("notes"), // Admin or customer notes

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ============================================
// ----------- ORDER ITEMS TABLE
// ============================================

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }), // Delete items if order deleted
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }), // Prevent product deletion if ordered
  productType: productTypeEnum("product_type").notNull(),
  productTitle: text("product_title").notNull(), // Store title in case product is updated later

  // Order item details
  quantity: integer("quantity").notNull(), // Number of units
  unitPrice: real("unit_price").notNull(), // Price per unit at purchase time
  totalPrice: real("total_price").notNull(), // quantity × unitPrice

  // PDF-specific tracking
  downloadCount: integer("download_count").notNull().default(0), // For PDFs only
  maxDownloads: integer("max_downloads").notNull().default(3), // For PDFs only
  // Timestamp
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// INVENTORY LOGS TABLE (optional but recommended)
// ============================================

export const inventoryActionEnum = pgEnum("inventory_action", [
  "stock_in", // New stock added
  "stock_out", // Stock removed (damage, loss, etc.)
  "sale", // Sold via order
  "adjustment", // Manual correction
]);

export const inventoryLogs = pgTable("inventory_logs", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  action: inventoryActionEnum("action").notNull(),
  quantity: integer("quantity").notNull(),
  previousStock: integer("previous_stock").notNull(),
  newStock: integer("new_stock").notNull(),
  reason: text("reason"), // e.g., "New shipment", "Damaged", "Order #SU2025001"
  createdBy: text("created_by"), // Clerk user ID of admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// ----------- MESSAGE TABLE
// ============================================
export const contactMessages = pgTable("contact_messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// ----------- RELATIONS
// ============================================

// Products can have many order items and inventory logs
export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  inventoryLogs: many(inventoryLogs),
}));

// One order can have many order items
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

// orderItems belongs to one order and one product
export const orderItemsRelation = relations(orderItems, ({ one }) => ({
  orders: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  products: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// InventoryLogs belong to one product
export const inventoryRelations = relations(inventoryLogs, ({ one }) => ({
  product: one(products, {
    fields: [inventoryLogs.productId],
    references: [products.id],
  }),
}));

// one address can have multiple orders
export const addressesRelations = relations(addresses, ({ many }) => ({
  orders: many(orders),
}));
// one order can have multiple order items
export const orderRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

// ============================================
// ----------- TYPES FOR TYPESCRIPT
// ============================================

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type InventoryLogs = typeof inventoryLogs.$inferSelect;
export type NewInventoryLogs = typeof inventoryLogs.$inferInsert;

export type Message = typeof contactMessages.$inferSelect;
export type NewMessage = typeof contactMessages.$inferInsert;
