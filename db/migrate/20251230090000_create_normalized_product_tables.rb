class CreateNormalizedProductTables < ActiveRecord::Migration[8.1]
  def change
    create_table :clubs, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :name, null: false
      t.string :league
      t.string :country
      t.boolean :active, default: true
      t.timestamps
    end

    add_index :clubs, :name, unique: true
    add_index :clubs, :league
    add_index :clubs, :active

    create_table :seasons, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :name, null: false
      t.integer :sort_order, default: 0
      t.boolean :active, default: true
      t.timestamps
    end

    add_index :seasons, :name, unique: true
    add_index :seasons, :sort_order

    create_table :kit_categories, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :name, null: false
      t.boolean :has_kit_types, default: true
      t.integer :sort_order, default: 0
      t.timestamps
    end

    add_index :kit_categories, :name, unique: true
    add_index :kit_categories, :sort_order

    create_table :kit_types, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :kit_category, type: :uuid, foreign_key: true, null: false
      t.string :name, null: false
      t.integer :sort_order, default: 0
      t.timestamps
    end

    add_index :kit_types, [ :kit_category_id, :name ], unique: true
    add_index :kit_types, :sort_order

    create_table :product_categories, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :name, null: false
      t.string :age_group
      t.string :product_type
      t.integer :sort_order, default: 0
      t.timestamps
    end

    add_index :product_categories, :name, unique: true
    add_index :product_categories, :age_group
    add_index :product_categories, :product_type
  end
end
