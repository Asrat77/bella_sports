# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_12_23_111416) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "admins", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admins_on_email", unique: true
  end

  create_table "branches", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "active", default: true
    t.string "address", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "phone"
    t.integer "sort_order", default: 0
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_branches_on_active"
    t.index ["sort_order"], name: "index_branches_on_sort_order"
  end

  create_table "inventory_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "product_id", null: false
    t.integer "quantity", default: 0
    t.string "size", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id", "size"], name: "index_inventory_records_on_product_id_and_size", unique: true
    t.index ["product_id"], name: "index_inventory_records_on_product_id"
  end

  create_table "magic_links", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "admin_id", null: false
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.string "ip_address"
    t.string "token", null: false
    t.datetime "updated_at", null: false
    t.boolean "used", default: false
    t.string "user_agent"
    t.index ["admin_id"], name: "index_magic_links_on_admin_id"
    t.index ["token"], name: "index_magic_links_on_token", unique: true
    t.index ["used"], name: "index_magic_links_on_used"
  end

  create_table "order_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "customization_name"
    t.string "customization_number"
    t.integer "customization_price", default: 0
    t.integer "line_total", null: false
    t.uuid "order_id", null: false
    t.uuid "product_id"
    t.jsonb "product_snapshot", null: false
    t.integer "quantity", default: 1, null: false
    t.string "size", null: false
    t.integer "unit_price", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_order_items_on_order_id"
    t.index ["product_id"], name: "index_order_items_on_product_id"
  end

  create_table "order_statuses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "creator_id"
    t.uuid "order_id", null: false
    t.string "status", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id", "status"], name: "index_order_statuses_on_order_id_and_status", unique: true
    t.index ["order_id"], name: "index_order_statuses_on_order_id"
    t.index ["status"], name: "index_order_statuses_on_status"
  end

  create_table "orders", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "area"
    t.uuid "branch_id"
    t.datetime "created_at", null: false
    t.string "customer_name", null: false
    t.string "customer_phone", null: false
    t.integer "delivery_fee", default: 0
    t.string "delivery_method", default: "delivery", null: false
    t.text "delivery_notes"
    t.string "email"
    t.string "house_number"
    t.string "landmark"
    t.string "payment_method", default: "cod"
    t.string "payment_reference"
    t.string "payment_status", default: "pending"
    t.integer "subtotal", null: false
    t.integer "total", null: false
    t.string "tracking_code", null: false
    t.datetime "updated_at", null: false
    t.index ["branch_id"], name: "index_orders_on_branch_id"
    t.index ["delivery_method"], name: "index_orders_on_delivery_method"
    t.index ["payment_status"], name: "index_orders_on_payment_status"
    t.index ["tracking_code"], name: "index_orders_on_tracking_code", unique: true
  end

  create_table "product_badges", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "badge_type", null: false
    t.datetime "created_at", null: false
    t.uuid "product_id", null: false
    t.datetime "updated_at", null: false
    t.index ["badge_type"], name: "index_product_badges_on_badge_type"
    t.index ["product_id", "badge_type"], name: "index_product_badges_on_product_id_and_badge_type", unique: true
    t.index ["product_id"], name: "index_product_badges_on_product_id"
  end

  create_table "products", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "active", default: true
    t.string "category", null: false
    t.datetime "created_at", null: false
    t.integer "customization_price", default: 50000
    t.text "description"
    t.string "league"
    t.string "name", null: false
    t.integer "price", null: false
    t.datetime "updated_at", null: false
    t.index ["active", "category"], name: "index_products_on_active_and_category"
    t.index ["category"], name: "index_products_on_category"
    t.index ["league"], name: "index_products_on_league"
  end
end
