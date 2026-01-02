class AddBranchToInventoryRecords < ActiveRecord::Migration[8.1]
  def change
    add_reference :inventory_records, :branch, type: :uuid, foreign_key: true

    add_index :inventory_records, [ :product_id, :branch_id, :size ], unique: true
  end
end
