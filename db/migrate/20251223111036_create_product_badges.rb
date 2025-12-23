class CreateProductBadges < ActiveRecord::Migration[8.1]
  def change
    create_table :product_badges, id: :uuid do |t|
      t.uuid :product_id, null: false
      t.string :badge_type, null: false  # new | best_seller

      t.timestamps
    end

    add_index :product_badges, :product_id
    add_index :product_badges, :badge_type
    add_index :product_badges, [ :product_id, :badge_type ], unique: true
  end
end
