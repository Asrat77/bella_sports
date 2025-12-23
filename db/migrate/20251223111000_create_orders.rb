class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders, id: :uuid do |t|
      t.string :customer_name, null: false
      t.string :customer_phone, null: false
      t.string :email
      t.string :delivery_method, null: false, default: "delivery"
      t.integer :delivery_fee, default: 0
      t.integer :subtotal, null: false
      t.integer :total, null: false

      # Pickup fields
      t.uuid :branch_id

      # Delivery fields
      t.string :area
      t.string :landmark
      t.string :house_number
      t.text :delivery_notes

      # Payment (for Chapa future)
      t.string :payment_method, default: "cod"  # cod | chapa
      t.string :payment_status, default: "pending"  # pending | paid | failed
      t.string :payment_reference  # Chapa transaction ID

      # Tracking
      t.string :tracking_code, null: false, index: { unique: true }

      t.timestamps
    end

    add_index :orders, :branch_id
    add_index :orders, :delivery_method
    add_index :orders, :payment_status
  end
end
