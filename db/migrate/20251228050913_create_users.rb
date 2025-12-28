class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :telegram_id, null: false
      t.string :first_name, null: false
      t.string :last_name
      t.string :username
      t.string :email
      t.string :phone_number
      t.string :photo_url
      t.integer :store_credit_balance, default: 0, null: false
      t.boolean :active, default: true, null: false

      t.timestamps
    end
    add_index :users, :telegram_id, unique: true
    add_index :users, :email
    add_index :users, :phone_number
    add_index :users, :active
  end
end
