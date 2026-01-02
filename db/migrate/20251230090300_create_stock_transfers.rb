class CreateStockTransfers < ActiveRecord::Migration[8.1]
  def change
    create_table :stock_transfers, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :from_branch, type: :uuid, foreign_key: { to_table: :branches }
      t.references :to_branch, type: :uuid, foreign_key: { to_table: :branches }
      t.references :product, type: :uuid, foreign_key: true
      t.string :size, null: false
      t.integer :quantity, null: false
      t.text :notes
      t.references :created_by_admin, type: :uuid, foreign_key: { to_table: :admins }
      t.timestamps
    end

    add_index :stock_transfers, :from_branch_id, name: "idx_stock_transfers_from_branch_id"
    add_index :stock_transfers, :to_branch_id, name: "idx_stock_transfers_to_branch_id"
    add_index :stock_transfers, :product_id, name: "idx_stock_transfers_product_id"
    add_index :stock_transfers, :created_by_admin_id, name: "idx_stock_transfers_created_by_admin_id"
  end
end
