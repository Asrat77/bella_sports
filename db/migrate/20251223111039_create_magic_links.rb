class CreateMagicLinks < ActiveRecord::Migration[8.1]
  def change
    create_table :magic_links, id: :uuid do |t|
      t.uuid :admin_id, null: false
      t.string :token, null: false, index: { unique: true }
      t.datetime :expires_at, null: false
      t.boolean :used, default: false
      t.string :ip_address
      t.string :user_agent

      t.timestamps
    end

    add_index :magic_links, :admin_id
    add_index :magic_links, :used
  end
end
