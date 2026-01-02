class AddProductReferences < ActiveRecord::Migration[8.1]
  def change
    add_reference :products, :club, type: :uuid, foreign_key: true
    add_reference :products, :season, type: :uuid, foreign_key: true
    add_reference :products, :kit_category, type: :uuid, foreign_key: true
    add_reference :products, :kit_type, type: :uuid, foreign_key: true
    add_reference :products, :product_category, type: :uuid, foreign_key: true

    remove_column :products, :category, :string
    remove_column :products, :league, :string
  end
end
