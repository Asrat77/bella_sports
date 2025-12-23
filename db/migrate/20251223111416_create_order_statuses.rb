class CreateOrderStatuses < ActiveRecord::Migration[8.1]
  def change
    create_table :order_statuses, id: :uuid do |t|
      t.uuid :order_id, null: false
      t.string :status, null: false  # pending | confirmed | delivered | cancelled
      t.uuid :creator_id  # Admin who changed status

      t.timestamps
    end

    add_index :order_statuses, :order_id
    add_index :order_statuses, :status
    add_index :order_statuses, [ :order_id, :status ], unique: true
  end
end
