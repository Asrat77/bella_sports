class CreateInventoryRecords < ActiveRecord::Migration[8.1]
  def change
    create_table :inventory_records, id: :uuid do |t|
      t.uuid :product_id, null: false
      t.string :size, null: false
      t.integer :quantity, default: 0

      t.timestamps
    end

    add_index :inventory_records, :product_id
    add_index :inventory_records, [ :product_id, :size ], unique: true
  end
end
