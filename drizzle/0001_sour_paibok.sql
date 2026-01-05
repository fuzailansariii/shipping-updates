ALTER TABLE "products" RENAME COLUMN "_id" TO "id";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "auther" TO "author";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "english" TO "language";--> statement-breakpoint
ALTER TABLE "inventory_logs" DROP CONSTRAINT "inventory_logs_product_id_products__id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_products__id_fk";
--> statement-breakpoint
ALTER TABLE "inventory_logs" ADD CONSTRAINT "inventory_logs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;