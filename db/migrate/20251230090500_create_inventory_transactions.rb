class CreateInventoryTransactions < ActiveRecord::Migration[8.1]
  def change
    create_table :inventory_transactions, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :product, type: :uuid, foreign_key: true
      t.references :branch, type: :uuid, foreign_key: true
      t.string :size, null: false
      t.integer :quantity, null: false
      t.references :source, polymorphic: true
      t.timestamps
    end

    add_index :inventory_transactions, :product_id, name: "idx_inventory_transactions_product_id"
    add_index :inventory_transactions, :branch_id, name: "idx_inventory_transactions_branch_id"
    add_index :inventory_transactions, [ :source_type, :source_id ], name: "idx_inventory_transactions_source"
  end
end
