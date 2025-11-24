import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// users table
export const users = pgTable("users", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("USER"), // 'USER' | 'ADMIN'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

// sessions table
export const sessions = pgTable("sessions", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  userId: uuid("user_id")
    .notNull()
    // Ideally add a foreign key reference constraint to users.id:
    // .references(() => users.id, { onDelete: "cascade" })
    ,
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const products = pgTable("products", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sku: text("sku").notNull().unique(),
  priceCents: integer("price_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const inventory = pgTable("inventory", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  productId: uuid("product_id").notNull(),
  quantity: integer("quantity").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  userId: uuid("user_id").notNull(),
  status: text("status")
    .notNull()
    .default("PENDING"), // PENDING, PAID, SHIPPED, CANCELLED
  totalCents: integer("total_cents").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  orderId: uuid("order_id").notNull(),
  productId: uuid("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  priceCents: integer("price_cents").notNull(), // copy from product at time of order
});