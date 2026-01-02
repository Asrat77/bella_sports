class DropOrphanStockTransfersIndexes < ActiveRecord::Migration[7.1]
  def change
    # Remove the conflicting indexes directly
    if table_exists?(:stock_transfers)
      remove_index :stock_transfers, :from_branch_id, if_exists: true
      remove_index :stock_transfers, :to_branch_id, if_exists: true
      remove_index :stock_transfers, :product_id, if_exists: true
    end
  end
end
