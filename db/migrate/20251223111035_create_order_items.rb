class CreateOrderItems < ActiveRecord::Migration[8.1]
  def change
    create_table :order_items, id: :uuid do |t|
      t.uuid :order_id, null: false
      t.uuid :product_id
      t.jsonb :product_snapshot, null: false  # name, price, image at order time
      t.string :size, null: false
      t.string :customization_name
      t.string :customization_number
      t.integer :customization_price, default: 0
      t.integer :unit_price, null: false
      t.integer :quantity, default: 1, null: false
      t.integer :line_total, null: false

      t.timestamps
    end

    add_index :order_items, :order_id
    add_index :order_items, :product_id
  end
end
