class CreateBranches < ActiveRecord::Migration[8.1]
  def change
    create_table :branches, id: :uuid do |t|
      t.string :name, null: false
      t.string :address, null: false
      t.string :phone
      t.boolean :active, default: true
      t.integer :sort_order, default: 0

      t.timestamps
    end

    add_index :branches, :active
    add_index :branches, :sort_order
  end
end
