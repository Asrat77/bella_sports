class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products, id: :uuid do |t|
      t.string :name, null: false
      t.integer :price, null: false  # Store in cents for precision
      t.string :category, null: false
      t.string :league
      t.integer :customization_price, default: 50000  # 500 ETB default
      t.text :description
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :products, :category
    add_index :products, :league
    add_index :products, [ :active, :category ]
  end
end
