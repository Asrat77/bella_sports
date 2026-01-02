class CreateGiveaways < ActiveRecord::Migration[8.1]
  def change
    create_table :giveaways, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :product, type: :uuid, foreign_key: true
      t.string :size, null: false
      t.integer :quantity, default: 1
      t.string :recipient_name
      t.string :recipient_contact
      t.text :reason
      t.string :status, default: "pending"
      t.text :admin_notes
      t.references :created_by_admin, type: :uuid, foreign_key: { to_table: :admins }
      t.timestamps
    end

    add_index :giveaways, :product_id, name: "idx_giveaways_product_id"
    add_index :giveaways, :status, name: "idx_giveaways_status"
    add_index :giveaways, :created_by_admin_id, name: "idx_giveaways_created_by_admin_id"
  end
end
