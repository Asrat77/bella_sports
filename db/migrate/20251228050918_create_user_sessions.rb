class CreateUserSessions < ActiveRecord::Migration[8.1]
  def change
    create_table :user_sessions, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.uuid :user_id, null: false
      t.string :token, null: false
      t.datetime :expires_at, null: false
      t.datetime :last_used_at

      t.timestamps
    end
    add_index :user_sessions, :token, unique: true
    add_index :user_sessions, :user_id
    add_index :user_sessions, :expires_at
    add_foreign_key :user_sessions, :users
  end
end
