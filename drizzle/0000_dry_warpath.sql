CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pdfs" (
	"_id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" real NOT NULL,
	"file_url" text NOT NULL,
	"file_size" text NOT NULL,
	"pages" integer NOT NULL,
	"topics" text[] NOT NULL,
	"thumbnail" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" text PRIMARY KEY NOT NULL,
	"pdf_id" text NOT NULL,
	"clerk_user_id" text NOT NULL,
	"buyer_email" text NOT NULL,
	"buyer_name" text NOT NULL,
	"amount" real NOT NULL,
	"razorpay_order_id" text,
	"razorpay_payment_id" text,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"download_count" integer DEFAULT 0 NOT NULL,
	"max_download" integer DEFAULT 3 NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_pdf_id_pdfs__id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("_id") ON DELETE cascade ON UPDATE no action;